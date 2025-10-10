import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  generateCSVReport,
  generatePDFReport,
  getAnalytics,
} from "../controllers/reportController.js";

const router = express.Router();

// Only admins/managers can generate reports
router.use(protect);
router.use(authorize("manager", "admin"));

router.get("/csv", generateCSVReport);
router.get("/pdf", generatePDFReport);
router.get("/analytics", getAnalytics);

export default router;
