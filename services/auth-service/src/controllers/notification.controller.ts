import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import * as notifService from "../services/notification.service";

export const notificationController = {
  /** GET /api/notifications?email=user@example.com */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email as string | undefined;
      if (!email) {
        return res.status(400).json({ message: "Paramètre 'email' requis." });
      }
      const notifications = await notifService.listNotifications(email);
      return res.json({ notifications });
    } catch (e) {
      next(e);
    }
  },

  /** POST /api/notifications */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notifService.createNotification(req.body);
      return res.status(201).json({ notification });
    } catch (e) {
      if (e instanceof ZodError) return next(e);
      next(e);
    }
  },

  /** PATCH /api/notifications/:id/read */
  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(String(req.params["id"]));
      if (isNaN(id) || id <= 0) return res.status(400).json({ message: "ID invalide." });
      const updated = await notifService.markOneRead(id);
      return res.json({ notification: updated });
    } catch (e) {
      next(e);
    }
  },

  /** PATCH /api/notifications/read-all  body: { email } */
  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as { email?: string };
      if (!email) {
        return res.status(400).json({ message: "Champ 'email' requis dans le body." });
      }
      const result = await notifService.markAllRead(email);
      return res.json({ updated: result.count });
    } catch (e) {
      next(e);
    }
  },

  /** DELETE /api/notifications/:id */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(String(req.params["id"]));
      if (isNaN(id) || id <= 0) return res.status(400).json({ message: "ID invalide." });
      await notifService.removeOne(id);
      return res.json({ message: "Notification supprimée." });
    } catch (e) {
      next(e);
    }
  },

  /** DELETE /api/notifications?email=xxx */
  async removeAll(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email as string | undefined;
      if (!email) {
        return res.status(400).json({ message: "Paramètre 'email' requis." });
      }
      const result = await notifService.removeAll(email);
      return res.json({ deleted: result.count });
    } catch (e) {
      next(e);
    }
  },
};
