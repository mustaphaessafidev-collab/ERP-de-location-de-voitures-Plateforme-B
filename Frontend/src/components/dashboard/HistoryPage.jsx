import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, Car, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function HistoryPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchAllReservations = async () => {
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
      // Show ALL reservations, most recent first
      setReservations(data.reverse());
      
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case "active":
      case "progress":
        return "progress";
      case "confirmed":
        return "confirmed";
      case "pending":
        return "pending";
      case "cancelled":
        return "pending";
      default:
        return "pending";
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case "active":
      case "progress":
        return "In Progress";
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Pending";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  // Filter reservations based on search
  const filteredReservations = reservations.filter(res => 
    res.vehicle?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.id?.toString().includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
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
            <p>Loading your reservation history...</p>
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
        }
        .dashboard-main {
          flex: 1;
          padding: 35px 40px;
          overflow-y: auto;
        }
        .history-header {
          margin-bottom: 30px;
        }
        .history-header h1 {
          font-size: 26px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        .history-header p {
          font-size: 14px;
          color: #6b7280;
        }
        .history-search {
          margin-bottom: 25px;
        }
        .search-wrapper {
          position: relative;
          max-width: 400px;
        }
        .search-wrapper input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          background: white;
        }
        .search-wrapper input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .history-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          flex: 1;
        }
        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .stat-card-title {
          font-size: 13px;
          color: #6b7280;
        }
        .stat-card-value {
          font-size: 28px;
          font-weight: 600;
          color: #1f2937;
        }
        .history-table-container {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow-x: auto;
        }
        .history-table {
          width: 100%;
          border-collapse: collapse;
        }
        .history-table th {
          text-align: left;
          padding: 15px 20px;
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .history-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f3f6;
          font-size: 14px;
        }
        .vehicle-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .vehicle-cell img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
        }
        .vehicle-name {
          font-weight: 500;
          margin-bottom: 4px;
        }
        .vehicle-plate {
          font-size: 11px;
          color: #9ca3af;
        }
        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .status-badge::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }
        .status-badge.progress {
          background: #e7f8ef;
          color: #16a34a;
        }
        .status-badge.progress::before {
          background: #16a34a;
        }
        .status-badge.confirmed {
          background: #eef4ff;
          color: #2563eb;
        }
        .status-badge.confirmed::before {
          background: #2563eb;
        }
        .status-badge.pending {
          background: #fff3e6;
          color: #f59e0b;
        }
        .status-badge.pending::before {
          background: #f59e0b;
        }
        .view-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
        }
        .view-link:hover {
          text-decoration: underline;
        }
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          background: white;
        }
        .pagination button {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pagination button:hover:not(:disabled) {
          background: #f9fafb;
        }
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination span {
          font-size: 13px;
          color: #6b7280;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }
      `}</style>

      <Sidebar />

      <div className="dashboard-main">
        <div className="history-header">
          <h1>My Rental History</h1>
          <p>View all your past and upcoming reservations</p>
        </div>

        {/* Search Bar */}
        <div className="history-search">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by vehicle, status, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="history-stats">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Reservations</span>
              <Car size={20} color="#3b82f6" />
            </div>
            <div className="stat-card-value">{reservations.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Completed</span>
              <Calendar size={20} color="#10b981" />
            </div>
            <div className="stat-card-value">
              {reservations.filter(r => r.status === "completed" || r.status === "progress").length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Spent</span>
              <DollarSign size={20} color="#f59e0b" />
            </div>
            <div className="stat-card-value">
              ${reservations.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>VEHICLE</th>
                <th>DATES</th>
                <th>DURATION</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    {searchTerm ? "No reservations match your search" : "No reservations found"}
                   </td>
                </tr>
              ) : (
                paginatedReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>#{reservation.id}</td>
                    <td>
                      <div className="vehicle-cell">
                        <img 
                          src={reservation.vehicle?.image_url || "https://via.placeholder.com/50"} 
                          alt={reservation.vehicle?.name}
                        />
                        <div>
                          <div className="vehicle-name">{reservation.vehicle?.name || "Unknown Vehicle"}</div>
                          <div className="vehicle-plate">Plate: {reservation.vehicle?.plate_number || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {formatDate(reservation.start_date)}<br />
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>to</span><br />
                      {formatDate(reservation.end_date)}
                    </td>
                    <td>{calculateDuration(reservation.start_date, reservation.end_date)}</td>
                    <td style={{ fontWeight: 500 }}>${parseFloat(reservation.total_price).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td>
                      <Link to={`/booking/${reservation.id}`} className="view-link">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}