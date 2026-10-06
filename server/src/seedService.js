import mongoose from "mongoose";
import dotenv from "dotenv";

import Service from "./models/Service.js";

dotenv.config();

const services = [
  {
    title: "Web Development",

    slug: "web-development",

    description:
      "Modern responsive websites and web applications for businesses, startups, creators and students.",

    features: [
      "Business Websites",
      "MERN Applications",
      "Portfolio Websites",
      "Admin Dashboards",
      "Responsive Design",
    ],

    displayOrder: 1,
  },

  {
    title: "AI & Automation",

    slug: "ai-automation",

    description:
      "AI-powered tools and automation workflows that reduce repetitive work and improve productivity.",

    features: [
      "AI Integrations",
      "Workflow Automation",
      "Content Automation",
      "Chatbots",
      "API Integrations",
    ],

    displayOrder: 2,
  },

  {
    title: "Data Analytics",

    slug: "data-analytics",

    description:
      "Turn business data into useful insights, dashboards and reports for better decision making.",

    features: [
      "Data Cleaning",
      "Interactive Dashboards",
      "Business Reports",
      "Data Visualization",
      "Performance Analysis",
    ],

    displayOrder: 3,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB connected.");

    for (const service of services) {
      await Service.findOneAndUpdate(
        {
          slug: service.slug,
        },

        service,

        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log(
      "Services seeded successfully."
    );

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "Service seed failed:",
      error
    );

    process.exit(1);
  }
};

seed();