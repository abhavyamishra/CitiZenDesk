import Manager from "../models/manager.model.js";
import Staff from "../models/staff.model.js";
import Complaint from "../models/complaints.model.js";
import Notification from "../models/notification.model.js";

// ---------------------------
// MANAGER LOGIN
// Body: { managerId, password }
// ---------------------------
export const managerLogin = async (req, res) => {
  try {
    const { managerId, password } = req.body;

    const manager = await Manager.findOne({ managerId });
    if (!manager) return res.status(404).json({ message: "Manager not found" });

    const isMatch = await manager.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const tokens = await manager.generateAuthTokens();
    res.json({ message: "Login successful", tokens, manager });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// GET MANAGER DASHBOARD
// Optional query: ?status=active&urgency=high
// ---------------------------
export const getManagerDashboard = async (req, res) => {
  try {
    const manager = req.manager;
    const { status, urgency } = req.query;

    const filters = { deptName: manager.deptName };
    if (status) filters.status = status;
    if (urgency) filters.urgency = urgency;

    const complaints = await Complaint.find(filters)
      .populate("author", "username email")
      .populate("assignedStaff", "staffName email")
      .sort({ createdAt: -1 });

    res.json({ manager, complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// ASSIGN COMPLAINT TO STAFF
// Body: { complaintId, staffId, urgency }
// ---------------------------
export const assignComplaintToStaff = async (req, res) => {
  try {
    const manager = req.manager;
    const { complaintId, staffId, urgency } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    const staff = await Staff.findById(staffId);
    if (!staff) throw new Error("Staff not found");

    if (staff.deptName !== manager.deptName)
      throw new Error("Cannot assign complaint to staff outside your department");

    if ((staff.complaintsAssigned ?? 0) >= 5)
      throw new Error("Staff is handling maximum complaints");

    // Assign staff
    complaint.assignedStaff = staff._id;
    complaint.status = "being_processed";

    // Assign urgency if provided (anytime during assignment)
    if (urgency && ["low", "medium", "high", "critical"].includes(urgency)) {
      complaint.urgency = urgency;
    }

    await complaint.save();

    // Increment staff's assigned count
    staff.complaintsAssigned = (staff.complaintsAssigned ?? 0) + 1;
    await staff.save();

    // Notify the staff
    await Notification.create({
      recipientModel: "Staff",
      recipient: staff._id,
      type: "assignment",
      message: `You have been assigned complaint ${complaint.complaintId}`,
      meta: { complaintId: complaint._id, managerId: manager._id },
    });

    res.json({ message: "Complaint assigned to staff", complaint });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// UPDATE COMPLAINT URGENCY (ONLY IF SLA BREACHED)
// Body: { complaintId, urgency }
// ---------------------------
export const updateComplaintUrgency = async (req, res) => {
  try {
    const manager = req.manager;
    const { complaintId, urgency } = req.body;

    if (!["low", "medium", "high", "critical"].includes(urgency)) {
      throw new Error("Invalid urgency value");
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    if (complaint.deptName !== manager.deptName) {
      throw new Error("Cannot modify complaint outside your department");
    }

    // Only allow if SLA breached
    if (complaint.status !== "elapsed") {
      throw new Error("You can only update urgency of complaints that have breached SLA");
    }

    complaint.urgency = urgency;
    await complaint.save();

    // Notify staff and user
    if (complaint.assignedStaff) {
      await Notification.create({
        recipientModel: "Staff",
        recipient: complaint.assignedStaff,
        type: "general",
        message: `Urgency of complaint ${complaint.complaintId} has been updated to "${urgency}" due to SLA breach`,
        meta: { complaintId: complaint._id, managerId: manager._id },
      });
    }

    await Notification.create({
      recipientModel: "User",
      recipient: complaint.author,
      type: "status_update",
      message: `Urgency of your complaint ${complaint.complaintId} has been updated to "${urgency}" due to SLA breach`,
      meta: { complaintId: complaint._id },
    });

    res.json({ message: "Complaint urgency updated", complaint });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// MARK COMPLAINT AS ELAPSED
// Body: { complaintId }
// ---------------------------
export const markComplaintElapsed = async (req, res) => {
  try {
    const manager = req.manager;
    const { complaintId } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    if (complaint.deptName !== manager.deptName)
      throw new Error("Cannot modify complaint outside your department");

    complaint.status = "elapsed";
    await complaint.save();

    // Notify user about SLA breach
    await Notification.create({
      recipientModel: "User",
      recipient: complaint.author,
      type: "sla_breach",
      message: `Complaint ${complaint.complaintId} has exceeded SLA time`,
      meta: { complaintId: complaint._id },
    });

    res.json({ message: "Complaint marked as elapsed", complaint });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// INCREMENT STAFF SOLVED COMPLAINTS
// Body: { staffId }
// ---------------------------
export const incrementStaffSolved = async (req, res) => {
  try {
    const { staffId } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) throw new Error("Staff not found");

    staff.complaintsSolved = (staff.complaintsSolved ?? 0) + 1;
    staff.complaintsAssigned = Math.max(0, staff.complaintsAssigned - 1);

    await staff.save();

    res.json({ message: "Staff solved complaints updated", staff });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
