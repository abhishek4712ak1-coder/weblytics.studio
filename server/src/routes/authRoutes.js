import express from "express";

import {
  loginAdmin,
  getCurrentAdmin,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

// Get logged-in admin
router.get("/me", protect, getCurrentAdmin);

export default router;