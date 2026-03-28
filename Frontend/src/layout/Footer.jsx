import { Globe, Share2, CarFront } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <CarFront className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                ERPCarRental
              </h2>
            </div>

            <p className="mt-4 max-w-sm text-base leading-7 text-slate-400">
              The premium enterprise platform for luxury and electric vehicle
              rentals. Experience driving redefined.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-800">Support</h3>

            <ul className="mt-4 space-y-3 text-slate-400">
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Safety Information
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Cancellation Options
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-800">Corporate</h3>

            <ul className="mt-4 space-y-3 text-slate-400">
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Fleet Management
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Business Accounts
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-slate-600">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            © 2023 ERP Car Rental Systems. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <button className="transition hover:text-slate-600">
              <Globe className="h-5 w-5" />
            </button>
            <button className="transition hover:text-slate-600">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}