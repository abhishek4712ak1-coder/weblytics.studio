import express from "express";

import {
  createLead,
  getLeads,
  updateLeadStatus,
} from "../controllers/leadController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/", createLead);

// Protected admin routes
router.get("/", protect, getLeads);
router.patch("/:id", protect, updateLeadStatus);

export default router;