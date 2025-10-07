import Complaint from "../models/complaints.model.js";
import { Parser } from "json2csv";
import fs from "fs";
import path from "path";
import pdf from "pdfkit";

// ---------------------------
// GENERATE MONTHLY CSV REPORT
// Query params: ?month=10&year=2025
// ---------------------------
export const generateCSVReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ message: "Month and year are required" });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const complaints = await Complaint.find({
      createdAt: { $gte: start, $lte: end },
    })
      .populate("author", "username email")
      .populate("assignedStaff", "staffName email");

    const fields = [
      "complaintId",
      "title",
      "author.username",
      "author.email",
      "deptName",
      "status",
      "urgency",
      "assignedStaff.staffName",
      "createdAt",
      "updatedAt",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(complaints);

    const filePath = path.join("reports", `monthly_report_${month}_${year}.csv`);
    fs.writeFileSync(filePath, csv);

    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate CSV report" });
  }
};

// ---------------------------
// GENERATE MONTHLY PDF REPORT
// Query params: ?month=10&year=2025
// ---------------------------
export const generatePDFReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ message: "Month and year are required" });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const complaints = await Complaint.find({
      createdAt: { $gte: start, $lte: end },
    })
      .populate("author", "username email")
      .populate("assignedStaff", "staffName email");

    const doc = new pdf();
    const filePath = path.join("reports", `monthly_report_${month}_${year}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text(`Monthly Complaint Report - ${month}/${year}`, { align: "center" });
    doc.moveDown();

    complaints.forEach((c) => {
      doc.fontSize(12).text(
        `ID: ${c.complaintId}\nTitle: ${c.title}\nAuthor: ${c.author.username} (${c.author.email})\nDept: ${c.deptName}\nStatus: ${c.status}\nUrgency: ${c.urgency}\nAssigned Staff: ${c.assignedStaff?.staffName || "N/A"}\nCreated: ${c.createdAt}\nUpdated: ${c.updatedAt}\n\n`
      );
    });

    doc.end();
    doc.on("finish", () => {
      res.download(filePath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate PDF report" });
  }
};

// ---------------------------
// ANALYTICS (JSON response)
// Query params: ?month=10&year=2025
// ---------------------------
export const getAnalytics = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const complaints = await Complaint.find({ createdAt: { $gte: start, $lte: end } });

    const total = complaints.length;
    const resolved = complaints.filter(c => ["RESOLVED", "COMPLETED_LATE", "CLOSED"].includes(c.status)).length;
    const pending = total - resolved;
    const overdue = complaints.filter(c => c.status === "ELAPSED").length;
    const avgResolutionTime = complaints
      .filter(c => ["RESOLVED", "COMPLETED_LATE", "CLOSED"].includes(c.status))
      .reduce((acc, c) => acc + (c.updatedAt - c.createdAt), 0) / Math.max(resolved, 1);

    res.json({
      totalComplaints: total,
      resolved,
      pending,
      overdue,
      avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60)) + " hours",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
