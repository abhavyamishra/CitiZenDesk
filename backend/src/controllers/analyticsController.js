import Complaint from "../models/complaints.model.js";

const DEPARTMENTS = ["road", "water", "garbage"];
const STATUSES = ["OPEN", "being_processed", "completed", "elapsed", "completed_late", "closed"];
const URGENCIES = ["low", "medium", "high", "critical"];

export const getMonthlyStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const complaints = await Complaint.find({ createdAt: { $gte: startDate, $lt: endDate } });

    // Initialize counts with 0
    const departmentCounts = DEPARTMENTS.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});
    const complaintStatus = STATUSES.reduce((acc, s) => ({ ...acc, [s.toLowerCase()]: 0 }), {});
    const urgencyCounts = URGENCIES.reduce((acc, u) => ({ ...acc, [u]: 0 }), {});
    let totalResolutionTime = 0;

    complaints.forEach(c => {
      departmentCounts[c.deptName] = (departmentCounts[c.deptName] || 0) + 1;
      complaintStatus[c.status.toLowerCase()] = (complaintStatus[c.status.toLowerCase()] || 0) + 1;
      urgencyCounts[c.urgency] = (urgencyCounts[c.urgency] || 0) + 1;

      if (c.status === "completed" || c.status === "completed_late") {
        const duration = (c.endTime - c.startTime) / (1000 * 60 * 60); // in hours
        totalResolutionTime += duration;
      }
    });

    const completedCount = complaints.filter(c => ["completed", "completed_late"].includes(c.status)).length;
    const avgResolutionTimeHours = completedCount ? totalResolutionTime / completedCount : 0;

    res.json({
      departmentCounts,
      complaintStatus,
      urgencyCounts,
      avgResolutionTimeHours: parseFloat(avgResolutionTimeHours.toFixed(2))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
