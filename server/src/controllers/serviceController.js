import Service from "../models/Service.js";

export const getServices = async (
  req,
  res
) => {
  try {
    const services = await Service.find()
      .sort({
        displayOrder: 1,
        createdAt: -1,
      });

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error(
      "Get services error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load services.",
    });
  }
};


export const createService = async (
  req,
  res
) => {
  try {
    const {
      title,
      slug,
      description,
      features,
      displayOrder,
    } = req.body;

    if (
      !title ||
      !slug ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug and description are required.",
      });
    }

    const existingService =
      await Service.findOne({ slug });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message:
          "A service with this slug already exists.",
      });
    }

    const service =
      await Service.create({
        title,
        slug,
        description,
        features:
          Array.isArray(features)
            ? features
            : [],
        displayOrder:
          Number(displayOrder) || 0,
      });

    res.status(201).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error(
      "Create service error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create service.",
    });
  }
};


export const updateService = async (
  req,
  res
) => {
  try {
    const service =
      await Service.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error(
      "Update service error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update service.",
    });
  }
};


export const deleteService = async (
  req,
  res
) => {
  try {
    const service =
      await Service.findByIdAndDelete(
        req.params.id
      );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete service error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete service.",
    });
  }
};