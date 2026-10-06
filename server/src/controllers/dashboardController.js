import Lead from "../models/Lead.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      inProgressLeads,
      convertedLeads,
      closedLeads,
    ] = await Promise.all([
      Lead.countDocuments(),

      Lead.countDocuments({
        status: "New",
      }),

      Lead.countDocuments({
        status: "Contacted",
      }),

      Lead.countDocuments({
        status: "In Progress",
      }),

      Lead.countDocuments({
        status: "Converted",
      }),

      Lead.countDocuments({
        status: "Closed",
      }),
    ]);

    const conversionRate =
      totalLeads > 0
        ? Number(
            ((convertedLeads / totalLeads) * 100).toFixed(1)
          )
        : 0;

    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,

      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        inProgressLeads,
        convertedLeads,
        closedLeads,
        conversionRate,
      },

      recentLeads,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });
  }
};
