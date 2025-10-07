import express from "express";
import { getNotifications, markNotificationRead } from "../controllers/NotificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications
router.get("/", protect, getNotifications);

// Mark a notification as read
router.put("/:notificationId/read", protect, markNotificationRead);

export default router;
