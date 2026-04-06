import { useEffect } from "react";
import { useParams } from "react-router-dom";
import vehiclesDB from "../fake-data/vehicules-api.json";
import VehicleImage from "../components/cars/VehicleDetails/VehicleImage";
import VehicleInfo from "../components/cars/VehicleDetails/VehicleInfo";
import VehicleSpecifications from "../components/cars/VehicleDetails/VehicleSpecifications";
import RentalConditions from "../components/cars/VehicleDetails/RentalConditions";
import BookingCard from "../components/cars/VehicleDetails/BookingCard";



export default function VehicleDetails() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
    return <div>Véhicule introuvable</div>;
  }

  return (
    <>

      <section className="bg-slate-50 px-4 py-6 md:px-5 lg:px-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <VehicleImage image={vehicle.image} />
              <VehicleInfo vehicle={vehicle} />
              <VehicleSpecifications vehicle={vehicle} />
              <RentalConditions/>

            </div>
            <div className="lg:col-span-1">
              <BookingCard vehicle={vehicle} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}