export default function VehicleSpecifications({ vehicle }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-slate-800">
        Spécifications
      </h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-400">Marque</p>
          <p className="font-semibold text-slate-800">{vehicle.brand}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Modèle</p>
          <p className="font-semibold text-slate-800">{vehicle.name}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Catégorie</p>
          <p className="font-semibold text-slate-800">{vehicle.category}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Kilométrage</p>
          <p className="font-semibold text-slate-800">{vehicle.kilometrage} km</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Immatriculation</p>
          <p className="font-semibold text-slate-800">{vehicle.immatriculation}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Agence</p>
          <p className="font-semibold text-slate-800">{vehicle.agency}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Ville</p>
          <p className="font-semibold text-slate-800">{vehicle.city}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Statut</p>
          <p className="font-semibold capitalize text-slate-800">{vehicle.status}</p>
        </div>
      </div>
    </div>
  );
}