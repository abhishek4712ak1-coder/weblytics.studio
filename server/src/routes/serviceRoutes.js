import express from "express";

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getServices);

// Admin
router.post("/", protect, createService);

router.patch(
  "/:id",
  protect,
  updateService
);

router.delete(
  "/:id",
  protect,
  deleteService
);

export default router;