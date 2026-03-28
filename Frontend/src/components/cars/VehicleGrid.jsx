import VehicleCard from "./VehicleCard";

export default function VehicleGrid({ vehicles }) {
  if (!vehicles.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Aucun véhicule trouvé.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </section>
  );
}