import Auth from "../models/auth.model.js";
import User from "../models/user.model.js";
import Staff from "../models/staff.model.js";
import Manager from "../models/manager.model.js";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // ✅ ensure bcrypt is imported

// ----------------------------
// UNIVERSAL REGISTRATION (User / Staff / Manager)
// ----------------------------
export const register = async (req, res) => {
  try {
    const { role, username, email, phone, password, locality, department } = req.body;
    const normalizedEmail = email.toLowerCase();

    // ✅ Ensure required fields exist
    if (!role || !username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if already exists
    const existing = await Auth.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    let profile;

    // ✅ Role-based profile creation
    switch (role) {
      case "user":
        if (!phone || !locality)
          return res.status(400).json({ message: "Phone and locality are required for user" });
        profile = await User.create({ username, email: normalizedEmail, phone, password, locality });
        break;

      case "staff":
        if (!department)
          return res.status(400).json({ message: "Department is required for staff" });
        profile = await Staff.create({ username, email: normalizedEmail, password, department });
        break;

      case "manager":
        if (!department)
          return res.status(400).json({ message: "Department is required for manager" });
        profile = await Manager.create({ username, email: normalizedEmail, password, department });
        break;

      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    // ✅ Create Auth record
    await Auth.create({
      email: normalizedEmail,
      password,
      role,
      profileId: profile._id,
      provider: "local",
    });

    const tokens = await profile.generateAuthTokens();
    res.status(201).json({ message: `${role} registered successfully`, tokens });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// UNIVERSAL LOGIN (Admin / Others)
// ----------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    // ✅ 1️⃣ Try admin first
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (admin) {
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const tokens = await admin.generateAuthTokens();
      return res.json({ message: "Admin login successful", tokens });
    }

    // ✅ 2️⃣ Check in Auth collection for user, staff, manager
    const auth = await Auth.findOne({ email: normalizedEmail });
    if (!auth) return res.status(400).json({ message: "User not found" });

    // use bcrypt here if Auth schema doesn’t have matchPassword()
    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

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
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    const tokens = await profile.generateAuthTokens();
    res.json({ message: `${auth.role} login successful`, tokens });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// LOGOUT
// ----------------------------
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const auth = await Auth.findOne({ "refreshTokens.token": refreshToken });
    if (auth) {
      auth.refreshTokens = auth.refreshTokens.filter(t => t.token !== refreshToken);
      await auth.save();
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// REFRESH TOKEN
// ----------------------------
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    let profile;

    // ✅ Check in Auth for non-admins
    const auth = await Auth.findById(decoded.id);
    if (auth) {
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
      }
    } else {
      // ✅ If not found in Auth, maybe it's admin
      profile = await Admin.findById(decoded.id);
    }

    if (!profile) return res.status(400).json({ message: "Profile not found" });

    const tokens = await profile.generateAuthTokens();
    res.json({ message: "Token refreshed", tokens });
  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
