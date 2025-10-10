import Staff from "../models/staff.model.js";
import Manager from "../models/manager.model.js";
import Auth from "../models/auth.model.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const tokens = await admin.generateAuthTokens();
    res.json({ message: "Admin login successful", tokens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// CREATE STAFF (admin only)
export const createStaff = async (req, res) => {
  try {
    const { staffName, email, deptName, password, staffId } = req.body;

    // Ensure email/staffId uniqueness
    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) return res.status(400).json({ message: "Email already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create staff profile with hashed password
    const staffProfile = await Staff.create({ staffName, email, deptName, password: hashedPassword, staffId });
    const normalizedEmail = email.toLowerCase();
    // Create auth entry with hashed password
    await Auth.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: "staff",
      profileId: staffProfile._id,
      provider: "local",
    });

    res.status(201).json({ message: "Staff created successfully", staffProfile });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// CREATE MANAGER (admin only)
export const createManager = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { managerId, password, deptName, email } = req.body;

    // Check if manager already exists for the department
    const existing = await Manager.findOne({ deptName });
    if (existing) return res.status(400).json({ message: "Manager for this department already exists" });

    // Ensure email is unique
    const existingEmail = await Auth.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create manager profile
    const managerProfile = await Manager.create({ managerId, deptName, email, password: hashedPassword });
    const normalizedEmail = email.toLowerCase();

    // Create auth entry
    await Auth.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: "manager",
      profileId: managerProfile._id,
      provider: "local",
    });

    res.status(201).json({ message: "Manager created successfully", managerProfile });
  } catch (error) {
    console.error("Error creating manager:", error);
    res.status(500).json({ message: "Server error" });
  }
};
