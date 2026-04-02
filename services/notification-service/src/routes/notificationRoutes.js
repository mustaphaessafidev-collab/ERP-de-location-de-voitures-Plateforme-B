import express from "express";
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationcontroller.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/user/:userId", getUserNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.patch("/user/:userId/read-all", markAllNotificationsAsRead);
router.delete("/:id", deleteNotification);

export default router;