import Auth from "../models/Auth.js";
import User from "../models/User.js";
import Staff from "../models/Staff.js";
import Manager from "../models/Manager.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// USER REGISTRATION ONLY
export const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, locality } = req.body;

    // Check if email already exists in Auth
    const existing = await Auth.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    // Create user profile
    const userProfile = await User.create({ username, email, phone, password, locality });

    // Create Auth record
    const auth = await Auth.create({
      email,
      password,
      role: "user",
      profileId: userProfile._id,
      provider: "local",
    });

    const tokens = await userProfile.generateAuthTokens();

    res.status(201).json({ message: "User registered successfully", tokens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// UNIVERSAL LOGIN (all roles)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const auth = await Auth.findOne({ email });
    if (!auth)
      return res.status(400).json({ message: "Invalid credentials" });

    if (auth.provider !== "local")
      return res.status(400).json({ message: "OAuth login required" });

    const isMatch = await auth.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    let profile;
    switch (auth.role) {
      case "user":
        profile = await User.findById(auth.profileId);
        break;
      case "staff":
        profile = await Staff.findById(auth.profileId);
        break;
      case "manager":
        profile = await Manager.findById(auth.profileId);
        break;
      case "admin":
        profile = await Admin.findById(auth.profileId);
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    const tokens = await profile.generateAuthTokens();

    res.json({ message: "Login successful", tokens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// LOGOUT
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const auth = await Auth.findOne({ "refreshTokens.token": refreshToken });
    if (auth) {
      await auth.removeRefreshToken(refreshToken);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const auth = await Auth.findById(decoded.id);
    if (!auth || !auth.isValidRefreshToken(refreshToken)) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    let profile;
    switch (auth.role) {
      case "user":
        profile = await User.findById(auth.profileId);
        break;
      case "staff":
        profile = await Staff.findById(auth.profileId);
        break;
      case "manager":
        profile = await Manager.findById(auth.profileId);
        break;
      case "admin":
        profile = await Admin.findById(auth.profileId);
        break;
    }

    const tokens = await profile.generateAuthTokens();

    res.json({ message: "Token refreshed", tokens });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
