import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";


const app = express();

// ------------------
// 🌐 Middleware setup
// ------------------

// Allow frontend + Socket.io requests
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Allow your frontend domain (React/Vite)
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ------------------
// 📁 Static folder for uploaded files
// ------------------
app.use("/uploads", express.static(path.join(path.resolve(), "src/uploads")));

// ------------------
// 🧭 API Routes
// ------------------
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notifications", notificationRoutes);

// ------------------
//  Root endpoint (for testing connection)
// ------------------
app.get("/", (req, res) => {
  res.send("✅ CitiZenDesk backend is running...");
});

export default app;
