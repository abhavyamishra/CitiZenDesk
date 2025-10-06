import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Complaint from "./Complaint.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    complaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
      },
    ],
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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT access & refresh tokens
userSchema.methods.generateAuthTokens = async function () {
  const user = this;

  const accessToken = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  user.accessToken = { token: accessToken, createdAt: new Date() };
  user.refreshToken = { token: refreshToken, createdAt: new Date() };
  await user.save();

  return { accessToken, refreshToken };
};

// Fetch only complaints raised by this user
userSchema.methods.getMyComplaints = async function () {
  await this.populate({
    path: "complaints",
    select: "-__v",
  });
  return this.complaints;
};

// Prevent duplicate complaints unless previous is resolved
userSchema.statics.canRaiseComplaint = async function (userId, locality, deptName) {
  const user = await this.findById(userId).populate("complaints");
  if (!user) throw new Error("User not found");

  // Check for unresolved complaints in same locality & department
  const unresolved = user.complaints.find(
    (c) =>
      c.locality === locality &&
      c.deptName === deptName &&
      ["active", "being_processed", "elapsed"].includes(c.status)
  );

  return !unresolved;
};

const User = mongoose.model("User", userSchema);
export default User;
