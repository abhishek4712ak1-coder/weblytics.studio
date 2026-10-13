import cloudinary from "../config/cloudinary.js";
import { Readable } from "node:stream";

export const uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file.",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "weblytics-studio/projects",
          resource_type: "image",
          transformation: [
            { width: 1600, height: 1200, crop: "limit" },
            { quality: "auto:good", fetch_format: "auto" },
          ],
        },
        (error, uploadedImage) => {
          if (error) return reject(error);
          resolve(uploadedImage);
        }
      );

      Readable.from(req.file.buffer).pipe(uploadStream);
    });

    return res.status(201).json({
      success: true,
      message: "Project image uploaded successfully.",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Project image upload error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Image upload failed. Check your Cloudinary configuration.",
    });
  }
};
