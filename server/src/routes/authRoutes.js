import express from "express";

import {
  loginAdmin,
  getCurrentAdmin,
  changePassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

import rateLimit from "express-rate-limit";


const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, loginAdmin);

router.get("/me", protect, getCurrentAdmin);

router.put("/change-password", protect, changePassword);




export default router;