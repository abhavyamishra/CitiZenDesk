import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, 
      default: "",
    },
  
    accessToken: {
      token: { type: String },
    },
    refreshToken: {
      token: { type: String },
    },
  },
  {
    timestamps: true, 
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthTokens = async function () {
  const user = this;

  const accessToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } 
  );

  const refreshToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } 
  );

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};


const User = mongoose.model("User", userSchema);

export default User;
