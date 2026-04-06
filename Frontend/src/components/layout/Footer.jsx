import { Globe, Share2 } from "lucide-react";
import AppIcon from "../AppIcon";

const BRAND = "DriveEase ERP";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <AppIcon />
            </div>

            <p className="mt-4 max-w-sm text-base leading-7 text-slate-400">
              Plateforme ERP pour la location de véhicules : flotte, réservations et suivi
              client au même endroit.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-800">Assistance</h3>
            <ul className="mt-4 space-y-3 text-slate-400">
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Centre d&apos;aide
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Sécurité &amp; confiance
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Annulation &amp; remboursement
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-800">Entreprise</h3>
            <ul className="mt-4 space-y-3 text-slate-400">
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Gestion de flotte
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Comptes professionnels
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {BRAND}. Tous droits réservés.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              type="button"
              className="transition hover:text-slate-600"
              aria-label="Langue"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="transition hover:text-slate-600"
              aria-label="Partager"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
