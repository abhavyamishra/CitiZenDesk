import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
      unique: true,
    },
    staffName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    deptName: {
      type: String,
      required: true,
      enum: ["road", "water", "garbage"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    complaintsAssigned: {
      type: Number,
      default: 0,
    },
    complaintsSolved: {
      type: Number,
      default: 0,
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
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
staffSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT access & refresh tokens
staffSchema.methods.generateAuthTokens = async function () {
  const staff = this;

  const accessToken = jwt.sign(
    { id: staff._id, role: "staff", deptName: staff.deptName },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: staff._id, role: "staff" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  staff.accessToken = { token: accessToken, createdAt: new Date() };
  staff.refreshToken = { token: refreshToken, createdAt: new Date() };
  await staff.save();

  return { accessToken, refreshToken };
};

// Staff can only update status of assigned complaints
staffSchema.methods.updateComplaintStatus = async function (complaint, newStatus) {
  if (!complaint) throw new Error("Complaint not found");
  if (!["completed", "completed_late"].includes(newStatus)) {
    throw new Error("Staff can only mark complaint as completed or completed_late");
  }
  if (complaint.assignedStaff.toString() !== this._id.toString()) {
    throw new Error("You are not assigned to this complaint");
  }

  complaint.status = newStatus;
  await complaint.save();

  // Update solved/assigned counters
  this.complaintsSolved += 1;
  this.complaintsAssigned = Math.max(0, this.complaintsAssigned - 1);
  await this.save();

  return complaint;
};

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
