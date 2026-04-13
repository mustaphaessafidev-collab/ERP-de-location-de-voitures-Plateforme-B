import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Car,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getUserReservations } from "../../services/reservation";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    activeRentals: 0,
    upcomingBookings: 0,
    totalSpent: "0.00",
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
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setUserName(user.nom_complet || user.name || "Utilisateur");
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
        return;
      }

      const response = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserName(userData.nom_complet || userData.fullName || "Utilisateur");
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUserName("Utilisateur");
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);

      // Get user ID from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) {
        console.warn("[DASHBOARD] User ID not found in localStorage");
        setBookings([]);
        setStats({
          activeRentals: 0,
          upcomingBookings: 0,
          totalSpent: "0.00",
        });
        return;
      }

      console.log("[DASHBOARD] Fetching reservations for userId:", userId);

      // Fetch reservations from new API endpoint
      const data = await getUserReservations(userId);

      console.log("[DASHBOARD] ✅ Received reservations:", data);

      // Get last 3 reservations (most recent first)
      const lastThreeReservations = data.slice(0, 3);
      setBookings(lastThreeReservations);

      // Calculate stats
      const active = data.filter(
        (r) =>
          r.status?.toLowerCase() === "confirmed" ||
          r.status?.toLowerCase() === "progress"
      ).length;

      const upcoming = data.filter((r) => r.status?.toLowerCase() === "pending")
        .length;

      const total = data.reduce(
        (sum, r) => sum + (parseFloat(r.prix) || 0),
        0
      );

      setStats({
        activeRentals: active || 0,
        upcomingBookings: upcoming || 0,
        totalSpent: total.toFixed(2) || "0.00",
      });

      console.log("[DASHBOARD] Stats:", {
        activeRentals: active,
        upcomingBookings: upcoming,
        totalSpent: total.toFixed(2),
      });
    } catch (err) {
      console.error("[DASHBOARD] ❌ Error fetching reservations:", err);
      setBookings([]);
      setStats({
        activeRentals: 0,
        upcomingBookings: 0,
        totalSpent: "0.00",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "progress":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "progress":
        return "En cours";
      case "confirmed":
        return "Confirmee";
      case "pending":
        return "En attente";
      default:
        return status || "En attente";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} jour${days > 1 ? "s" : ""}`;
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full">{/* Top Bar */}
      {/* Top Bar */}
      

      {/* Welcome Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bon retour, {userName} ! 
          </h1>
          <p className="text-slate-600">
            Voici un apercu de votre activite de location
          </p>
        </div>
        <Link
          to="/rent-car"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          <Car size={18} />
          Reserver une voiture
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Rentals Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <span className="text-green-600 font-semibold text-sm">Actif</span>
          </div>
          <p className="text-slate-600 text-sm mb-1">Locations actives</p>
          <h3 className="text-3xl font-bold text-slate-900">
            {stats.activeRentals}
          </h3>
          <div className="flex items-center gap-1 mt-3 text-green-600 text-sm">
            <TrendingUp size={14} />
            Locations en cours
          </div>
        </div>

        {/* Upcoming Bookings Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="text-blue-600" size={24} />
            </div>
            <span className="text-blue-600 font-semibold text-sm">En attente</span>
          </div>
          <p className="text-slate-600 text-sm mb-1">Reservations a venir</p>
          <h3 className="text-3xl font-bold text-slate-900">
            {stats.upcomingBookings}
          </h3>
          <div className="flex items-center gap-1 mt-3 text-blue-600 text-sm">
            <Clock size={14} />
            A venir
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-amber-600" size={24} />
            </div>
            <span className="text-amber-600 font-semibold text-sm">Total</span>
          </div>
          <p className="text-slate-600 text-sm mb-1">Total depense</p>
          <h3 className="text-3xl font-bold text-slate-900">
            ${stats.totalSpent}
          </h3>
          <div className="flex items-center gap-1 mt-3 text-amber-600 text-sm">
            <DollarSign size={14} />
            Depenses cumulees
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Reservations recentes</h2>
            <Link
              to="/history"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Car className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Aucune reservation pour l'instant
            </h3>
            <p className="text-slate-600 mb-4">
              Commencez votre trajet en reservant une voiture des maintenant !
            </p>
            <Link
              to="/rent-car"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <Car size={16} />
              Voir les vehicules
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Vehicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Duree
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                          <Car className="text-slate-600" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Vehicule #{booking.vehicle_id}
                          </p>
                          <p className="text-xs text-slate-500">
                            Reservation #{booking.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(booking.date_debut)} au{" "}
                      {formatDate(booking.date_fin)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {booking.nombre_jours} jour{booking.nombre_jours > 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ${parseFloat(booking.prix).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            getStatusClass(booking.status).includes("green")
                              ? "bg-green-600"
                              : getStatusClass(booking.status).includes("blue")
                              ? "bg-blue-600"
                              : "bg-amber-600"
                          }`}
                        ></div>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition">
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Cards */}
      
    </div>
  );
}