import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const staffSchema = new mongoose.Schema({
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
  },
  deptName: {
    type: String,
    required: true,
    enum: ["road", "water", "garbage"], 
  },
  complaintsSolved: {
    type: Number,
    default: 0,
  },
  complaintsAssigned: {
    type: Number,
    default: 0,
  },
  accessToken: {
      token: { type: String },
    },
    refreshToken: {
      token: { type: String },
    },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

staffSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

staffSchema.methods.generateAuthTokens = async function () {
  const staff = this;

  const accessToken = jwt.sign(
    {
      _id: staff._id.toString(),
      role: "staff",
      department: staff.department,
      isManager: staff.isManager,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { _id: staff._id.toString(), role: "staff" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  staff.accessToken = { token: accessToken, createdAt: new Date() };
  staff.refreshToken = { token: refreshToken, createdAt: new Date() };
  await staff.save();

  return { accessToken, refreshToken };
};

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
