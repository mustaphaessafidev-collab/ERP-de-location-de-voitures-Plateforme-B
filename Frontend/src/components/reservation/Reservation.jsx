import { Clock3, MapPin, Phone, Route } from "lucide-react";
import { jsPDF } from "jspdf";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import { fetchReservationPlanning } from "../../services/reservation.js";
import { useNotifications } from "../../context/NotificationContext";

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

function downloadPdf({ filename, title, lines }) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text(title, 14, y);
  y += 10;

  doc.setFontSize(11);
  lines.forEach((line) => {
    doc.text(String(line), 14, y);
    y += 7;
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(filename);
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

/** Aligné sur `GET /api/reservations/planning` (vert = disponible, rouge = indisponible). */
const FALLBACK_PLANNING = {
  monthLabel: "Mai 2026",
  planningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  planningDates: [29, 30, 1, 2, 3, 4, 5],
  rows: [
    {
      label: "Haute saison : 120€/jour",
      kind: "available",
      segments: [
        { start: 0, span: 5 },
        { start: 5, span: 1, note: "Fermé" },
        { start: 6, span: 1, note: "Fermé" },
      ],
    },
    {
      label: "Non disponible",
      kind: "unavailable",
      segments: [{ start: 0, span: 7 }],
    },
    {
      label: "Haute saison : 120€/jour",
      kind: "available",
      segments: [
        { start: 0, span: 5 },
        { start: 5, span: 1, note: "Fermé" },
        { start: 6, span: 1, note: "Fermé" },
      ],
    },
  ],
};

const ROW_BAR_CLASS = {
  available: "bg-emerald-500 text-white",
  unavailable: "bg-rose-500 text-white",
};

const NOTE_CLOSED_CLASS = "bg-rose-200 text-rose-800";

export default function Reservation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { addNotification } = useNotifications();
  const bookingData = state?.bookingData ?? state;
  const [reservationStatus, setReservationStatus] = useState("Confirmed");
  const [showPickUpPlanning, setShowPickUpPlanning] = useState(false);
  const [selectedPlanningSlots, setSelectedPlanningSlots] = useState([]);
  const [planningPayload, setPlanningPayload] = useState(null);
  const [planningError, setPlanningError] = useState(null);

  const reservationId = bookingData?.reservationId || "#782910";
  const days = bookingData?.numberDays ?? 5;
  const basePrice = bookingData?.basePrice ?? 425;
  const insurancePrice = bookingData?.insurancePrice ?? 75;
  const serviceFee = bookingData?.serviceFee ?? 55;
  const taxes = bookingData?.taxes ?? 0;
  const totalPrice =
    bookingData?.totalPrice ?? basePrice + insurancePrice + serviceFee + taxes;
  const vehicleName = bookingData?.vehicleName || "Tesla Model 3 - 2023";
  const vehicleImage =
    bookingData?.vehicleImage ||
    "https://i.pinimg.com/1200x/dd/e0/90/dde090a46c2af259fb3f8540eee76154.jpg";
  const agency = bookingData?.agency || "Berlin Brandenburg Airport (BER)";
  const city = bookingData?.city || "Terminal 1, level 0, Rental Car Center";
  const pickUpFormatted = formatDate(bookingData?.pickUpDate, bookingData?.pickUpTime);
  const returnFormatted = formatDate(bookingData?.returnDate, bookingData?.returnTime);
  const isCancelled = reservationStatus === "Cancelled";

  const planningDays = planningPayload?.planningDays ?? FALLBACK_PLANNING.planningDays;
  const planningDates = planningPayload?.planningDates ?? FALLBACK_PLANNING.planningDates;
  const monthLabel = planningPayload?.monthLabel ?? FALLBACK_PLANNING.monthLabel;
  const planningRows = useMemo(
    () => planningPayload?.rows ?? FALLBACK_PLANNING.rows,
    [planningPayload]
  );

  useEffect(() => {
    if (!showPickUpPlanning) return;
    let cancelled = false;
    setPlanningError(null);
    fetchReservationPlanning()
      .then((data) => {
        if (!cancelled) setPlanningPayload(data);
      })
      .catch(() => {
        if (!cancelled) {
          setPlanningPayload(null);
          setPlanningError("Impossible de charger le planning (données locales affichées).");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [showPickUpPlanning]);

  const selectedSlotsLabel = selectedPlanningSlots
    .map((slot) => `${planningDays[slot.day]} ${planningDates[slot.day]}`)
    .join(", ");

  const handlePrint = () => window.print();

  const handleModify = () => {
    addNotification(
      "info",
      "Modification en cours ✏️",
      `Vous modifiez la réservation ${reservationId} pour ${vehicleName}.`,
      reservationId
    );
    if (bookingData?.vehicleId) {
      navigate(`/VehicleDetail/${bookingData.vehicleId}`);
      return;
    }
    navigate("/VehicleCatalogPage");
  };

  const handleOpenMap = (query) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadReceipt = async () => {
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
  };

  const togglePlanningSlot = (rowIndex, dayIndex) => {
    const row = planningRows[rowIndex];
    if (!row || row.kind !== "available") return;

    setSelectedPlanningSlots((prev) => {
      const exists = prev.some((slot) => slot.row === rowIndex && slot.day === dayIndex);
      if (exists) {
        return prev.filter((slot) => !(slot.row === rowIndex && slot.day === dayIndex));
      }
      return [...prev, { row: rowIndex, day: dayIndex }];
    });
  };

  const handleConfirm = () => {
    setReservationStatus("Confirmed");
    setShowPickUpPlanning(true);
    addNotification(
      "success",
      "Réservation confirmée ✅",
      `Réservation ${reservationId} pour ${vehicleName} confirmée avec succès.`,
      reservationId
    );
  };

  const handleReserveFromPlanning = () => {
    setReservationStatus("Confirmed");
    addNotification(
      "success",
      "Créneau réservé 📅",
      `Créneaux sélectionnés pour ${vehicleName} : ${selectedSlotsLabel || "non spécifiés"}.`,
      reservationId
    );
    navigate("/reservation-reussie", {
      replace: true,
      state: {
        reservationId,
        vehicleName,
        selectedSlots: selectedSlotsLabel || null,
      },
    });
  };

  const handleCancel = () => {
    setReservationStatus("Cancelled");
    addNotification(
      "error",
      "Réservation annulée ❌",
      `La réservation ${reservationId} pour ${vehicleName} a été annulée.`,
      reservationId
    );
  };

  return (
    <>
      <Navbar />
      <section className="min-h-[calc(100vh-64px)] bg-slate-100 px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="text-[11px] text-slate-500">
            Dashboard / My Bookings /{" "}
            <span className="font-medium text-slate-700">Reservation details</span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[34px] font-bold leading-none text-slate-800">
                  Reservation {reservationId}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    isCancelled
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {reservationStatus}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Booked on {new Date().toLocaleDateString()} - {days} days duration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
              >
                Print Detail
              </button>
              <button
                onClick={handleModify}
                className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Modify Booking
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Rental Progress
            </p>
            
            {/* LIGNE DU TEMPS (En haut) */}
            <div className="relative grid grid-cols-3 gap-3 text-sm">
              <div className="absolute left-[12%] right-[12%] top-4 h-[2px] bg-slate-200" />
              <div className="absolute left-[12%] top-4 h-[2px] w-[38%] bg-blue-500" />
              <div className="relative">
                <div className="mb-3 h-3 w-3 rounded-full bg-blue-600" />
                <p className="text-xs font-semibold text-slate-800">Reserved</p>
                <p className="text-[11px] text-slate-500">{new Date().toLocaleString()}</p>
              </div>
              <div className="relative">
                <div className="mb-3 h-3 w-3 rounded-full border-2 border-blue-500 bg-white" />
                <p className="text-xs font-semibold text-slate-800">Pick-up Expected</p>
                <p className="text-[11px] text-slate-500">{pickUpFormatted}</p>
              </div>
              <div className="relative">
                <div className="mb-3 h-3 w-3 rounded-full border border-slate-300 bg-white" />
                <p className="text-xs font-semibold text-slate-400">Return Scheduled</p>
                <p className="text-[11px] text-slate-400">{returnFormatted}</p>
              </div>
            </div>

            {/* TABLEAU DE PLANIFICATION (En dessous, prend toute la largeur) */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              {showPickUpPlanning ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                  <p className="mb-4 text-xl font-bold text-slate-800">{monthLabel}</p>
                  {planningError ? (
                    <p className="mb-3 text-sm font-medium text-amber-700">{planningError}</p>
                  ) : null}
                  
                  {/* Légende Agrandie */}
                  <div className="mb-6 flex flex-wrap gap-5 text-sm font-medium text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-5 w-10 rounded bg-emerald-500" />
                      Disponible (sélection)
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-5 w-10 rounded bg-rose-500" />
                      Non disponible
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-5 w-10 rounded bg-rose-200" />
                      Fermé
                    </span>
                  </div>

                  {/* En-tête du tableau Agrandie */}
                  <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-slate-300 text-center text-sm shadow-sm">
                    {planningDays.map((d) => (
                      <div key={d} className="border-r border-slate-300 bg-white py-3 font-bold text-slate-800 last:border-r-0">
                        {d}
                      </div>
                    ))}
                    {planningDates.map((d) => (
                      <div key={d} className="border-r border-t border-slate-300 bg-white py-3 text-slate-700 last:border-r-0">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Lignes du tableau Agrandies */}
                  <div className="mt-4 space-y-3">
                    {planningRows.map((row, rowIndex) => (
                      <div key={`${row.label}-${rowIndex}`} className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, idx) => {
                          const segment = row.segments.find(
                            (seg) => idx >= seg.start && idx < seg.start + seg.span
                          );

                          if (!segment) {
                            return <div key={idx} className="h-12 rounded-md bg-slate-200/50" />;
                          }

                          if (segment.note) {
                            return (
                              <div
                                key={idx}
                                className={`flex h-12 items-center justify-center rounded-md text-xs font-bold shadow-sm ${NOTE_CLOSED_CLASS}`}
                              >
                                {segment.note}
                              </div>
                            );
                          }

                          const isSegmentStart = idx === segment.start;
                          const barClass = ROW_BAR_CLASS[row.kind] ?? ROW_BAR_CLASS.unavailable;
                          const isSelectable = row.kind === "available";
                          const isSelected = selectedPlanningSlots.some(
                            (slot) => slot.row === rowIndex && slot.day === idx
                          );

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => togglePlanningSlot(rowIndex, idx)}
                              className={`flex h-12 items-center transition-all overflow-hidden whitespace-nowrap ${
                                isSegmentStart ? "justify-start pl-3" : "justify-center"
                              } rounded-md ${barClass} text-sm font-bold shadow-sm ${
                                isSelectable ? "cursor-pointer hover:brightness-110" : "cursor-not-allowed opacity-90"
                              } ${isSelected ? "ring-4 ring-blue-500 ring-offset-1" : ""}`}
                            >
                              {isSegmentStart ? row.label : ""}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  
                  <p className="mt-6 text-sm font-medium text-slate-500">
                    Selected slots: <span className="text-slate-800">{selectedSlotsLabel || "none"}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleReserveFromPlanning}
                    className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 sm:w-auto"
                  >
                    Réserver les créneaux
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                  Cliquez sur "Confirm Reservation" en bas de page pour afficher le planning interactif.
                </p>
              )}
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
                  <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                    <MapPin size={12} />
                    Pick-up Location
                  </p>
                  <h4 className="mt-2 text-sm font-semibold text-slate-800">{agency}</h4>
                  <p className="text-xs text-slate-500">{city}</p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 size={12} />
                    Open 24/7
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Phone size={12} />
                    +49 30 1234 5678
                  </p>
                  <button
                    onClick={() => handleOpenMap(`${agency}, ${city}`)}
                    className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600"
                  >
                    View on Map
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-blue-500">
                    <Route size={12} />
                    Drop-off Location
                  </p>
                  <h4 className="mt-2 text-sm font-semibold text-slate-800">Berlin City Center - Alexanderplatz</h4>
                  <p className="text-xs text-slate-500">Karl-Liebknecht-Str. 5, 10178 Berlin, Germany</p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 size={12} />
                    08:00 - 20:00
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Phone size={12} />
                    +49 30 8765 4321
                  </p>
                  <button
                    onClick={() =>
                      handleOpenMap("Berlin City Center - Alexanderplatz, Berlin")
                    }
                    className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600"
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

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm">
            <p className="text-slate-600">
              Need to change your plans? Free cancellation available within 24h.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirm}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Confirm Reservation
              </button>
              <button
                onClick={handleCancel}
                className="rounded-md border border-rose-200 px-4 py-2 font-semibold text-rose-600 hover:bg-rose-50"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}