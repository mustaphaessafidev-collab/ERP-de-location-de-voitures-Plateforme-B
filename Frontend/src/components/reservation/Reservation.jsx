import { jsPDF } from "jspdf";
import axios from "axios";
import { useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaMapMarkerAlt, FaPhone, FaRoad, FaCar } from "react-icons/fa";
import { useNotifications } from "../../context/NotificationContext";
import { createReservation } from "../../services/reservation";


// ===== HELPER FUNCTIONS =====
function formatDate(dateStr, timeStr) {
  if (!dateStr) return "-";
  const date = new Date(`${dateStr}T${timeStr || "10:00"}`);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value) {
  return `${Number(value || 0).toFixed(2)} DH`;
}

// Calculate rental progress based on current time
function calculateProgress(pickUpDate, returnDate) {
  const now = new Date();
  const pickUp = new Date(`${pickUpDate}T10:00`);
  const returnDt = new Date(`${returnDate}T18:00`);
  
  const totalDuration = returnDt.getTime() - pickUp.getTime();
  const elapsedTime = now.getTime() - pickUp.getTime();
  const progressPercent = Math.max(0, Math.min(100, (elapsedTime / totalDuration) * 100));
  
  let currentStep = "reserved";
  if (now < pickUp) {
    currentStep = "reserved";
  } else if (now >= pickUp && now < returnDt) {
    currentStep = "in-progress";
  } else {
    currentStep = "completed";
  }
  
  return { progressPercent, currentStep };
}

// Helper to get step styling
function getStepStyles(currentStep, stepName) {
  const isActive = (stepName === "reserved" && currentStep !== "in-progress" && currentStep !== "completed") ||
                   (stepName === "pickup" && (currentStep === "in-progress" || currentStep === "completed")) ||
                   (stepName === "return" && currentStep === "completed");
  
  const isCompleted =
    (stepName === "reserved") ||
    (stepName === "pickup" && (currentStep === "in-progress" || currentStep === "completed")) ||
    (stepName === "return" && currentStep === "completed");
  
  return {
    container: `rounded-lg border-2 p-3 transition-all ${
      isCompleted ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
    }`,
    icon: `flex h-9 w-9 items-center justify-center rounded-full border-2 mx-auto mb-2 text-sm font-bold ${
      isCompleted ? "border-blue-500 bg-blue-100 text-blue-600" : "border-slate-300 bg-white text-slate-400"
    }`,
    text: `text-xs font-semibold text-center ${
      isActive ? "text-blue-700" : "text-slate-700"
    }`,
    date: "text-[11px] text-slate-500 text-center mt-1"
  };
}

