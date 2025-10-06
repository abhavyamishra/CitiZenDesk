import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
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
    ref: "User",   
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: [
    {
      type: String, 
    },
  ],
  deptId: {
    type: String,
    required: true,
  },
  deptName: {
    type: String,
    required: true,
    unique: true,
    enum: ["road", "water", "garbage"], 
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  durationHours: {
    type: Number,
    required: true,
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  status: {
    type: String,
    enum: ["active", "being_processed", "completed", "elapsed", "completed_late"],
    default: "active",
  },
});

complaintSchema.virtual("endTime").get(function () {
  return new Date(this.startTime.getTime() + this.durationHours * 60 * 60 * 1000);
});

complaintSchema.virtual("remainingTime").get(function () {
  const now = new Date();
  const end = new Date(this.startTime.getTime() + this.durationHours * 60 * 60 * 1000);
  const diff = end - now;
  return diff > 0 ? diff : 0; 
});

complaintSchema.pre("validate", function (next) {
  if (this.deptName === "road") this.durationHours = 15;
  else if (this.deptName === "water") this.durationHours = 20;
  else if (this.deptName === "garbage") this.durationHours = 24;
  next();
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
