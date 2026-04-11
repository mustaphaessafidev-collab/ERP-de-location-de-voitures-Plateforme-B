import express from "express";
import { createReservation } from "../controllers/reservationController.js";
import { getReservationById } from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", createReservation);
router.get("/:id", getReservationById); 
export default router;