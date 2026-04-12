import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, Car, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getUserReservations } from "../../services/reservation";

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

      // Get user ID from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) {
        console.warn("[HISTORY PAGE] User ID not found in localStorage");
        setReservations([]);
        return;
      }

      console.log("[HISTORY PAGE] Fetching all reservations for userId:", userId);

      // Fetch reservations from API
      const data = await getUserReservations(userId);

      console.log("[HISTORY PAGE] ✅ Received reservations:", data);

      // Sort by most recent first
      setReservations(data || []);
    } catch (err) {
      console.error("[HISTORY PAGE] ❌ Error fetching reservations:", err);
      setReservations([]);
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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
    <div className="p-8 w-full">
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
              ${reservations.reduce((sum, r) => sum + (parseFloat(r.prix) || 0), 0).toFixed(2)}
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
                        <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                          <Car size={20} color="#666" />
                        </div>
                        <div>
                          <div className="vehicle-name">Vehicle #{reservation.vehicle_id}</div>
                          <div className="vehicle-plate">Reservation #{reservation.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {formatDate(reservation.date_debut)}<br />
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>to</span><br />
                      {formatDate(reservation.date_fin)}
                    </td>
                    <td>{reservation.nombre_jours} day{reservation.nombre_jours > 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: 500 }}>${parseFloat(reservation.prix).toFixed(2)}</td>
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
    
  );
}