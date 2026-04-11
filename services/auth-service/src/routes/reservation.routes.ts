import { Router } from "express";
import { reservationController } from "../controllers/reservation.controller";

/**
 * Planning grid for the reservation UI (green = disponible, red = indisponible).
 * Replace this payload with a DB query when the `reservations` / availability schema is ready.
 */
export const reservationRouter = Router();

const defaultPlanning = {
  monthLabel: "Mai 2026",
  planningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  planningDates: [29, 30, 1, 2, 3, 4, 5],
  rows: [
    {
      label: "Haute saison : 120€/jour",
      kind: "available" as const,
      segments: [
        { start: 0, span: 5 },
        { start: 5, span: 1, note: "Fermé" },
        { start: 6, span: 1, note: "Fermé" },
      ],
    },
    {
      label: "Non disponible",
      kind: "unavailable" as const,
      segments: [{ start: 0, span: 7 }],
    },
    {
      label: "Haute saison : 120€/jour",
      kind: "available" as const,
      segments: [
        { start: 0, span: 5 },
        { start: 5, span: 1, note: "Fermé" },
        { start: 6, span: 1, note: "Fermé" },
      ],
    },
  ],
};

reservationRouter.get("/planning", (_req, res) => {
  res.json(defaultPlanning);
});

reservationRouter.post("/confirm", reservationController.confirm);
