import Staff from "../models/Staff.js";
import Manager from "../models/Manager.js";
import Auth from "../models/Auth.js";

// CREATE STAFF (admin only)
export const createStaff = async (req, res) => {
  try {
    const { staffName, email, deptName, password, staffId } = req.body;

    // Ensure email/staffId uniqueness
    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) return res.status(400).json({ message: "Email already exists" });

    const staffProfile = await Staff.create({ staffName, email, deptName, password, staffId });

    await Auth.create({
      email,
      password,
      role: "staff",
      profileId: staffProfile._id,
      provider: "local",
    });

    res.status(201).json({ message: "Staff created successfully", staffProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// CREATE MANAGER (admin only)
export const createManager = async (req, res) => {
  try {
    const { managerId, password, deptName } = req.body;

    const existing = await Manager.findOne({ deptName });
    if (existing) return res.status(400).json({ message: "Manager for this department already exists" });

    const managerProfile = await Manager.create({ managerId, deptName, password });

    await Auth.create({
      email: managerId, // can use managerId as login
      password,
      role: "manager",
      profileId: managerProfile._id,
      provider: "local",
    });

    res.status(201).json({ message: "Manager created successfully", managerProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
