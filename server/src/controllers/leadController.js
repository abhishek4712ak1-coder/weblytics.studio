import Lead from "../models/Lead.js";

/*
|--------------------------------------------------------------------------
| Create Lead
|--------------------------------------------------------------------------
*/

export const createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      service,
      message,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required.",
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      service: service || "Other",
      message: message.trim(),
      status: "New",
      isRead: false,
      isReplied: false,
    });

    return res.status(201).json({
      success: true,
      message:
        "Your enquiry has been submitted successfully.",
      lead,
    });
  } catch (error) {
    console.error(
      "Create lead error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit your enquiry.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Leads
|--------------------------------------------------------------------------
*/

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error(
      "Get leads error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load enquiries.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Lead
|--------------------------------------------------------------------------
*/

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "email",
      "phone",
      "service",
      "message",
      "status",
      "isRead",
      "isReplied",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    /*
    |--------------------------------------------------------------------------
    | Read timestamp
    |--------------------------------------------------------------------------
    */

    if (req.body.isRead === true) {
      updates.readAt = new Date();
    }

    if (req.body.isRead === false) {
      updates.readAt = null;
    }

    /*
    |--------------------------------------------------------------------------
    | Reply timestamp
    |--------------------------------------------------------------------------
    */

    if (req.body.isReplied === true) {
      updates.repliedAt = new Date();
    }

    if (req.body.isReplied === false) {
      updates.repliedAt = null;
    }

    /*
    |--------------------------------------------------------------------------
    | Status automatically changes when contacted
    |--------------------------------------------------------------------------
    */

    if (
      req.body.isReplied === true &&
      !req.body.status
    ) {
      updates.status = "Contacted";
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.json({
      success: true,
      message: "Enquiry updated successfully.",
      lead,
    });
  } catch (error) {
    console.error(
      "Update lead error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update enquiry.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Lead
|--------------------------------------------------------------------------
*/

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete lead error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete enquiry.",
    });
  }
};