async function imageUrlToDataUrl(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function Reservation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { addNotification } = useNotifications();
  const bookingData = state?.bookingData ?? state;
  
  // State management - minimal
  const [reservationStatus, setReservationStatus] = useState("Confirmed");
  const [isLoading, setIsLoading] = useState(false);

  // Extract booking data with defaults
  const reservationId = bookingData?.reservationId || "#782910";
  const days = bookingData?.numberDays ?? 5;
  const basePrice = bookingData?.basePrice ?? 425;
  const insurancePrice = bookingData?.insurancePrice ?? 75;
  const serviceFee = bookingData?.serviceFee ?? 55;
  const taxes = bookingData?.taxes ?? 0;
  const totalPrice = bookingData?.totalPrice ?? basePrice + insurancePrice + serviceFee + taxes;
  const vehicleName = bookingData?.vehicleName || "Tesla Model 3 - 2023";
  const vehicleImage =
    bookingData?.vehicleImage ||
    "https://i.pinimg.com/1200x/dd/e0/90/dde090a46c2af259fb3f8540eee76154.jpg";
  const agency = bookingData?.agency || "Berlin Brandenburg Airport (BER)";
  const city = bookingData?.city || "Terminal 1, level 0, Rental Car Center";
  const pickUpFormatted = formatDate(bookingData?.pickUpDate, bookingData?.pickUpTime);
  const returnFormatted = formatDate(bookingData?.returnDate, bookingData?.returnTime);
  const isCancelled = reservationStatus === "Cancelled";

  // Calculate progress
  const progressData = useMemo(() => {
    if (!bookingData?.pickUpDate || !bookingData?.returnDate) {
      return { progressPercent: 0, currentStep: "reserved" };
    }
    return calculateProgress(bookingData.pickUpDate, bookingData.returnDate);
  }, [bookingData?.pickUpDate, bookingData?.returnDate]);

  // Handlers using useCallback
  const handlePrint = useCallback(() => window.print(), []);

  const handleModify = useCallback(() => {
    addNotification(
      "info",
      "Modification en cours ✏️",
      `Vous modifiez la réservation ${reservationId} pour ${vehicleName}.`,
      reservationId
    );
    if (bookingData?.vehicleId) {
      navigate(`/VehicleDetail/${bookingData.vehicleId}`);
    } else {
      navigate("/VehicleCatalogPage");
    }
  }, [reservationId, vehicleName, bookingData?.vehicleId, navigate, addNotification]);

  const handleOpenMap = useCallback((query) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const handleDownloadReceipt = useCallback(async () => {
    const doc = new jsPDF();
    const yStart = 18;

    doc.setFontSize(18);
    doc.text("Reservation Invoice", 14, yStart);
    doc.setFontSize(11);
    doc.text(`Reservation No: ${reservationId}`, 14, yStart + 8);
    doc.text(`Status: ${reservationStatus}`, 14, yStart + 14);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yStart + 20);

    let y = yStart + 30;

    try {
      const imageDataUrl = await imageUrlToDataUrl(vehicleImage);
      doc.addImage(imageDataUrl, "JPEG", 14, y, 68, 40);
    } catch {
      doc.setDrawColor(220, 220, 220);
      doc.rect(14, y, 68, 40);
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Vehicle photo unavailable", 20, y + 22);
      doc.setTextColor(0, 0, 0);
    }

    doc.setFontSize(12);
    doc.text("Booking details", 90, y + 6);
    doc.setFontSize(11);
    doc.text(`Vehicle: ${vehicleName}`, 90, y + 14);
    doc.text(`Agency: ${agency}`, 90, y + 21);
    doc.text(`Pick-up: ${pickUpFormatted}`, 90, y + 28);
    doc.text(`Drop-off: ${returnFormatted}`, 90, y + 35);

    y += 52;
    doc.setDrawColor(220, 220, 220);
    doc.line(14, y, 196, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Pricing", 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Rental Rate (${days} days): ${formatMoney(basePrice)}`, 14, y);
    y += 7;
    doc.text(`Insurance: ${formatMoney(insurancePrice)}`, 14, y);
    y += 7;
    doc.text(`Taxes & Fees: ${formatMoney(serviceFee)}`, 14, y);
    y += 9;
    doc.setFontSize(13);
    doc.text(`Total Amount: ${formatMoney(totalPrice)}`, 14, y);

    doc.save(`invoice-${reservationId.replace("#", "")}.pdf`);
  }, [reservationId, reservationStatus, vehicleImage, vehicleName, agency, pickUpFormatted, returnFormatted, days, basePrice, insurancePrice, serviceFee, totalPrice]);

  const handleConfirm = useCallback(async () => {
    console.log("[FRONTEND] === Reservation Confirm ===");
    console.log("[FRONTEND] Booking Data:", bookingData);
    console.log("[FRONTEND] Pick-up:", bookingData?.pickUpDate);
    console.log("[FRONTEND] Return:", bookingData?.returnDate);

    setIsLoading(true);
    try {
      // Get user ID from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      if (!userId) {
        throw new Error(
          "User not authenticated. Please login again."
        );
      }

      // Prepare reservation payload (field names match backend database schema)
      const reservationPayload = {
        client_id: userId,
        vehicle_id: bookingData?.vehicleId,
        date_debut: bookingData?.pickUpDate,
        date_fin: bookingData?.returnDate,
        prix: bookingData?.totalPrice,
        nombre_jours: bookingData?.numberDays,
      };

      console.log("[FRONTEND] User ID:", userId);
      console.log("[FRONTEND] Reservation Payload:", reservationPayload);

      // ✅ Call reservation service (now properly routed through gateway)
      const reservation = await createReservation(reservationPayload);

      console.log("[FRONTEND] ✅ Reservation created:", reservation);

      setReservationStatus("Confirmed");
      addNotification(
        "success",
        "Réservation confirmée ",
        `Votre réservation a été créée avec succès.`,
        `RES-${reservation.id}`
      );

      // ✅ Create notification
      try {
        console.log("[FRONTEND] Creating notification for userId:", String(userId));
        await axios.post("http://localhost:4004/api/notifications", {
          userId: String(userId),
          type: "RESERVATION",
          title: "Reservation Created",
          message: "Your reservation has been created successfully.",
          referenceId: String(reservation.id),
        });
        console.log("[FRONTEND] ✅ Notification created");
        navigate("/dashboard");
      } catch (notificationError) {
        console.warn(
          "[FRONTEND] ⚠️ Notification service unavailable:",
          notificationError.message
        );
        // Don't fail the reservation if notification fails
      }
    } catch (error) {
      console.error("[FRONTEND] ❌ Error creating reservation:", error);
      console.error("Error details:", error.response?.data || error.message);

      addNotification(
        "error",
        "Erreur lors de la création ❌",
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Une erreur s'est produite.",
        reservationId
      );
    } finally {
      setIsLoading(false);
    }
  }, [bookingData, reservationId, vehicleName, addNotification]);

  const handleCancel = useCallback(() => {
    setReservationStatus("Cancelled");
    addNotification(
      "error",
      "Réservation annulée ❌",
      `La réservation ${reservationId} pour ${vehicleName} a été annulée.`,
      reservationId
    );
  }, [reservationId, vehicleName, addNotification]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-slate-100 px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="text-[11px] text-slate-500">
            Dashboard / My Bookings /{" "}
            <span className="font-medium text-slate-700">Reservation details</span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-slate-800">
                  Reservation {reservationId}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                    isCancelled
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {reservationStatus}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Booked on {new Date().toLocaleDateString()} • {days} days
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Print
              </button>
              <button
                onClick={handleModify}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Modify
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Rental Timeline
            </p>
            
            {/* SIMPLIFIED TIMELINE */}
            <div className="space-y-4">
              {/* Progress Status */}
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  progressData.currentStep === "completed" ? "bg-emerald-100 text-emerald-700" :
                  progressData.currentStep === "in-progress" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {progressData.currentStep === "completed" && "✓ Completed"}
                  {progressData.currentStep === "in-progress" && <><FaCar />   In Progress</>}
                  {progressData.currentStep === "reserved" && "📅 Upcoming"}
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  {progressData.progressPercent.toFixed(0)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    progressData.currentStep === "completed" ? "bg-emerald-500" :
                    progressData.currentStep === "in-progress" ? "bg-blue-500" :
                    "bg-slate-300"
                  }`}
                  style={{ width: `${progressData.progressPercent}%` }}
                />
              </div>

              {/* Timeline Steps */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "reserved", label: "Reservation", icon: "✓", date: new Date().toLocaleDateString() },
                  { name: "pickup", label: "Pick-up", icon: <FaCar />, date: bookingData?.pickUpDate },
                  { name: "return", label: "Return", icon: "✓", date: bookingData?.returnDate }
                ].map((step) => {
                  const styles = getStepStyles(progressData.currentStep, step.name);
                  return (
                    <div key={step.name} className={styles.container}>
                      <div className={styles.icon}>{step.icon}</div>
                      <p className={styles.text}>{step.label}</p>
                      <p className={styles.date}>{step.date}</p>
                    </div>
                  );
                })}
              </div>

              {/* Time Details - Minimal */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-slate-600 text-[10px]">Pick-up</p>
                  <p className="font-semibold text-slate-800 text-xs">{pickUpFormatted}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-slate-600 text-[10px]">Duration</p>
                  <p className="font-semibold text-slate-800 text-xs">{days} days</p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <p className="text-slate-600 text-[10px]">Return</p>
                  <p className="font-semibold text-slate-800 text-xs">{returnFormatted}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-800">Vehicle Details</h2>
                  <button
                    onClick={handleModify}
                    className="text-xs font-semibold text-blue-600"
                  >
                    View Full Specs
                  </button>
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                  <img
                    src={vehicleImage}
                    alt={vehicleName}
                    className="h-28 w-full rounded-md object-cover md:w-56"
                  />
                  <div className="space-y-2">
                    <h3 className="text-[28px] font-bold leading-tight text-slate-800">{vehicleName}</h3>
                    <p className="text-xs text-slate-500">Standard Range Plus - Midnight Silver</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>Electric</span>
                      <span>Automatic</span>
                      <span>{bookingData?.seats || 5} Seats</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    <FaMapMarkerAlt size={11} className="text-blue-600" />
                    Pick-up Location
                  </p>
                  <h4 className="mt-2 text-sm font-semibold text-slate-800">{agency}</h4>
                  <p className="text-xs text-slate-500">{city}</p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-slate-600">
                    <FaClock size={11} />
                    Open 24/7
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                    <FaPhone size={11} />
                    +49 30 1234 5678
                  </p>
                  <button
                    onClick={() => handleOpenMap(`${agency}, ${city}`)}
                    className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600 hover:bg-slate-100 transition-colors"
                  >
                    View on Map
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    <FaRoad size={11} className="text-blue-600" />
                    Drop-off Location
                  </p>
                  <h4 className="mt-2 text-sm font-semibold text-slate-800">Berlin City Center - Alexanderplatz</h4>
                  <p className="text-xs text-slate-500">Karl-Liebknecht-Str. 5, 10178 Berlin, Germany</p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-slate-600">
                    <FaClock size={11} />
                    08:00 - 20:00
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                    <FaPhone size={11} />
                    +49 30 8765 4321
                  </p>
                  <button
                    onClick={() =>
                      handleOpenMap("Berlin City Center - Alexanderplatz, Berlin")
                    }
                    className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600 hover:bg-slate-100 transition-colors"
                  >
                    View on Map
                  </button>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-800">Payment Summary</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Rental Rate ({days} days)</span>
                    <span className="font-semibold text-slate-800">{formatMoney(basePrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Premium insurance</span>
                    <span className="font-semibold text-slate-800">{formatMoney(insurancePrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Taxes & Fees</span>
                    <span className="font-semibold text-slate-800">{formatMoney(serviceFee)}</span>
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">Total Amount</span>
                    <span className="text-[30px] font-bold text-blue-600">
                      {formatMoney(totalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={handleDownloadReceipt}
                    className="mt-4 w-full rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-blue-600"
                  >
                    Download Invoice (PDF)
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">
              Need to change your plans? Free cancellation available within 24h.
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`flex-1 sm:flex-none rounded-lg border border-slate-300 bg-white px-5 py-2 font-semibold transition-colors ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed text-slate-500"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isLoading ? "Confirming..." : "Confirm"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className={`flex-1 sm:flex-none rounded-lg border border-red-300 bg-white px-5 py-2 font-semibold transition-colors ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed text-red-400"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
  );
}