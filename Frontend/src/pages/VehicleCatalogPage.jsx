import { useMemo, useState } from "react";
import Filters from "../components/cars/Filters";
import Header from "../components/cars/Header";
import Pagination from "../components/cars/Pagination";
import VehicleGrid from "../components/cars/VehicleGrid";
import vehiclesDB from "../fake-data/vehicules-api.json";

export default function VehicleCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous les véhicules");
  const [selectedBrand, setSelectedBrand] = useState("Toutes les marques");
  const [maxPrice, setMaxPrice] = useState(450);
  const [currentPage, setCurrentPage] = useState(1);

  const carsPerPage = 6;

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

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchCategory =
        selectedCategory === "Tous les véhicules" ||
        vehicle.category === selectedCategory;

      const matchBrand =
        selectedBrand === "Toutes les marques" ||
        vehicle.brand === selectedBrand;

      const matchPrice = vehicle.pricePerDay <= maxPrice;

      return matchCategory && matchBrand && matchPrice;
    });
  }, [vehicles, selectedCategory, selectedBrand, maxPrice]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredVehicles.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;

  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  return (
    <div className="flex-1 bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="w-full flex-shrink-0 lg:w-[250px] xl:w-[270px]">
          <Filters
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            selectedBrand={selectedBrand}
            setSelectedBrand={handleBrandChange}
            maxPrice={maxPrice}
            setMaxPrice={handleMaxPriceChange}
          />
        </aside>

        <main className="flex-1">
          <div className="flex flex-col gap-6">
            <Header total={filteredVehicles.length} />

            <VehicleGrid vehicles={paginatedVehicles} />

            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </main>
      </div>
    </div>
  );
}