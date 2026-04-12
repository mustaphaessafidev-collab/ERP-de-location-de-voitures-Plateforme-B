import express from "express";
import {
  createReservation,
  getReservationById,
  getUserReservations,
} from "../controllers/reservationController.js";

const router = express.Router();

// Create reservation
router.post("/api/reservations", createReservation);

// Get single reservation by ID
router.get("/api/reservations/:id", getReservationById);

// Get all reservations for a specific user
router.get("/api/reservations/user/:userId", getUserReservations);

export default router;