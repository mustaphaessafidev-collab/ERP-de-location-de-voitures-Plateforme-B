import { Users, Settings, Fuel } from "lucide-react";

export default function VehicleInfo({ vehicle }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {vehicle.name}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-sm">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          <div>
            <p className="text-gray-400">Places</p>
            <p className="font-semibold">{vehicle.seats}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Settings size={20} className="text-blue-600" />
          <div>
            <p className="text-gray-400">Transmission</p>
            <p className="font-semibold">{vehicle.transmission}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Fuel size={20} className="text-blue-600" />
          <div>
            <p className="text-gray-400">Carburant</p>
            <p className="font-semibold">{vehicle.fuel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}