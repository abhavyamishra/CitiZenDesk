import Complaint from "../models/complaints.model.js";
import Staff from "../models/staff.model.js";
import Notification from "../models/notification.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ---------------------------
// Utility: Fetch coordinates from Google Geocoding API
// ---------------------------
const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      console.error("Geocoding error:", response.data.status);
      return { latitude: null, longitude: null, formattedAddress: address };
    }

    const location = response.data.results[0].geometry.location;
    const formattedAddress = response.data.results[0].formatted_address;

    return { latitude: location.lat, longitude: location.lng, formattedAddress };
  } catch (error) {
    console.error("❌ Error fetching geocode:", error.message);
    return { latitude: null, longitude: null, formattedAddress: address };
  }
};

// ---------------------------
// CREATE COMPLAINT (User only)
// ---------------------------
export const createComplaint = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { title, description, locality, deptName, media } = req.body;
    const authorId = req.user.id;

    const existing = await Complaint.findOne({
      author: authorId,
      locality,
      deptName,
      status: { $in: ["OPEN", "IN PROGRESS", "ELAPSED"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have an unresolved complaint in this department and locality.",
      });
    }

    const geoData = await geocodeAddress(locality);

    const complaint = await Complaint.create({
      title,
      description,
      locality: geoData.formattedAddress || locality,
      deptName,
      media,
      author: authorId,
      status: "OPEN",
      location: { type: "Point", coordinates: [geoData.longitude, geoData.latitude] },
    });

    const staffList = await Staff.find({ deptName });
    for (let staff of staffList) {
      await Notification.create({
        recipient: staff._id,
        recipientModel: "Staff",
        type: "assignment",
        message: `New complaint submitted: ${complaint.complaintId}`,
        meta: { complaintId: complaint._id },
      });
    }

    io.emit("new_complaint", complaint);

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
      location: { latitude: geoData.latitude, longitude: geoData.longitude },
    });
  } catch (error) {
    console.error("❌ Error creating complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// UPDATE COMPLAINT STATUS
// ---------------------------
export const updateComplaintStatus = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { complaintId } = req.params;
    const { newStatus } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const validStatuses = ["OPEN", "IN PROGRESS", "RESOLVED", "COMPLETED_LATE", "CLOSED", "ELAPSED"];
    if (!validStatuses.includes(newStatus)) return res.status(400).json({ message: "Invalid status" });

    const now = new Date();
    const endTime = new Date(complaint.startTime.getTime() + complaint.durationHours * 60 * 60 * 1000);

    // SLA breach
    if (now > endTime && !["RESOLVED", "COMPLETED_LATE"].includes(complaint.status)) {
      complaint.status = "ELAPSED";
      complaint.escalated = true;
      await complaint.save();

      await Notification.create({
        recipientModel: "Manager",
        recipient: null,
        type: "sla_breach",
        message: `Complaint ${complaint.complaintId} SLA breached.`,
        meta: { complaintId: complaint._id },
      });

      io.emit("complaint_updated", complaint);
      return res.status(200).json({ message: "Complaint SLA breached. Status marked as ELAPSED.", complaint });
    }

    // Normal resolution
    if (newStatus === "RESOLVED") {
      complaint.status = now > endTime ? "COMPLETED_LATE" : "RESOLVED";

      // Calculate resolution time
      const resolutionTimeMs = now - complaint.startTime;
      complaint.resolutionTimeHours = resolutionTimeMs / (1000 * 60 * 60);
    } else {
      complaint.status = newStatus;
    }

    await complaint.save();

    await Notification.create({
      recipient: complaint.author,
      recipientModel: "User",
      type: "status_update",
      message: `Your complaint ${complaint.complaintId} status is now "${complaint.status}"`,
      meta: { complaintId: complaint._id },
    });

    io.emit("complaint_updated", complaint);

    // Emit resolution event if resolved
    if (["RESOLVED", "COMPLETED_LATE"].includes(complaint.status)) {
      io.emit("complaint_resolved", complaint);
    }

    res.json({ message: "Complaint status updated", complaint });
  } catch (error) {
    console.error("❌ Error updating complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// UPDATE URGENCY (Manager only)
// ---------------------------
export const updateComplaintUrgency = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { complaintId } = req.params;
    const { urgency } = req.body;

    if (!["low", "medium", "high", "critical"].includes(urgency)) return res.status(400).json({ message: "Invalid urgency level" });

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const endTime = new Date(complaint.startTime.getTime() + complaint.durationHours * 60 * 60 * 1000);
    if (new Date() < endTime) return res.status(400).json({ message: "Cannot update urgency before SLA breach" });

    complaint.urgency = urgency;
    await complaint.save();

    io.emit("complaint_updated", complaint);
    res.json({ message: `Complaint urgency updated to ${urgency}`, complaint });
  } catch (error) {
    console.error("❌ Error updating urgency:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// GET COMPLAINTS
// ---------------------------
export const getComplaints = async (req, res) => {
  try {
    const { role, deptName, id } = req.user;
    const { status, urgency } = req.query;

    let filters = {};
    if (role === "staff") filters.assignedStaff = id;
    else if (role === "manager") filters.deptName = deptName;

    if (status) filters.status = status;
    if (urgency) filters.urgency = urgency;

    const complaints = await Complaint.find(filters)
      .populate("author", "username email")
      .populate("assignedStaff", "staffName email")
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (error) {
    console.error("❌ Error fetching complaints:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// GET SINGLE COMPLAINT
// ---------------------------
export const getComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findById(complaintId)
      .populate("author", "username email")
      .populate("assignedStaff", "staffName email");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.json({ complaint });
  } catch (error) {
    console.error("❌ Error fetching complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// GET AVERAGE RESOLUTION TIME
// ---------------------------
export const getAvgResolutionTime = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      status: { $in: ["RESOLVED", "COMPLETED_LATE", "CLOSED"] },
    });

    if (!complaints.length) return res.json({ avgResolutionTime: 0 });

    const totalHours = complaints.reduce((sum, c) => sum + (c.resolutionTimeHours || 0), 0);
    const avgResolutionTime = totalHours / complaints.length;

    res.json({ avgResolutionTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
