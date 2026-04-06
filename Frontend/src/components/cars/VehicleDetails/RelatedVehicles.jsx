import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Fuel, ArrowRight } from "lucide-react";
import vehiclesDB from "../../../fake-data/vehicules-api.json";

export default function RelatedVehicles({ currentVehicle }) {
  const navigate = useNavigate();

  const vehicles = useMemo(() => {
    return vehiclesDB.data.map((vehicule) => ({
      id: vehicule.id,
      brand: vehicule.modele.marque.nom,
      name: vehicule.modele.nom,
      fuel: vehicule.carburant,
      category: vehicule.categorie.libelle,
      transmission: vehicule.transmission,
      seats: vehicule.places,
      pricePerDay: vehicule.prix_jour,
      image: vehicule.photo_url,
      isFavorite: vehicule.favori,
      status: vehicule.statut,
      kilometrage: vehicule.kilometrage,
      immatriculation: vehicule.immatriculation,
      agency: vehicule.agence.nom,
      city: vehicule.agence.ville,
    }));
  }, []);

  const relatedVehicles = useMemo(() => {
    return vehicles
      .filter(
        (vehicle) =>
          vehicle.id !== currentVehicle.id &&
          vehicle.category === currentVehicle.category
      )
      .slice(0, 4);
  }, [vehicles, currentVehicle]);

  if (!relatedVehicles.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Vous pourriez aussi aimer
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Véhicules similaires dans la même catégorie
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/VehicleCatalogPage", {
              state: {
                selectedCategory: currentVehicle.category,
              },
            })
          }
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Voir tout
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {relatedVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="h-56 w-full overflow-hidden bg-slate-100">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-4 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {vehicle.category}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-800">
                  {vehicle.name}
                </h3>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{vehicle.seats}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Fuel size={16} />
                  <span>{vehicle.fuel}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <p className="text-3xl font-bold text-slate-900">
                  {vehicle.pricePerDay}
                  <span className="ml-1 text-sm font-normal text-slate-400">
                    DH/jour
                  </span>
                </p>

                <button
                  onClick={() => navigate(`/VehicleDetail/${vehicle.id}`)}
                  className="rounded-full p-2 text-blue-600 transition hover:bg-blue-50"
                >
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}