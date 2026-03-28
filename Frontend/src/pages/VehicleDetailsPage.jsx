import { useParams } from "react-router-dom";
import vehiclesDB from "../fake-data/vehicules-api.json";
import VehicleImage from "../components/cars/VehicleDetails/VehicleImage";
import VehicleInfo from "../components/cars/VehicleDetails/VehicleInfo";
import VehicleSpecifications from "../components/cars/VehicleDetails/VehicleSpecifications";
import BookingCard from "../components/cars/VehicleDetails/BookingCard";
import RelatedVehicles from "../components/cars/VehicleDetails/RelatedVehicles";
import Navbar from "../layout/Navbar";

export default function VehicleDetails() {
  const { id } = useParams();

  const vehicles = vehiclesDB.data.map((vehicule) => ({
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

  const vehicle = vehicles.find((v) => v.id === Number(id));

  if (!vehicle) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center text-lg font-semibold text-slate-700">
          Véhicule introuvable
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="bg-slate-100 px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 text-xs text-slate-400">
            Home / Luxury Sedans /{" "}
            <span className="text-slate-600">{vehicle.name}</span>
          </div>

          <h1 className="mb-6 text-xl font-bold text-slate-800 md:text-2xl">
            Vehicle Details & Booking
          </h1>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <VehicleImage image={vehicle.image} />
              <VehicleInfo vehicle={vehicle} />
              <VehicleSpecifications vehicle={vehicle} />
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <BookingCard vehicle={vehicle} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <RelatedVehicles currentVehicle={vehicle} />
          </div>
        </div>
      </section>
    </>
  );
}