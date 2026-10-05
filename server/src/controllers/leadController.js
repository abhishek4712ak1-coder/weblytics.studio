import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, service and message are required.",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      service,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
      lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry.",
    });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads.",
    });
  }
};


export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "Contacted",
      "In Progress",
      "Converted",
      "Closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    res.json({
      success: true,
      message: "Lead status updated successfully.",
      lead,
    });
  } catch (error) {
    console.error("Update lead status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update lead status.",
    });
  }
};