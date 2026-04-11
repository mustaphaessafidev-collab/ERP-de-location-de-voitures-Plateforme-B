import axios from "axios";

const API_URL = "http://localhost:4004/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ GET notifications
export async function getUserNotifications(userId) {
  const { data } = await client.get(
    `/notifications/user/${userId}`
  );
  return data;
}

// ✅ CREATE
export async function createNotification(payload) {
  const { data } = await client.post("/notifications", payload);
  return data.notification;
}

// ✅ MARK ONE
export async function markNotificationAsRead(id) {
  const { data } = await client.patch(`/notifications/${id}/read`);
  return data.notification;
}

// ✅ MARK ALL
export async function markAllNotificationsAsRead(userId) {
  const { data } = await client.patch(
    `/notifications/user/${userId}/read-all`
  );
  return data;
}

// ✅ DELETE
export async function deleteNotification(id) {
  await client.delete(`/notifications/${id}`);
}

// ✅ DELETE ALL
export async function deleteAllNotifications(userId) {
  await client.delete(`/notifications/user/${userId}`);
}

// ✅ Aliases for compatibility
export async function fetchNotifications(userId) {
  return await getUserNotifications(userId);
}

export async function markNotificationRead(id) {
  return await markNotificationAsRead(id);
}

export async function markAllNotificationsRead(userId) {
  return await markAllNotificationsAsRead(userId);
}