import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Récupérer les notifications d'un utilisateur
 * GET /api/notifications?email=xxx
 */
export async function fetchNotifications(email) {
  const { data } = await client.get("/notifications", { params: { email } });
  return data.notifications;
}

/**
 * Créer une notification
 * POST /api/notifications
 * @param {{ userEmail: string, type: string, title: string, message: string, reservationId?: string }} payload
 */
export async function createNotification(payload) {
  const { data } = await client.post("/notifications", payload);
  return data.notification;
}

/**
 * Marquer une notification comme lue
 * PATCH /api/notifications/:id/read
 */
export async function markNotificationRead(id) {
  const { data } = await client.patch(`/notifications/${id}/read`);
  return data.notification;
}

/**
 * Marquer toutes les notifications comme lues
 * PATCH /api/notifications/read-all
 */
export async function markAllNotificationsRead(email) {
  const { data } = await client.patch("/notifications/read-all", { email });
  return data.updated;
}

/**
 * Supprimer une notification
 * DELETE /api/notifications/:id
 */
export async function deleteNotification(id) {
  await client.delete(`/notifications/${id}`);
}

/**
 * Supprimer toutes les notifications d'un utilisateur
 * DELETE /api/notifications?email=xxx
 */
export async function deleteAllNotifications(email) {
  await client.delete("/notifications", { params: { email } });
}
