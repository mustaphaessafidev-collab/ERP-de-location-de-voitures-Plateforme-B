import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { confirmReservationWithEmail } from "../services/reservation.service";

export const reservationController = {
  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await confirmReservationWithEmail(req.body);
      res.status(201).json({
        message: "Reservation confirmed; confirmation email sent.",
        reservationId: result.reservationId,
      });
    } catch (e) {
      if (e instanceof Error && e.message === "MAIL_NOT_CONFIGURED") {
        return res.status(503).json({
          message:
            "Email service is not configured (MAIL_ENABLED and SMTP_* in .env).",
        });
      }
      if (e instanceof ZodError) {
        return next(e);
      }
      next(e);
    }
  },
};
