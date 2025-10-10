// src/seedComplaintClean.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Complaint from "./models/complaints.model.js";
import User from "./models/user.model.js";

dotenv.config({ path: "../.env" }); // points to your root .env

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    // Clear old complaints
    await Complaint.deleteMany({});
    console.log("🗑️ Cleared old complaints");

    const user = await User.findOne();
    if (!user) throw new Error("Create a user first");

    // Use fixed date for current month
    const fixedDate = new Date(2025, 9, 10); // October 10, 2025

    const complaints = [
      {
        locality: "Sector 1",
        title: "Pothole",
        description: "Big pothole in road",
        author: user._id,
        deptName: "road",
        urgency: "high",
        createdAt: fixedDate,
        updatedAt: fixedDate,
      },
      {
        locality: "Sector 2",
        title: "Water leakage",
        description: "Pipe burst",
        author: user._id,
        deptName: "water",
        urgency: "critical",
        createdAt: fixedDate,
        updatedAt: fixedDate,
      },
      {
        locality: "Sector 3",
        title: "Garbage not collected",
        description: "Trash piling up",
        author: user._id,
        deptName: "garbage",
        urgency: "medium",
        createdAt: fixedDate,
        updatedAt: fixedDate,
      },
    ];

    await Complaint.insertMany(complaints);
    console.log("✅ Seeded 1 complaint per department for current month");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();
