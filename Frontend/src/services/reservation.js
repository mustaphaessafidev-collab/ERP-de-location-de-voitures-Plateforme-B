import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Planning grid from auth-service `GET /reservations/planning` (ready for DB-backed data later).
 */
export async function fetchReservationPlanning() {
  const { data } = await client.get("/reservations/planning");
  return data;
}

export async function confirmReservation(payload) {
  const { data } = await client.post("/reservations/confirm", payload);
  return data;
}
