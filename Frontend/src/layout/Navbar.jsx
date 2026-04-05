import { useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import profileImg from "./img.jpg";
import { useNotifications } from "../context/NotificationContext";
import NotificationPanel from "../components/notifications/NotificationPanel";

export default function Navbar() {
  const { unreadCount } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-8">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              🚗
            </div>
            <span className="text-lg font-semibold text-slate-800">
              DriveEase ERP
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
            <Link to="/VehicleCatalogPage" className="hover:text-slate-800">
              Dashboard
            </Link>
            <a href="#" className="hover:text-slate-800">
              Vehicles
            </a>
            <a href="#" className="hover:text-slate-800">
              Bookings
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="notification-bell"
              onClick={() => setShowPanel((v) => !v)}
              className="relative text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white"
                  style={{ animation: "pulse 2s infinite" }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showPanel && (
              <NotificationPanel onClose={() => setShowPanel(false)} />
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 border-l pl-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                Mustapha ESSAFI
              </p>
              <p className="text-xs text-slate-400">
                Premium Member
              </p>
            </div>

            <img
              className="h-10 w-10 rounded-full object-cover"
              src={profileImg}
              alt="profile"
            />
          </div>
        </div>

      </div>
    </nav>
  );
}