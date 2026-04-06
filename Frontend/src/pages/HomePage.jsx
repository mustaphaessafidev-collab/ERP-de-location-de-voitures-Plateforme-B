import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShieldCheck, Headphones, CarFront } from "lucide-react";

import vehiclesData from "../fake-data/vehicules-api.json";

export default function HomePage() {
  const navigate = useNavigate();

  const popularVehicles = vehiclesData.data
    .filter((vehicle) => vehicle.statut === "disponible")
    .slice(0, 4);

  return (
    <main className="bg-slate-50 overflow-x-hidden">
      <section className="mx-auto mt-4 w-[94%] overflow-hidden rounded-2xl bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center shadow-lg sm:mt-6 sm:w-[92%] sm:rounded-3xl">
        <div className="bg-black/55 px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
          <div className="max-w-3xl text-white transition duration-700 ease-out animate-in fade-in slide-in-from-bottom-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-blue-200 sm:text-sm">
              Solution intelligente de location
            </p>

            <h1 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
              Location de voitures premium pour tous vos trajets
            </h1>

            <p className="mb-8 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base md:text-lg">
              Trouvez facilement le véhicule idéal pour vos déplacements
              personnels ou professionnels avec une expérience simple, rapide et
              moderne.
            </p>

          </div>
        </div>
      </section>

      <section className="mx-auto w-[94%] py-10 sm:w-[92%] sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Véhicules populaires
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Découvrez une sélection de véhicules disponibles
            </p>
          </div>

          <button
            onClick={() => navigate("/VehicleCatalogPage")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition duration-300 hover:bg-slate-100 sm:w-auto"
          >
            Voir tout
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {popularVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={vehicle.photo_url}
                  alt={`${vehicle.modele.marque.nom} ${vehicle.modele.nom}`}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                />
              </div>

              <div className="p-4 sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                      {vehicle.modele.marque.nom} {vehicle.modele.nom}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {vehicle.categorie.libelle}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {vehicle.prix_jour} DH / jour
                  </span>
                </div>


                <button
                  onClick={() => navigate(`/VehicleDetail/${vehicle.id}`)}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-[1.01] hover:bg-blue-700 active:scale-[0.98]"
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[94%] py-6 sm:w-[92%] sm:py-8">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Pourquoi choisir notre plateforme ?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Une expérience moderne, rapide et adaptée à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition duration-300 hover:scale-110">
              <CarFront size={22} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Large choix de véhicules
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              Berlines, SUV, véhicules électriques et modèles premium pour tous
              les usages.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition duration-300 hover:scale-110">
              <ShieldCheck size={22} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Réservation simple et sécurisée
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              Réservez rapidement votre véhicule avec un parcours clair et
              sécurisé.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition duration-300 hover:scale-110">
              <Headphones size={22} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Support client réactif
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              Notre équipe reste disponible pour vous accompagner avant, pendant
              et après la réservation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-[94%] py-10 sm:w-[92%] sm:py-12">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-10 text-center text-white shadow-lg sm:px-6 md:px-12 md:py-12">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            Prêt à réserver votre prochain véhicule ?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
            Consultez notre catalogue et choisissez la voiture qui correspond à
            vos besoins.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/reservation")}
              className="w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition duration-300 hover:scale-[1.03] hover:bg-slate-100 active:scale-[0.98] sm:w-auto"
            >
              Réserver maintenant
            </button>

            <button
              onClick={() => navigate("/VehicleCatalogPage")}
              className="w-full rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-[1.03] hover:bg-white/10 active:scale-[0.98] sm:w-auto"
            >
              Voir le catalogue
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}