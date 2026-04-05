import { Clock3, FileText, MapPin, Phone, Route, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

export default function Reservation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const bookingData = state?.bookingData ?? state;
  const [reservationStatus, setReservationStatus] = useState("Confirmed");
  const [showPickUpPlanning, setShowPickUpPlanning] = useState(false);
  const [selectedPlanningSlots, setSelectedPlanningSlots] = useState([]);

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
  const planningDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const planningDates = [29, 30, 1, 2, 3, 4, 5];
  const planningRows = [
    {
      label: "Haute saison : 120€/jour",
      color: "bg-emerald-600",
      textColor: "text-white",
      segments: [
        { start: 0, span: 5 },
        { start: 5, span: 1, note: "Fermé", noteColor: "bg-rose-100 text-rose-700" },
        { start: 6, span: 1, note: "Fermé", noteColor: "bg-rose-100 text-rose-700" },
      ],
    },
    {
      label: "Non disponible",
      color: "bg-rose-600",
      textColor: "text-white",
      segments: [{ start: 0, span: 7 }],
    },
    {
      label: "Haute saison : 120€/jour",
      color: "bg-emerald-600",
      textColor: "text-white",
      segments: [
        { start: 0, span: 5 },
        { start: 5, span: 1, note: "Fermé", noteColor: "bg-rose-100 text-rose-700" },
        { start: 6, span: 1, note: "Fermé", noteColor: "bg-rose-100 text-rose-700" },
      ],
    },
  ];
  const selectedSlotsLabel = selectedPlanningSlots
    .map((slot) => `${planningDays[slot.day]} ${planningDates[slot.day]}`)
    .join(", ");

  const handlePrint = () => window.print();

  const handleModify = () => {
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

  const handleDownloadDocument = (name, status) => {
    if (status === "generating") return;
    downloadPdf({
      filename: `${name}-${reservationId.replace("#", "")}.pdf`,
      title: name.replaceAll("_", " "),
      lines: [
        `Reservation: ${reservationId}`,
        `Vehicle: ${vehicleName}`,
        `Customer document status: ${status}`,
        `Generated: ${new Date().toLocaleString()}`,
      ],
    });
  };

  const togglePlanningSlot = (rowIndex, dayIndex) => {
    const row = planningRows[rowIndex];
    if (!row || row.color !== "bg-emerald-600") return;

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
  };
  const handleCancel = () => setReservationStatus("Cancelled");

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
                {showPickUpPlanning ? (
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="mb-2 text-sm font-semibold text-red-500">Mai 2026</p>
                    <div className="grid grid-cols-7 overflow-hidden rounded-md border border-slate-200 text-center text-xs text-slate-500">
                      {planningDays.map((d) => (
                        <div key={d} className="border-r border-slate-200 bg-slate-50 py-2 font-semibold last:border-r-0">
                          {d}
                        </div>
                      ))}
                      {planningDates.map((d) => (
                        <div key={d} className="border-r border-t border-slate-200 py-2 text-slate-700 last:border-r-0">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2">
                      {planningRows.map((row, rowIndex) => (
                        <div key={`${row.label}-${rowIndex}`} className="grid grid-cols-7 gap-1.5">
                          {Array.from({ length: 7 }).map((_, idx) => {
                            const segment = row.segments.find(
                              (seg) => idx >= seg.start && idx < seg.start + seg.span
                            );

                            if (!segment) {
                              return <div key={idx} className="h-8 rounded-sm bg-slate-100" />;
                            }

                            if (segment.note) {
                              return (
                                <div
                                  key={idx}
                                  className={`flex h-8 items-center justify-center rounded-sm text-[11px] font-semibold ${segment.noteColor}`}
                                >
                                  {segment.note}
                                </div>
                              );
                            }

                            const isSegmentStart = idx === segment.start;
                            const isSelectable = row.color === "bg-emerald-600";
                            const isSelected = selectedPlanningSlots.some(
                              (slot) => slot.row === rowIndex && slot.day === idx
                            );

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => togglePlanningSlot(rowIndex, idx)}
                                className={`flex h-8 items-center ${
                                  isSegmentStart ? "justify-start pl-1" : "justify-center"
                                } rounded-sm ${row.color} ${row.textColor} text-[11px] font-semibold ${
                                  isSelectable ? "cursor-pointer" : "cursor-not-allowed"
                                } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                              >
                                {isSegmentStart ? row.label : ""}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Selected slots: {selectedSlotsLabel || "none"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-[10px] text-slate-400">
                    Click "Confirm Reservation" to open the selectable planning table.
                  </p>
                )}
              </div>
              <div className="relative">
                <div className="mb-3 h-3 w-3 rounded-full border border-slate-300 bg-white" />
                <p className="text-xs font-semibold text-slate-400">Return Scheduled</p>
                <p className="text-[11px] text-slate-400">{returnFormatted}</p>
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

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-800">Documents</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleDownloadDocument("Rental_Agreement", "signed")}
                    className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-red-500" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Rental_Agreem...</p>
                        <p className="text-[10px] text-slate-400">1.2 MB - Signed</p>
                      </div>
                    </div>
                    <Download size={14} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDownloadDocument("Inspection_Report", "generating")}
                    className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-red-500" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Inspection_Rep...</p>
                        <p className="text-[10px] text-slate-400">- MB - Generating...</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300" />
                  </button>
                </div>
                <p className="mt-3 text-[10px] text-slate-400">
                  * Inspection report will be available after the vehicle pick-up is finalized at the counter.
                </p>
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
                className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
              >
                Confirm Reservation
              </button>
              <button
                onClick={handleCancel}
                className="rounded-md border border-rose-200 px-4 py-2 font-semibold text-rose-600"
              >
                Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      </section>
  );
}