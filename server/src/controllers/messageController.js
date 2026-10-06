import Lead from "../models/Lead.js";

/*
|--------------------------------------------------------------------------
| Get Messages
|--------------------------------------------------------------------------
*/

export const getMessages = async (req, res) => {
  try {
    const messages = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error(
      "Get messages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load messages.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Mark Message As Read
|--------------------------------------------------------------------------
*/

export const markMessageRead = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const message =
      await Lead.findByIdAndUpdate(
        id,
        {
          isRead: true,
          readAt: new Date(),
        },
        {
          new: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Message marked as read.",
      data: message,
    });
  } catch (error) {
    console.error(
      "Mark message read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update message.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Mark Message As Unread
|--------------------------------------------------------------------------
*/

export const markMessageUnread = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const message =
      await Lead.findByIdAndUpdate(
        id,
        {
          isRead: false,
          readAt: null,
        },
        {
          new: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Message marked as unread.",
      data: message,
    });
  } catch (error) {
    console.error(
      "Mark message unread error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update message.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Mark Message As Replied
|--------------------------------------------------------------------------
*/

export const markMessageReplied = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const message =
      await Lead.findByIdAndUpdate(
        id,
        {
          isRead: true,
          isReplied: true,
          readAt: new Date(),
          repliedAt: new Date(),
          status: "Contacted",
        },
        {
          new: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Message marked as replied.",
      data: message,
    });
  } catch (error) {
    console.error(
      "Mark message replied error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update message.",
    });
  }
};