import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Staff from "./Staff.js";
import Complaint from "./Complaint.js";

const managerSchema = new mongoose.Schema(
  {
    managerId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    deptName: {
      type: String,
      required: true,
      enum: ["road", "water", "garbage"],
      unique: true, // ensures only one manager per department
    },
    accessToken: {
      token: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
    refreshToken: {
      token: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

// Password hashing
managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
managerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT access & refresh tokens
managerSchema.methods.generateAuthTokens = async function () {
  const manager = this;

  const accessToken = jwt.sign(
    { id: manager._id, role: "manager", deptName: manager.deptName },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: manager._id, role: "manager" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  manager.accessToken = { token: accessToken, createdAt: new Date() };
  manager.refreshToken = { token: refreshToken, createdAt: new Date() };
  await manager.save();

  return { accessToken, refreshToken };
};

// Assign complaint to staff
managerSchema.methods.assignComplaintToStaff = async function (complaintId, staffId) {
  const complaint = await Complaint.findById(complaintId);
  const staff = await Staff.findById(staffId);

  if (!complaint) throw new Error("Complaint not found");
  if (!staff) throw new Error("Staff not found");
  if (staff.deptName !== this.deptName)
    throw new Error("Cannot assign complaint to staff outside your department");
  if ((staff.complaintsAssigned ?? 0) >= 5)
    throw new Error("Staff is handling maximum complaints");

  complaint.assignedStaff = staff._id;
  complaint.status = "being_processed";
  await complaint.save();

  await Staff.findByIdAndUpdate(staff._id, { $inc: { complaintsAssigned: 1 } });

  return complaint;
};

// Mark complaint as elapsed
managerSchema.methods.markComplaintElapsed = async function (complaintId) {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new Error("Complaint not found");

  complaint.status = "elapsed";
  await complaint.save();
  return complaint;
};

// Increment staff's complaintsSolved and decrement complaintsAssigned
managerSchema.methods.incrementStaffSolved = async function (staffId) {
  const staff = await Staff.findById(staffId);
  if (!staff) throw new Error("Staff not found");

  await Staff.findByIdAndUpdate(staff._id, {
    $inc: { complaintsSolved: 1, complaintsAssigned: -1 },
  });

  return await Staff.findById(staff._id);
};

const Manager = mongoose.model("Manager", managerSchema);
export default Manager;
