import mongoose from "mongoose";
import Project from "../models/Project.js";

const allowedCategories = [
  "Web Development",
  "AI & Automation",
  "Data Analytics",
  "Mobile App",
  "Other",
];

const makeSlug = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

const cleanStringArray = (value, maxItems = 30) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxItems);
};

const validOptionalUrl = (value) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value !== "string") return null;

  try {
    const url = new URL(value.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};

const validateProjectInput = (body, partial = false) => {
  const data = {};

  if (!partial || body.title !== undefined) {
    if (
      typeof body.title !== "string" ||
      !body.title.trim() ||
      body.title.trim().length > 150
    ) {
      return { error: "Title is required and must be at most 150 characters." };
    }

    data.title = body.title.trim();
  }

  if (!partial || body.shortDescription !== undefined) {
    if (
      typeof body.shortDescription !== "string" ||
      !body.shortDescription.trim() ||
      body.shortDescription.trim().length > 300
    ) {
      return {
        error: "Short description is required and must be at most 300 characters.",
      };
    }

    data.shortDescription = body.shortDescription.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string" || body.description.length > 10000) {
      return { error: "Description must be text with at most 10000 characters." };
    }

    data.description = body.description.trim();
  }

  if (body.category !== undefined) {
    if (!allowedCategories.includes(body.category)) {
      return { error: "Invalid project category." };
    }

    data.category = body.category;
  }

  for (const field of ["imageUrl", "liveUrl", "githubUrl"]) {
    if (body[field] !== undefined) {
      const url = validOptionalUrl(body[field]);

      if (url === null) {
        return {
          error: `${field} must be a valid HTTP or HTTPS URL.`,
        };
      }

      data[field] = url;
    }
  }

  if (body.technologies !== undefined) {
    data.technologies = cleanStringArray(body.technologies);
  }

  if (body.features !== undefined) {
    data.features = cleanStringArray(body.features);
  }

  for (const field of ["featured", "published"]) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "boolean") {
        return { error: `${field} must be true or false.` };
      }

      data[field] = body[field];
    }
  }

  if (body.displayOrder !== undefined) {
    const order = Number(body.displayOrder);

    if (!Number.isFinite(order)) {
      return { error: "Display order must be a valid number." };
    }

    data.displayOrder = order;
  }

  return { data };
};

const makeUniqueSlug = async (title, excludeId = null) => {
  const base = makeSlug(title) || "project";
  let slug = base;
  let counter = 2;

  while (
    await Project.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${base}-${counter++}`;
  }

  return slug;
};

// Public: only published projects
export const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ published: true })
      .sort({ featured: -1, displayOrder: 1, createdAt: -1 })
      .lean();

    return res.json({ success: true, projects });
  } catch (error) {
    console.error("Get public projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load projects.",
    });
  }
};

// Admin: all projects, including drafts
export const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return res.json({ success: true, projects });
  } catch (error) {
    console.error("Get admin projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load projects.",
    });
  }
};

// Admin: create a project
export const createProject = async (req, res) => {
  try {
    const { data, error } = validateProjectInput(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    data.slug = await makeUniqueSlug(data.title);

    const project = await Project.create(data);

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
};

// Admin: update a project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const { data, error } = validateProjectInput(req.body, true);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid project fields supplied.",
      });
    }

    if (data.title !== undefined) {
      data.slug = await makeUniqueSlug(data.title, id);
    }

    const project = await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project.",
    });
  }
};

// Admin: delete a project
export const deleteProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
};
