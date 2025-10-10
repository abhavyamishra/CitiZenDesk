import mongoose from "mongoose";
import Counter from "./Counter.js";

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, unique: true },
    locality: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    media: [{ type: String }],
    deptName: { type: String, required: true, enum: ["road", "water", "garbage"] },
    startTime: { type: Date, default: Date.now },
    durationHours: { type: Number },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    status: {
      type: String,
      enum: ["OPEN", "being_processed", "completed", "elapsed", "completed_late", "closed"],
      default: "OPEN",
    },
    escalated: { type: Boolean, default: false },
    urgency: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comments: { type: String, trim: true },
      submittedAt: { type: Date },
    },
    resolvedAt: { type: Date }, // ✅ store when complaint is resolved
  },
  { timestamps: true }
);

// Indexes
complaintSchema.index({ location: "2dsphere" });
complaintSchema.index({ status: 1, deptName: 1, locality: 1 });

// Auto-set durationHours based on dept
complaintSchema.pre("validate", function (next) {
  if (this.deptName === "road") this.durationHours = 15;
  else if (this.deptName === "water") this.durationHours = 20;
  else if (this.deptName === "garbage") this.durationHours = 24;
  next();
});

// Auto-generate complaintId
complaintSchema.pre("save", async function (next) {
  if (!this.complaintId) {
    const dept = this.deptName.toUpperCase();
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}`;

    const counter = await Counter.findOneAndUpdate(
      { dept, date: dateStr },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    this.complaintId = `${dept}-${dateStr}-${String(counter.seq).padStart(3, "0")}`;
  }
  next();
});

// Virtuals
complaintSchema.virtual("endTime").get(function () {
  return new Date(this.startTime.getTime() + this.durationHours * 60 * 60 * 1000);
});

complaintSchema.virtual("remainingTime").get(function () {
  const now = new Date();
  return Math.max(0, this.endTime - now);
});

// ----------------------------
// Static: Calculate average resolution time (in hours)
// ----------------------------
complaintSchema.statics.getAverageResolutionTime = async function (filter = {}) {
  const result = await this.aggregate([
    { $match: { status: { $in: ["completed", "completed_late", "closed"] }, ...filter } },
    {
      $project: {
        resolutionTimeHours: {
          $divide: [{ $subtract: ["$resolvedAt", "$startTime"] }, 1000 * 60 * 60],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgResolutionTime: { $avg: "$resolutionTimeHours" },
      },
    },
  ]);

  return result[0]?.avgResolutionTime || 0;
};

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
