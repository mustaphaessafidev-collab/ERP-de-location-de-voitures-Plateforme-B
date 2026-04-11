import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

export default function BookingCard({ vehicle }) {
  const navigate = useNavigate();

  const [pickUpDate, setPickUpDate] = useState("");
  const [pickUpTime, setPickUpTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");
  const [childSeat, setChildSeat] = useState(false);
  const [insurance, setInsurance] = useState(false);

  const numberDays = useMemo(() => {
    if (!pickUpDate || !returnDate) return 0;

    const start = new Date(pickUpDate);
    const end = new Date(returnDate);

    const diffMs = end - start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }, [pickUpDate, returnDate]);

  const basePrice = vehicle.pricePerDay * numberDays;
  const serviceFee = numberDays > 0 ? 18.5 : 0;
  const taxes = numberDays > 0 ? 12.4 : 0;
  const childPrice = childSeat ? 10 * numberDays : 0;
  const insurancePrice = insurance ? 25 * numberDays : 0;
  const totalPrice =
    basePrice + serviceFee + taxes + childPrice + insurancePrice;

  const handleContinue = () => {
    if (!pickUpDate || !returnDate) {
      alert("Veuillez sélectionner les dates.");
      return;
    }

    if (numberDays <= 0) {
      alert("La date de retour doit être après la date de prise en charge.");
      return;
    }

    const bookingData = {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleImage: vehicle.image,
      agency: vehicle.agency,
      city: vehicle.city,
      pickUpDate,
      pickUpTime,
      returnDate,
      returnTime,
      numberDays,
      childSeat,
      insurance,
      basePrice,
      serviceFee,
      taxes,
      childPrice,
      insurancePrice,
      totalPrice,
    };

    navigate("/booking-review", {
      state: bookingData,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold text-slate-900">
            {vehicle.pricePerDay} DH
            <span className="ml-1 text-sm font-normal text-slate-400">
              / day
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Lieu de prise en charge
          </label>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <MapPin size={16} className="text-slate-400" />
            <input
              type="text"
              value={`${vehicle.agency} - ${vehicle.city}`}
              readOnly
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 grid grid-cols-2 gap-3">
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Date de prise en charge
            </label>
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Heure
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none"
              value={pickUpDate}
              onChange={(e) => setPickUpDate(e.target.value)}
            />

            <input
              type="time"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none"
              value={pickUpTime}
              onChange={(e) => setPickUpTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 grid grid-cols-2 gap-3">
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Date de retour
            </label>
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Heure
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />

            <input
              type="time"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Options supplémentaires
          </label>

          <div className="space-y-2">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={insurance}
                  onChange={(e) => setInsurance(e.target.checked)}
                />
                <span className="text-sm text-slate-700">
                  Assurance complète
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700">
                + 25 DH/day
              </span>
            </label>

            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={childSeat}
                  onChange={(e) => setChildSeat(e.target.checked)}
                />
                <span className="text-sm text-slate-700">Siège enfant</span>
              </div>
              <span className="text-sm font-medium text-slate-700">
                + 10 DH/day
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span>
              {vehicle.pricePerDay} DH x {numberDays} jours
            </span>
            <span className="font-medium text-slate-800">
              {basePrice.toFixed(2)} DH
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span>Frais de service</span>
            <span className="font-medium text-slate-800">
              {serviceFee.toFixed(2)} DH
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span>Taxes</span>
            <span className="font-medium text-slate-800">
              {taxes.toFixed(2)} DH
            </span>
          </div>

          {insurance && (
            <div className="flex items-center justify-between text-slate-500">
              <span>Assurance complète</span>
              <span className="font-medium text-slate-800">
                {insurancePrice.toFixed(2)} DH
              </span>
            </div>
          )}

          {childSeat && (
            <div className="flex items-center justify-between text-slate-500">
              <span>Siège enfant</span>
              <span className="font-medium text-slate-800">
                {childPrice.toFixed(2)} DH
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-2xl font-bold text-slate-900">Prix total</span>
          <span className="text-3xl font-bold text-blue-600">
            {totalPrice.toFixed(2)} DH
          </span>
        </div>

        <button
          onClick={handleContinue}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Confirmer la réservation
          <ArrowRight size={18} />
        </button>

        <p className="text-center text-[10px] leading-4 text-slate-400">
          En confirmant, vous acceptez les conditions de location et la
          politique d'annulation.
        </p>
      </div>
    </div>
  );
}
