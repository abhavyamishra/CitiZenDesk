import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String, // Only for local accounts
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    providerId: {
      type: String, // OAuth provider ID
    },
    role: {
      type: String,
      enum: ["user", "staff", "manager", "admin"],
      required: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "role",
    },
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Password hashing for local accounts
authSchema.pre("save", async function (next) {
  if (this.provider !== "local") return next();
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password for local accounts
authSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.provider !== "local") throw new Error("No local password for OAuth account");
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add a new refresh token
authSchema.methods.addRefreshToken = async function (token) {
  this.refreshTokens.push({ token, createdAt: new Date() });
  await this.save();
  return token;
};

// Remove a refresh token
authSchema.methods.removeRefreshToken = async function (token) {
  this.refreshTokens = this.refreshTokens.filter((t) => t.token !== token);
  await this.save();
};

// Validate if a refresh token exists
authSchema.methods.isValidRefreshToken = function (token) {
  return this.refreshTokens.some((t) => t.token === token);
};

const Auth = mongoose.model("Auth", authSchema);
export default Auth;
