import React from "react";
import "./Sidebar.css";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Star,
  History,
  FileText,
  User,
  Settings,
  Bell,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">


      <nav>

        <NavLink to="/dashboard" className="navItem">
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/#" className="navItem">
          <Star size={18} />
          Ratings
        </NavLink>

        <NavLink to="/history" className="navItem">
          <History size={18} />
          History
        </NavLink>

        <NavLink to="/#" className="navItem">
          <Bell size={18} />
          Notifications
        </NavLink>

        <NavLink to="/profile" className="navItem">
          <User size={18} />
          Profile
        </NavLink>

        

      </nav>

      <Link to="/VehicleCatalogPage"><button className="rentBtn">Rent a Car</button></Link>

    </aside>
  );
}