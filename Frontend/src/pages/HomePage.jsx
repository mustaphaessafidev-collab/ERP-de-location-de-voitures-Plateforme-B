import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Headphones,
  CarFront,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import vehiclesData from "../fake-data/vehicules-api.json";

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1400&q=80",
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1
    );
  };

  const popularVehicles = vehiclesData.data
    .filter((vehicle) => vehicle.statut === "disponible")
    .slice(0, 4);

  return (
    <main className="bg-slate-50 overflow-x-hidden">
      {/* HERO CAROUSEL */}
      <section className="mx-auto mt-4 w-[94%] sm:mt-6 sm:w-[92%]">
        <div className="relative h-[320px] overflow-hidden rounded-2xl shadow-xl md:h-[400px]">
          {heroImages.map((image, index) => (
            <motion.div
              key={image}
              initial={false}
              animate={{ opacity: currentSlide === index ? 1 : 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}

          <div className="absolute inset-0 bg-black/35" />

          <div className="relative z-10 flex h-full items-center px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl text-white"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-200 sm:text-xs">
                Solution intelligente de location
              </p>

              <h1 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
                Location de voitures premium pour tous vos trajets
              </h1>

              <p className="mb-6 max-w-xl text-sm leading-6 text-slate-100 sm:text-base">
                Trouvez facilement le véhicule idéal pour vos déplacements
                personnels ou professionnels avec une expérience simple, rapide
                et moderne.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/reservation")}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-blue-700"
                >
                  Réserver maintenant
                </button>
                <button
                  onClick={() => navigate("/VehicleCatalogPage")}
                  className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Voir le catalogue
                </button>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR VEHICLES */}
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Voir tout
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {popularVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
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

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {vehicle.prix_jour} DH / jour
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/VehicleDetail/${vehicle.id}`)}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Voir les détails
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto w-[94%] py-6 sm:w-[92%] sm:py-8">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Pourquoi choisir notre plateforme ?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: <CarFront size={22} />,
              title: "Large choix de véhicules",
              desc: "Berlines, SUV, électriques et premium.",
            },
            {
              icon: <ShieldCheck size={22} />,
              title: "Réservation simple et sécurisée",
              desc: "Un parcours fluide et sécurisé.",
            },
            {
              icon: <Headphones size={22} />,
              title: "Support client réactif",
              desc: "Disponible avant et après réservation.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 hover:shadow-lg"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                {item.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
