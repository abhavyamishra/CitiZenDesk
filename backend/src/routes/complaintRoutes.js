import express from "express";
import {
  createComplaint,
  updateComplaintStatus,
  updateComplaintUrgency,
  getComplaints,
  getComplaint,
} from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------------------------
// USER ROUTES
// ---------------------------

// Create a complaint (only users)
router.post("/", protect, authorize("user"), createComplaint);

// Get all complaints (user sees own, staff sees assigned, manager sees dept)
router.get("/", protect, authorize("user", "staff", "manager"), getComplaints);

// Get single complaint
router.get("/:complaintId", protect, authorize("user", "staff", "manager"), getComplaint);

// ---------------------------
// STAFF ROUTES
// ---------------------------

// Update complaint status (only staff assigned or manager)
router.put(
  "/:complaintId/status",
  protect,
  authorize("staff", "manager"),
  updateComplaintStatus
);

// ---------------------------
// MANAGER ROUTES
// ---------------------------

// Update urgency (only after SLA breach)
router.put(
  "/:complaintId/urgency",
  protect,
  authorize("manager"),
  updateComplaintUrgency
);

export default router;

