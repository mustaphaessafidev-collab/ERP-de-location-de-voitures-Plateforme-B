import express from "express";
import {
  createReservation,
  getReservationById,
  getUserReservations,
} from "../controllers/reservationController.js";

const router = express.Router();

// Create reservation - POST /api/reservations
router.post("/", createReservation);

// Get single reservation by ID - GET /api/reservations/:id
router.get("/:id", getReservationById);

// Get all reservations for a specific user - GET /api/reservations/user/:userId
router.get("/user/:userId", getUserReservations);

export default router;