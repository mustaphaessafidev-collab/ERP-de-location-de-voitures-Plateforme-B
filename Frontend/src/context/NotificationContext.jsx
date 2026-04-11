import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  getUserNotifications,
  createNotification,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notificationService";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get userId from localStorage
  const getUserId = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id ? String(user.id) : null;
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      console.warn("No userId, skipping load");
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getUserNotifications(userId);
      console.log("[NotificationContext] Loaded data:", data);

      // ✅ Extract notifications array from response
      const notificationsArray = data?.notifications || data || [];
      
      // Ensure it's always an array
      if (Array.isArray(notificationsArray)) {
        setNotifications(notificationsArray);
      } else {
        console.warn("Notifications is not an array:", data);
        setNotifications([]);
      }
    } catch (error) {
      console.error("[NotificationContext] Load error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  /**
   * Add notification with optimistic UI update
   */
  const addNotification = useCallback(
    async (type, title, message, referenceId = null) => {
      const userId = getUserId();
      if (!userId) {
        console.warn("No userId for addNotification");
        return;
      }

      // Optimistic update
      const temp = {
        id: Date.now().toString(),
        userId,
        type,
        title,
        message,
        referenceId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [temp, ...prev]);

      try {
        const response = await createNotification({
          userId,
          type,
          title,
          message,
          referenceId,
        });

        // Replace temp with actual
        const created = response?.notification || response;
        setNotifications((prev) =>
          prev.map((n) => (n.id === temp.id ? created : n))
        );
      } catch (error) {
        console.error("[NotificationContext] Create error:", error);
        // Keep optimistic update
      }
    },
    [getUserId]
  );

  const markOneRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("[NotificationContext] Mark one error:", error);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsAsRead(userId);
    } catch (error) {
      console.error("[NotificationContext] Mark all error:", error);
    }
  }, [getUserId]);

  const removeOne = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error("[NotificationContext] Delete one error:", error);
    }
  }, []);

  const clearAll = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    setNotifications([]);
    try {
      await deleteAllNotifications(userId);
    } catch (error) {
      console.error("[NotificationContext] Delete all error:", error);
    }
  }, [getUserId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        addNotification,
        markOneRead,
        markAllRead,
        removeOne,
        clearAll,
        reload: loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within <NotificationProvider>"
    );
  return ctx;
}
