import Staff from "../models/Staff.js";
import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import Manager from "../models/Manager.js";

// ---------------------------
// GET STAFF DASHBOARD
// Shows complaints assigned to this staff
// Optional query: ?status=being_processed&urgency=high
// ---------------------------
export const getStaffDashboard = async (req, res) => {
  try {
    const staff = req.staff; // already populated from auth middleware
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const { status, urgency } = req.query;

    const filters = { assignedStaff: staff._id };
    if (status) filters.status = status;
    if (urgency) filters.urgency = urgency;

    const complaints = await Complaint.find(filters)
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json({ staff, complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// UPDATE COMPLAINT STATUS
// Only allows completed or completed_late
// ---------------------------
export const updateComplaintStatus = async (req, res) => {
  try {
    const staff = req.staff;
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const { complaintId, newStatus } = req.body;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Update status using Staff model method
    const updatedComplaint = await staff.updateComplaintStatus(complaint, newStatus);

    // Notify manager of department
    const manager = await Manager.findOne({ deptName: staff.deptName });
    if (manager) {
      await Notification.create({
        recipientModel: "Manager",
        recipient: manager._id,
        type: "status_update",
        message: `Complaint ${complaint.complaintId} has been marked as "${newStatus}" by staff ${staff.staffName}`,
        meta: { complaintId: complaint._id, staffId: staff._id },
      });
    }

    res.json({ message: "Complaint status updated", complaint: updatedComplaint });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// GET STAFF NOTIFICATIONS
// ---------------------------
export const getStaffNotifications = async (req, res) => {
  try {
    const staff = req.staff;
    const notifications = await Notification.find({ 
      recipient: staff._id, 
      recipientModel: "Staff" 
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
    const { notificationId } = req.body;
    const notification = await Notification.findById(notificationId);

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    await notification.markAsRead();
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
