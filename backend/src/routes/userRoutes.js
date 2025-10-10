import express from "express";
import {
  registerUser,
  loginUser,
  submitComplaint,
  getUserComplaints,
  submitFeedback,
  getUserNotifications,
  markNotificationRead,
} from "../controllers/userController.js";
import { protectUser } from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/complaint/submit", protectUser, upload.array("media", 5), submitComplaint);
router.get("/complaints", protectUser, getUserComplaints);
router.post("/complaint/feedback", protectUser, submitFeedback);

// Notifications
router.get("/notifications", protectUser, getUserNotifications);
router.post("/notifications/mark-read", protectUser, markNotificationRead);

export default router;
