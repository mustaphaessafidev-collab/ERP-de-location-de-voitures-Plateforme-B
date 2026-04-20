import axios from "axios";

// Gateway URL (routes to internal services)
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000";

const client = axios.create({
  baseURL: GATEWAY_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Create a new reservation
 * POST /api/reservations
 * @param {Object} reservationData - { client_id, vehicle_id, date_debut, date_fin, prix, nombre_jours }
 * @returns {Promise<Object>} - Created reservation
 */
export async function createReservation(reservationData) {
  try {
    const { data } = await client.post("/api/reservations", reservationData);
    console.log("[FRONTEND API] ✅ Reservation created:", data);
    return data;
  } catch (error) {
    console.error(
      "[FRONTEND API] ❌ Error creating reservation:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Get single reservation by ID
 * GET /api/reservations/:id
 * @param {string|number} id - Reservation ID
 * @returns {Promise<Object>} - Reservation details
 */
export async function getReservationById(id) {
  try {
    const { data } = await client.get(`/api/reservations/${id}`);
    console.log(`[FRONTEND API] ✅ Fetched reservation ${id}:`, data);
    return data;
  } catch (error) {
    console.error(
      `[FRONTEND API] ❌ Error fetching reservation ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Get all reservations for a user
 * GET /api/reservations/user/:userId
 * @param {string|number} userId - User ID
 * @returns {Promise<Array>} - List of user's reservations
 */
export async function getUserReservations(userId) {
  try {
    const { data } = await client.get(`/api/reservations/user/${userId}`);
    console.log(
      `[FRONTEND API] ✅ Fetched ${data.length} reservations for user ${userId}`
    );
    return data;
  } catch (error) {
    console.error(
      `[FRONTEND API] ❌ Error fetching reservations for user ${userId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Planning grid from auth-service `GET /reservations/planning` (ready for DB-backed data later).
 */
export async function fetchReservationPlanning() {
  const authURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  try {
    const { data } = await axios.get(`${authURL}/reservations/planning`);
    console.log("[FRONTEND API] ✅ Fetched reservation planning");
    return data;
  } catch (error) {
    console.error(
      "[FRONTEND API] ❌ Error fetching planning:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Confirm reservation (legacy endpoint - kept for compatibility)
 */
export async function confirmReservation(payload) {
  const authURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  try {
    const { data } = await axios.post(
      `${authURL}/reservations/confirm`,
      payload
    );
    console.log("[FRONTEND API] ✅ Reservation confirmed");
    return data;
  } catch (error) {
    console.error(
      "[FRONTEND API] ❌ Error confirming reservation:",
      error.response?.data || error.message
    );
    throw error;
  }
}
