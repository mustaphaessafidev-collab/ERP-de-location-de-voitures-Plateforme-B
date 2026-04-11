import { CheckCircle, AlertTriangle } from "lucide-react";

export default function RentalConditions() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      
      <h3 className="mb-4 text-lg font-semibold text-slate-800">
        Résumé des conditions de location
      </h3>

      <div className="space-y-3 text-sm text-slate-600">

        <div className="flex items-start gap-2">
          <CheckCircle className="text-green-500 mt-0.5" size={18} />
          <p>Annulation gratuite jusqu’à 48 heures avant la prise en charge.</p>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle className="text-green-500 mt-0.5" size={18} />
          <p>Kilométrage illimité inclus pour les locations locales.</p>
        </div>

        <div className="flex items-start gap-2">
          <AlertTriangle className="text-yellow-500 mt-0.5" size={18} />
          <p>
            Âge minimum du conducteur : 25 ans (des frais peuvent s'appliquer
            pour les conducteurs de 21 à 24 ans).
          </p>
        </div>

       

      </div>

    </div>
  );
}