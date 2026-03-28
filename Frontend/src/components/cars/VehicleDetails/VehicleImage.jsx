export default function VehicleImage({ image }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <img
        src={image}
        alt="vehicle"
        className="w-full rounded-xl object-cover"
      />
    </div>
  );
}