import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  fetchNotifications,
  createNotification,
  markAllNotificationsRead,
  deleteAllNotifications,
  markNotificationRead,
  deleteNotification,
} from "../services/notification.js";

const NotificationContext = createContext(null);

// Email simulé — à remplacer par le vrai email de l'utilisateur connecté (auth context)
const CURRENT_USER_EMAIL = "user@driveease.ma";

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Charger les notifications depuis l'API
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications(CURRENT_USER_EMAIL);
      setNotifications(data);
    } catch {
      // API non disponible → fallback silencieux
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  /**
   * Ajoute une notification via l'API ET l'affiche immédiatement (optimistic UI)
   */
  const addNotification = useCallback(
    async (type, title, message, reservationId = null) => {
      // Optimistic update
      const temp = {
        id: Date.now(),
        userEmail: CURRENT_USER_EMAIL,
        type,
        title,
        message,
        reservationId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [temp, ...prev]);

      try {
        const created = await createNotification({
          userEmail: CURRENT_USER_EMAIL,
          type,
          title,
          message,
          reservationId,
        });
        // Remplace l'entrée temporaire par l'entrée réelle de l'API
        setNotifications((prev) =>
          prev.map((n) => (n.id === temp.id ? created : n))
        );
      } catch {
        // Si l'API échoue, garder la version optimiste
      }
    },
    []
  );

  const markOneRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationRead(id);
    } catch {
      // ignore
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead(CURRENT_USER_EMAIL);
    } catch {
      // ignore
    }
  }, []);

  const removeOne = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotification(id);
    } catch {
      // ignore
    }
  }, []);

  const clearAll = useCallback(async () => {
    setNotifications([]);
    try {
      await deleteAllNotifications(CURRENT_USER_EMAIL);
    } catch {
      // ignore
    }
  }, []);

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
  if (!ctx) throw new Error("useNotifications doit être utilisé dans <NotificationProvider>");
  return ctx;
}
