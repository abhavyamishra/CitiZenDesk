import express from "express";
import {
  getStaffDashboard,
  updateComplaintStatus,
  getStaffNotifications,
  markNotificationRead,
} from "../controllers/staffController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected for staff
router.use(protectStaff);

// ---------------------------
// GET STAFF DASHBOARD
// Optional query params: ?status=being_processed&urgency=high
// ---------------------------
router.get("/dashboard", getStaffDashboard);

// ---------------------------
// UPDATE COMPLAINT STATUS
// Body: { complaintId, newStatus }
// ---------------------------
router.post("/complaint/update-status", updateComplaintStatus);

// ---------------------------
// GET STAFF NOTIFICATIONS
// ---------------------------
router.get("/notifications", getStaffNotifications);

// ---------------------------
// MARK NOTIFICATION AS READ
// Body: { notificationId }
// ---------------------------
router.post("/notifications/read", markNotificationRead);

export default router;
