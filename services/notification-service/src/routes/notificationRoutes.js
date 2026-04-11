import express from "express";
import prisma from "../lib/prisma.js"; // ✅ زيد هادي
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationcontroller.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/user/:userId", getUserNotifications);
router.patch("/user/:userId/read-all", markAllNotificationsAsRead);
// ✅ DELETE routes - specific routes before generic ones (important!)
router.delete("/user/:userId", deleteAllNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);

export default router;