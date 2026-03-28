export default function Header({ total }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-slate-800">
          Catalogue des véhicules
        </h1>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
          {total} résultat{total > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">Trier par :</span>

        <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
          ☐
        </button>

        <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
          ☰
        </button>
      </div>
    </div>
  );
}