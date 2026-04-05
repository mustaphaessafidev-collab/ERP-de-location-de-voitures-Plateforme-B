import { useEffect, useMemo, useState } from "react";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationService";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = "user_123";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications(userId);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch  test notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleMarkOneRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((item) => !item.isRead);
    }

    if (activeTab === "bookings") {
      return notifications.filter((item) =>
        item.type?.toLowerCase().includes("booking") ||
        item.type?.toLowerCase().includes("reservation")
      );
    }

    if (activeTab === "promotions") {
      return notifications.filter((item) =>
        item.type?.toLowerCase().includes("promo")
      );
    }

    return notifications;
  }, [notifications, activeTab]);

  if (!userId) {
    return <p className="p-6">User not found. Please login again.</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-slate-500 mb-2">Home &gt; Notifications</p>

        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Notifications & Alerts
            </h1>
            <p className="text-slate-500 mt-1">
              Stay updated with your bookings, reminders, and offers.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
          >
            Mark all as read
          </button>
        </div>

        <div className="mb-6 flex gap-6 border-b border-slate-200 text-sm font-medium">
          <button
            className={`pb-3 ${activeTab === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
            onClick={() => setActiveTab("all")}
          >
            All Notifications
          </button>

          <button
            className={`pb-3 ${activeTab === "unread" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
            onClick={() => setActiveTab("unread")}
          >
            Unread
          </button>

          <button
            className={`pb-3 ${activeTab === "bookings" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>

          <button
            className={`pb-3 ${activeTab === "promotions" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
            onClick={() => setActiveTab("promotions")}
          >
            Promotions
          </button>
        </div>

        {loading ? (
          <p>Loading notifications...</p>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500">No notifications found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  !item.isRead ? "border-blue-200" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.title || item.type}
                    </h3>
                    <p className="mt-1 text-slate-600">{item.message}</p>

                    <div className="mt-3 flex gap-3">
                      {!item.isRead && (
                        <button
                          onClick={() => handleMarkOneRead(item.id)}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;