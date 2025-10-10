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
    const { username, email, phone, password, locality } = req.body;

    // Validate required fields
    if (!username || !email || !phone || !password || !locality) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email or username already exists in User or Auth collection
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: "Username or email already exists" });

    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) return res.status(400).json({ message: "Email already exists in Auth" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await User.create({ username, email, phone, password: hashedPassword, locality });

    // Create Auth record
    await Auth.create({
      email,
      password: hashedPassword,
      role: "user",
      profileId: newUser._id,
      provider: "local",
    });

    // Generate tokens
    const tokens = await newUser.generateAuthTokens();

    res.status(201).json({ message: "User registered successfully", tokens });
  } catch (error) {
    console.error("❌ Register User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ----------------------------
// UNIVERSAL LOGIN (All roles)
// ----------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    // ✅ Check in Auth collection for user, staff, manager, admin
    console.log("Searching for email:", normalizedEmail);
    const auth = await Auth.findOne({ email: normalizedEmail });
    console.log("Found auth record:", auth);
    if (!auth) return res.status(400).json({ message: "User not found" });

    // use bcrypt here if Auth schema doesn’t have matchPassword()
    console.log("Login password:", password);
    console.log("Stored hash:", auth.password);

    const isMatch = bcrypt.compare(password, auth.password);
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
      case "admin":
        profile = await Admin.findById(auth.profileId);
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
