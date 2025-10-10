import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    managedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
  },
  { timestamps: true }
);

// Password hashing
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT access & refresh tokens
adminSchema.methods.generateAuthTokens = async function () {
  const accessToken = jwt.sign(
    { id: this._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY || "1h" }
  );

  const refreshToken = jwt.sign(
    { id: this._id, role: "admin" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );

  // Save refresh token in DB
  this.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
  await this.save();

  return { accessToken, refreshToken };
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
