import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  History,
  FileText,
  User,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">


      <nav>

        <NavLink to="/dashboard" className="navItem">
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/fleet" className="navItem">
          <Car size={18} />
          Fleet
        </NavLink>

        <NavLink to="/history" className="navItem">
          <History size={18} />
          History
        </NavLink>

        <NavLink to="/invoices" className="navItem">
          <FileText size={18} />
          Invoices
        </NavLink>

        <NavLink to="/profile" className="navItem">
          <User size={18} />
          Profile
        </NavLink>

        <NavLink to="/settings" className="navItem">
          <Settings size={18} />
          Settings
        </NavLink>

      </nav>

      <button className="rentBtn">Rent a Car</button>

    </aside>
  );
}