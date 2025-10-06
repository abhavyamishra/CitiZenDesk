import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const managerSchema = new mongoose.Schema({
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
  tokens: [
    {
      token: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  deptName: {
    type: String,
    required: true,
    enum: ["road", "water", "garbage"], 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

managerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

managerSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, managerId: this.managerId, deptName: this.deptName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

managerSchema.methods.assignComplaintToStaff = async function (complaint, staff) {
  if (staff.deptName !== this.deptName) {
    throw new Error("Cannot assign complaint to staff from another department");
  }

  complaint.assignedStaff = staff._id;
  complaint.status = "being_processed";
  await complaint.save();

  staff.complaintsAssigned = (staff.complaintsAssigned || 0) + 1;
  await staff.save();

  return complaint;
};

const Manager = mongoose.model("Manager", managerSchema);
export default Manager;
