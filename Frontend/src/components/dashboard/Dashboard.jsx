import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Car,
  History,
  FileText,
  User,
  Settings,
  Search,
  Bell,
  Key,
  Calendar,
  DollarSign
} from "lucide-react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    activeRentals: 0,
    upcomingBookings: 0,
    totalSpent: 0
  });

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchUserProfile();
    fetchReservations();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Try to get from localStorage as fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setUserName(user.nom_complet || user.name || user.email?.split('@')[0] || "User");
          } catch (e) { }
        }
        return;
      }

      const response = await fetch('http://localhost:8000/api/auth/profile', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserName(userData.nom_complet || userData.fullName || userData.name || "User");
        // Store for future use
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Fallback to localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.nom_complet || user.name || "User");
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUserName("User");
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8000/api/reservations/my?email=${userEmail}`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const lastThreeReservations = data.slice(-3).reverse(); // Most recent first
      setBookings(lastThreeReservations);

      // Calculate stats from ALL reservations (not just last 3)
      const active = data.filter(r =>
        r.status === "active" || r.status === "progress" || r.status === "confirmed"
      ).length;

      const upcoming = data.filter(r => r.status === "pending").length;
      const total = data.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);

      setStats({
        activeRentals: active || 0,
        upcomingBookings: upcoming || 0,
        totalSpent: total.toFixed(2) || "0.00"
      });

    } catch (err) {
      console.error("Error fetching reservations:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "progress":
        return "progress";
      case "confirmed":
        return "confirmed";
      case "pending":
        return "pending";
      default:
        return "pending";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "progress":
        return "In Progress";
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      default:
        return status || "Pending";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} days rental`;
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading your reservations...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #f6f8fb;
          align-items: flex-start;
        }
        .dashboard-main {
          flex: 1;
          padding: 35px 40px;
          overflow-y: auto;
        }
        .dashboard-topbar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .dashboard-search {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          border-radius: 8px;
          width: 320px;
        }
        .dashboard-search input {
          border: none;
          outline: none;
          width: 100%;
          background: transparent;
        }
        .dashboard-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dashboard-avatar {
          width: 34px;
          height: 34px;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .dashboard-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
        }
        .dashboard-header h1 {
          font-size: 26px;
          font-weight: 600;
          margin: 0;
        }
        .dashboard-header p {
          font-size: 14px;
          color: #6b7280;
          margin-top: 5px;
        }
        .dashboard-bookBtn {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
        }
        .dashboard-bookBtn a {
          text-decoration: none;
          color: inherit;
        }
        .dashboard-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
        }
        .dashboard-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          flex: 1;
        }
        .dashboard-cardTop {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .dashboard-cardTitle {
          font-size: 13px;
          color: #6b7280;
        }
        .dashboard-cardValue {
          font-size: 22px;
          font-weight: 600;
        }
        .dashboard-tableCard {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
        }
        .dashboard-tableCard h3 {
          margin-bottom: 10px;
        }
        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .dashboard-table th {
          font-size: 11px;
          color: #9ca3af;
          text-align: left;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .dashboard-table td {
          padding: 16px 0;
          border-bottom: 1px solid #f1f3f6;
        }
        .dashboard-vehicle {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dashboard-vehicle img {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          object-fit: cover;
        }
        .dashboard-carName {
          font-weight: 500;
        }
        .dashboard-plate {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }
        .dashboard-sub {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }
        .dashboard-total {
          font-weight: 500;
        }
        .dashboard-status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .dashboard-status::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }
        .dashboard-status.progress {
          background: #e7f8ef;
          color: #16a34a;
        }
        .dashboard-status.progress::before {
          background: #16a34a;
        }
        .dashboard-status.confirmed {
          background: #eef4ff;
          color: #2563eb;
        }
        .dashboard-status.confirmed::before {
          background: #2563eb;
        }
        .dashboard-status.pending {
          background: #fff3e6;
          color: #f59e0b;
        }
        .dashboard-status.pending::before {
          background: #f59e0b;
        }
        .dashboard-modify {
          border: none;
          background: none;
          color: #2563eb;
          cursor: pointer;
        }
        .dashboard-bottom {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }
        .dashboard-help, .dashboard-invoice {
          flex: 1;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
        }
        .dashboard-help h4, .dashboard-invoice h4 {
          margin-bottom: 8px;
        }
        .dashboard-help p, .dashboard-invoice p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .dashboard-rentBtn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>

      <Sidebar />

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="dashboard-search">
            <Search size={20} />
            <input placeholder="Search bookings, invoices..." />
          </div>
          
        </div>

        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {userName || "Guest"}!</h1>
            <p>Here is an overview of your car rental activity</p>
          </div>
          <button className="dashboard-bookBtn">
            <Link to="/VehicleCatalogPage">Book New Car</Link>
          </button>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-card">
            <div className="dashboard-cardTop">
              <Key size={18} />
              <span style={{ color: "#16a34a" }}>+{stats.activeRentals}%</span>
            </div>
            <div className="dashboard-cardTitle">Active Rentals</div>
            <div className="dashboard-cardValue">{stats.activeRentals}</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-cardTop">
              <Calendar size={18} />
              <span style={{ color: "#6b7280" }}>{stats.upcomingBookings > 0 ? `+${stats.upcomingBookings}` : '0'}%</span>
            </div>
            <div className="dashboard-cardTitle">Upcoming Bookings</div>
            <div className="dashboard-cardValue">{stats.upcomingBookings}</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-cardTop">
              <DollarSign size={18} />
              <span style={{ color: "#ef4444" }}>-5%</span>
            </div>
            <div className="dashboard-cardTitle">Total Spent</div>
            <div className="dashboard-cardValue">${stats.totalSpent}</div>
          </div>
        </div>

        <div className="dashboard-tableCard">
          <h3>My Bookings</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>VEHICLE</th>
                <th>DATES</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    No reservations found. Book your first car!
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="dashboard-vehicle">
                      <img
                        src={booking.vehicle?.image_url || "https://via.placeholder.com/60"}
                        alt={booking.vehicle?.name || "Car"}
                      />
                      <div>
                        <div className="dashboard-carName">{booking.vehicle?.name || "Unknown Vehicle"}</div>
                        <div className="dashboard-plate">Plate: {booking.vehicle?.plate_number || "N/A"}</div>
                      </div>
                    </td>
                    <td>
                      <div>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</div>
                      <div className="dashboard-sub">{calculateDuration(booking.start_date, booking.end_date)}</div>
                    </td>
                    <td className="dashboard-total">${parseFloat(booking.total_price).toFixed(2)}</td>
                    <td>
                      <span className={`dashboard-status ${getStatusClass(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td>
                      <button className="dashboard-modify" onClick={() => window.location.href = `/booking/${booking.id}`}>
                        Modify
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="dashboard-bottom">
          <div className="dashboard-help">
            <h4>Need help with a rental?</h4>
            <p>Our support team is available 24/7</p>
            <button className="dashboard-rentBtn">Chat Now</button>
          </div>
          <div className="dashboard-invoice">
            <h4>Recent Invoices</h4>
            <p>Download your latest statements</p>
            <button className="dashboard-rentBtn">View All</button>
          </div>
        </div>
      </div>
    </div>
  );
}