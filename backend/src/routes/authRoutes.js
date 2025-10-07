import express from "express";
import {
  registerUser,
  login,
  logout,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

// User registration only
router.post("/register", registerUser);

// Login available for all roles
router.post("/login", login);

// Logout (all roles)
router.post("/logout", logout);

// Refresh token
router.post("/refresh", refreshToken);

export default router;
