import prisma from "../lib/prisma.js";

export const createNotification = async (req, res) => {
  try {
    const { userId, userRole, type, title, message, referenceId } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({
        success: false,
        message: "userId, type and message are required",
      });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        userRole: userRole || "CLIENT",
        type,
        title,
        message,
        referenceId,
      },
    });

    return res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("createNotification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating notification",
    });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("getUserNotifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("markNotificationAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating notification",
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("markAllNotificationsAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating notifications",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("deleteNotification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting notification",
    });
  }
};