import { Link, useLocation } from "react-router-dom";

export default function ReservationSuccessPage() {
  const { state } = useLocation();
  const reservationId = state?.reservationId ?? "—";
  const vehicleName = state?.vehicleName ?? "";

  return (
    <>
      <section className="min-h-[calc(100vh-64px)] bg-slate-100 px-4 py-12 md:px-6">
        <div className="mx-auto max-w-lg rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            ✓
          </div>
          <h1 className="text-xl font-bold text-slate-800">Réservation confirmée</h1>
          <p className="mt-2 text-sm text-slate-600">
            Votre demande a bien été enregistrée pour cette session.
          </p>
          <p className="mt-4 font-mono text-sm font-semibold text-slate-800">{reservationId}</p>
          {vehicleName ? (
            <p className="mt-1 text-sm text-slate-500">{vehicleName}</p>
          ) : null}
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              to="/VehicleCatalogPage"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Retour au catalogue
            </Link>
            <Link
              to="/booking-review"
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              Autre réservation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
