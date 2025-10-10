import express from "express";
import { adminLogin, createManager, createStaff } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/createManager", createManager);
router.post("/createStaff", createStaff);

export default router;
