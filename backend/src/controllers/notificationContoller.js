import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Staff from "../models/staff.model.js";
import Manager from "../models/manager.model.js";
import Admin from "../models/admin.model.js";

// ---------------------------
// GET ALL NOTIFICATIONS FOR LOGGED-IN USER
// ---------------------------
export const getNotifications = async (req, res) => {
  try {
    const { id, role } = req.user;

    const notifications = await Notification.find({
      recipient: id,
      recipientModel: role.charAt(0).toUpperCase() + role.slice(1),
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// MARK NOTIFICATION AS READ
// ---------------------------
export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    // Only recipient can mark as read
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await notification.markAsRead();
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// OPTIONAL: CREATE NOTIFICATION (can be used internally by controllers)
// ---------------------------
export const createNotification = async ({ recipientId, recipientModel, type, message, meta = {} }) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      recipientModel,
      type,
      message,
      meta,
    });
    return notification;
  } catch (error) {
    console.error("Notification creation failed:", error);
    return null;
  }
};
