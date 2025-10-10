import express from "express";
import { getMonthlyStats } from "../controllers/analyticsController.js";

const router = express.Router();

// GET /api/analytics/monthly?month=10&year=2025
router.get("/monthly", getMonthlyStats);

export default router;
