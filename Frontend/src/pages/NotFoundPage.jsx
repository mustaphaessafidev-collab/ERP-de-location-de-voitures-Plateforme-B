import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="select-none flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-20 text-center">
      <p
        className=" text-8xl font-bold tracking-tight text-slate-200 sm:text-9xl"
        aria-hidden
      >
        404
      </p>
      <h1 className="-mt-8 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Page introuvable
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        L'adresse que vous avez saisie n'existe pas ou a été déplacée. Vérifiez
        l’URL ou retournez au catalogue.
      </p>
      <button 
        type="button"
        onClick={() => navigate("/VehicleCatalogPage")}     
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <Home className="h-4 w-4 shrink-0" aria-hidden />
        Retour au catalogue
      </button>
    </div>
  );
}
