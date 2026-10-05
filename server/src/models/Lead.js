import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    service: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "AI & Automation",
        "Data Analytics",
        "Other",
      ],
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Converted", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lead", leadSchema);