export default function Filters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  maxPrice,
  setMaxPrice,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Filtres</h2>

        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => {
            setSelectedCategory("Tous les véhicules");
            setSelectedBrand("Toutes les marques");
            setMaxPrice(450);
          }}
        >
          Réinitialiser
        </button>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Catégorie
        </p>

        <div className="space-y-2 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "Tous les véhicules"}
              onChange={() => setSelectedCategory("Tous les véhicules")}
            />
            Tous les véhicules
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "SUV"}
              onChange={() => setSelectedCategory("SUV")}
            />
            SUV
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "Berline"}
              onChange={() => setSelectedCategory("Berline")}
            />
            Berline
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "Luxe"}
              onChange={() => setSelectedCategory("Luxe")}
            />
            Luxe
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "Électrique"}
              onChange={() => setSelectedCategory("Électrique")}
            />
            Électrique
          </label>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Prix / Jour
          </p>

          <span className="text-sm font-semibold text-blue-600">
            0€ - {maxPrice}€
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="450"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Marque
        </p>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full rounded-lg border border-slate-200 p-2 text-sm"
        >
          <option>Toutes les marques</option>
          <option>TESLA</option>
          <option>BMW</option>
          <option>AUDI</option>
          <option>MERCEDES</option>
          <option>TOYOTA</option>
          <option>VOLKSWAGEN</option>
        </select>
      </div>
    </div>
  );
}