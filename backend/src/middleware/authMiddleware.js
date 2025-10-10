import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Staff from "../models/staff.model.js";
import Manager from "../models/manager.model.js";
import Admin from "../models/admin.model.js";

// Verify token for general users (User/Staff/Manager/Admin)
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on role
    let user;
    switch (decoded.role) {
      case "user":
        user = await User.findById(decoded.id);
        break;
      case "staff":
        user = await Staff.findById(decoded.id);
        break;
      case "manager":
        user = await Manager.findById(decoded.id);
        break;
      case "admin":
        user = await Admin.findById(decoded.id);
        break;
    }

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    req.user.role = decoded.role;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission" });
    }
    next();
  };
};

// Protect User only
export const protectUser = async (req, res, next) => {
  await protect(req, res, () => {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Not a user" });
    }
    next();
  });
};

// Protect Staff only
export const protectStaff = async (req, res, next) => {
  await protect(req, res, () => {
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Not a staff" });
    }
    req.staff = req.user; // for easier reference
    next();
  });
};

// Protect Manager only
export const authManager = async (req, res, next) => {
  await protect(req, res, () => {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Not a manager" });
    }
    req.manager = req.user; // for easier reference
    next();
  });
};
