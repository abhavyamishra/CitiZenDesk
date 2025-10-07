import express from "express";
import { authManager } from "../middleware/auth.js";
import {
  managerLogin,
  getManagerDashboard,
  assignComplaintToStaff,
  updateComplaintUrgency,
  markComplaintElapsed,
  incrementStaffSolved,
} from "../controllers/managerController.js";

const router = express.Router();

// Public route
router.post("/login", managerLogin);

// Protected routes
router.use(authManager); // JWT middleware for manager

router.get("/dashboard", getManagerDashboard);
router.post("/assign", assignComplaintToStaff);
router.post("/update-urgency", updateComplaintUrgency);
router.post("/mark-elapsed", markComplaintElapsed);
router.post("/increment-solved", incrementStaffSolved);

export default router;
