import { useEffect, useMemo, useState } from "react";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notificationService";
import { FaUser, FaCar, FaCheckCircle, FaBell } from "react-icons/fa";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || "user_123";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications(userId);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "LOGIN":
        return <FaUser className="text-blue-500 text-lg" />;
      case "PROFILE":
        return <FaUser className="text-purple-500 text-lg" />;
      case "RESERVATION":
        return <FaCar className="text-green-500 text-lg" />;
      case "APPROVED":
        return <FaCheckCircle className="text-green-600 text-lg" />;
      default:
        return <FaBell className="text-amber-500 text-lg" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "LOGIN":
        return "bg-blue-100";
      case "PROFILE":
        return "bg-purple-100";
      case "RESERVATION":
        return "bg-green-100";
      case "APPROVED":
        return "bg-emerald-100";
      default:
        return "bg-amber-100";
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => !n.isRead);
    }

    if (activeTab === "bookings") {
      return notifications.filter((n) =>
        n.type?.toLowerCase().includes("reservation") ||
        n.type?.toLowerCase().includes("booking") ||
        n.type?.toLowerCase().includes("approved")
      );
    }

    if (activeTab === "promotions") {
      return notifications.filter((n) =>
        n.type?.toLowerCase().includes("promo") ||
        n.type?.toLowerCase().includes("offer")
      );
    }

    return notifications;
  }, [notifications, activeTab]);

  const handleMarkOneRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark one as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this notification?");
    if (!confirmDelete) return;

    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setFavorites((prev) => prev.filter((favId) => favId !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  if (!userId) {
    return <p className="p-6">User not found. Please login again.</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm text-slate-400">Home &gt; Notifications</p>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Notifications & Alerts
            </h1>
            <p className="mt-2 text-slate-500">
              Stay updated with your bookings, car maintenance, and exclusive rental offers.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="rounded-2xl bg-blue-100 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
          >
            Mark all as read
          </button>
        </div>

        <div className="mb-6 flex gap-8 border-b border-slate-200 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 ${
              activeTab === "all"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500"
            }`}
          >
            All Notifications{" "}
            <span className="ml-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs">
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("unread")}
            className={`pb-3 ${
              activeTab === "unread"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500"
            }`}
          >
            Unread{" "}
            <span className="ml-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 ${
              activeTab === "bookings"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500"
            }`}
          >
            Bookings
          </button>

          <button
            onClick={() => setActiveTab("promotions")}
            className={`pb-3 ${
              activeTab === "promotions"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-500"
            }`}
          >
            Promotions
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-500">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-500">No notifications found.</p>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Today
            </p>

            <div className="space-y-4">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:shadow-md"
                >
                  {!item.isRead && (
                    <div className="absolute left-0 top-4 h-16 w-1 rounded-r-full bg-blue-500" />
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${getBgColor(
                        item.type
                      )}`}
                    >
                      {getNotificationIcon(item.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[24px] font-semibold leading-tight text-slate-800 md:text-xl">
                            {item.title || item.type}
                          </h3>

                          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                            {item.message}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-slate-400">
                          {timeAgo(item.createdAt)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {!item.isRead && (
                          <button
                            onClick={() => handleMarkOneRead(item.id)}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            Mark as read
                          </button>
                        )}

                        {(item.type === "RESERVATION" || item.type === "APPROVED") && (
                          <>
                            <button className="text-sm font-semibold text-blue-600 hover:underline">
                              View Details
                            </button>
                            <button className="text-sm font-medium text-slate-500 hover:text-slate-700">
                              Add to Calendar
                            </button>
                          </>
                        )}

                        {item.type === "PROMO" && (
                          <button className="text-sm font-semibold text-blue-600 hover:underline">
                            Claim Offer
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="ml-2 flex shrink-0 items-center gap-4 self-center">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`text-xl transition ${
                          favorites.includes(item.id)
                            ? "text-yellow-400"
                            : "text-slate-300 hover:text-yellow-400"
                        }`}
                        title="Favorite"
                      >
                        ★
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-lg text-red-400 transition hover:text-red-600"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;