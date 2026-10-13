import express from "express";
import multer from "multer";

import {
  getPublicProjects,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import { uploadProjectImage } from "../controllers/projectImageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPEG, PNG, WebP, and GIF images are allowed.")
      );
    }

    callback(null, true);
  },
});

const handleImageUpload = (req, res, next) => {
  imageUpload.single("image")(req, res, (error) => {
    if (!error) return next();

    const tooLarge = error.code === "LIMIT_FILE_SIZE";

    return res.status(tooLarge ? 413 : 400).json({
      success: false,
      message: tooLarge
        ? "Image must be 5 MB or smaller."
        : error.message || "Invalid image upload.",
    });
  });
};

// Public: published projects only
router.get("/", getPublicProjects);

// Admin: all projects, including drafts
router.get("/admin", protect, getAdminProjects);

// Admin: upload a project image
router.post("/upload-image", protect, handleImageUpload, uploadProjectImage);

// Admin: create a project
router.post("/", protect, createProject);

// Admin: update a project
router.patch("/:id", protect, updateProject);

// Admin: delete a project
router.delete("/:id", protect, deleteProject);

export default router;
