import axios from "axios";

// ✅ SEPARATE CLIENT FOR NOTIFICATION SERVICE (PORT 4004)
const notificationClient = axios.create({
  baseURL: "http://localhost:4004/api",
  headers: { "Content-Type": "application/json" },
});

export const getUserNotifications = async (userId) => {
  const res = await notificationClient.get(`/notifications/user/${userId}`);
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await notificationClient.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async (userId) => {
  const res = await notificationClient.patch(`/notifications/user/${userId}/read-all`);
  return res.data;
};

export const createNotification = async (data) => {
  const res = await notificationClient.post(`/notifications`, data);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await notificationClient.delete(`/notifications/${id}`);
  return res.data;
};

export const deleteAllNotifications = async (userId) => {
  const res = await notificationClient.delete(`/notifications/user/${userId}`);
  return res.data;
};