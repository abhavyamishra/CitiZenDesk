import mongoose from "mongoose";
import Counter from "./Counter.js";

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
  },
  locality: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Only users can submit complaints
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: [
    { type: String } // URLs or file paths
  ],
  deptName: {
    type: String,
    required: true,
    enum: ["road", "water", "garbage"],
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  durationHours: {
    type: Number, // auto-set based on dept
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff", // optional
  },
  status: {
    type: String,
    enum: ["active", "being_processed", "completed", "elapsed", "completed_late", "closed"],
    default: "active",
  },
  escalated: {
    type: Boolean,
    default: false,
  },
  urgency: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
    },
  },
}, { timestamps: true });

// Auto-set durationHours based on dept
complaintSchema.pre("validate", function(next) {
  if (this.deptName === "road") this.durationHours = 15;
  else if (this.deptName === "water") this.durationHours = 20;
  else if (this.deptName === "garbage") this.durationHours = 24;
  next();
});

// Auto-generate complaintId using atomic counter
complaintSchema.pre("save", async function(next) {
  if (!this.complaintId) {
    const dept = this.deptName.toUpperCase();
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const dateStr = `${y}${m}${d}`;

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
complaintSchema.virtual("endTime").get(function() {
  return new Date(this.startTime.getTime() + this.durationHours * 60 * 60 * 1000);
});

complaintSchema.virtual("remainingTime").get(function() {
  const now = new Date();
  const end = new Date(this.startTime.getTime() + this.durationHours * 60 * 60 * 1000);
  return Math.max(0, end - now);
});

// Index for faster dashboard queries
complaintSchema.index({ status: 1, deptName: 1, locality: 1 });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
