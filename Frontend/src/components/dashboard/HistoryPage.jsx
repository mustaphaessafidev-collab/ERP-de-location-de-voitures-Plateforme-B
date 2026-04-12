import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Car,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getUserReservations } from "../../services/reservation";

export default function HistoryPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchAllReservations = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) return setReservations([]);

      const data = await getUserReservations(userId);
      setReservations(data || []);
    } catch (err) {
      console.error(err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const filtered = reservations.filter((r) =>
    r.vehicle_id?.toString().includes(searchTerm) ||
    r.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const data = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          My Rental History
        </h1>
        <p className="text-gray-500">
          View all your past and upcoming reservations
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-6 max-w-md">
        <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-1 shadow-sm focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-300 transition-all duration-300">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search reservations..."
            className="w-full p-2.5 outline-none bg-transparent text-gray-700 placeholder-gray-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">
              Total Reservations
            </span>
            <Car className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mt-3">
            {reservations.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">
              Completed
            </span>
            <Calendar className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mt-3">
            {
              reservations.filter(
                (r) =>
                  r.status === "confirmed" ||
                  r.status === "completed"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">
              Total Spent
            </span>
            <DollarSign className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mt-3">
            $
            {reservations
              .reduce((sum, r) => sum + (parseFloat(r.prix) || 0), 0)
              .toFixed(2)}
          </h2>
        </div>
      </div>

      {/* CARDS GRID */}
      {data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Car size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No reservations found</h3>
          <p className="text-gray-500">You haven't made any reservations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {data.map((r) => {
            // Determine status colors
            const status = r.status?.toLowerCase();
            let statusClasses = "bg-gray-100 text-gray-600";
            if (status === "confirmed" || status === "completed") {
              statusClasses = "bg-green-100 text-green-600";
            } else if (status === "pending") {
              statusClasses = "bg-yellow-100 text-yellow-600";
            } else if (status === "cancelled") {
              statusClasses = "bg-red-100 text-red-600";
            }

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] flex flex-col"
              >
                {/* Header (Icon, ID, Badges) */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Car size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Vehicle #{r.vehicle_id}</h3>
                      <p className="text-sm text-gray-500">Reservation #{r.id}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusClasses}`}>
                    {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Unknown"}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 text-sm">Start</span>
                      <span className="font-medium text-gray-900 text-sm">{formatDate(r.date_debut)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">End</span>
                      <span className="font-medium text-gray-900 text-sm">{formatDate(r.date_fin)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-gray-500 text-sm">Duration</span>
                    <span className="font-medium text-gray-900">{r.nombre_jours} days</span>
                  </div>

                  <div className="flex justify-between items-center px-1 pt-4 border-t border-gray-100">
                    <span className="text-gray-500 text-sm">Total Price</span>
                    <span className="font-bold text-lg text-gray-900">${parseFloat(r.prix).toFixed(2)}</span>
                  </div>
                </div>

                {/* Action */}
                <Link
                  to={`/booking/${r.id}`}
                  className="w-full block text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors text-sm"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() =>
            setCurrentPage((p) => Math.max(p - 1, 1))
          }
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <span className="text-gray-500">
          Page {currentPage} / {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(p + 1, totalPages)
            )
          }
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}