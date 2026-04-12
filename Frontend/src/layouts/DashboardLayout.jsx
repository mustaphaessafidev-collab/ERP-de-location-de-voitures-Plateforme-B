import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex flex-1 min-h-0 bg-slate-50">
      {/* Sidebar - Fixed width, sticky */}
      <Sidebar />

      {/* Main Content - Flexible, scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
