import api from "./api";

export const getUserNotifications = async (userId) => {
  const res = await api.get(`/notifications/user/${userId}`);
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async (userId) => {
  const res = await api.patch(`/notifications/user/${userId}/read-all`);
  return res.data;
};

export const createNotification = async (data) => {
  const res = await api.post(`/notifications`, data);
  return res.data;
};
export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};