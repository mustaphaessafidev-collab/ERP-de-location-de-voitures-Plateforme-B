import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";

export const notificationRouter = Router();

// GET    /api/notifications?email=xxx   → liste des notifications d'un utilisateur
notificationRouter.get("/", notificationController.list);

// POST   /api/notifications              → créer une notification
notificationRouter.post("/", notificationController.create);

// PATCH  /api/notifications/:id/read    → marquer une notification comme lue
notificationRouter.patch("/:id/read", notificationController.markRead);

// PATCH  /api/notifications/read-all    → marquer toutes comme lues (par email)
notificationRouter.patch("/read-all", notificationController.markAllRead);

// DELETE /api/notifications/:id          → supprimer une notification
notificationRouter.delete("/:id", notificationController.remove);

// DELETE /api/notifications?email=xxx   → supprimer toutes (par email)
notificationRouter.delete("/", notificationController.removeAll);
