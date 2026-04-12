import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Star,
  History,
  Bell,
  User,
  Car,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/ratings",
      label: "Ratings",
      icon: Star,
    },
    {
      path: "/history",
      label: "History",
      icon: History,
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold text-slate-900">DriveEase</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Rent Car Button */}
      <div className="p-4 border-t border-slate-200">
        <NavLink
          to="/rent-car"
          className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isActive("/rent-car")
              ? "bg-blue-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Car size={18} />
          Rent a Car
        </NavLink>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}