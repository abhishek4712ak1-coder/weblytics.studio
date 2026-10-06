import express from "express";
import rateLimit from "express-rate-limit";

import {
  loginAdmin,
  getCurrentAdmin,
  changePassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Login
router.post("/login", loginLimiter, loginAdmin);

// Current admin
router.get("/me", protect, getCurrentAdmin);

// Change password
router.patch(
  "/change-password",
  protect,
  passwordLimiter,
  changePassword
);

export default router;