import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { getVisibleNavbarRoutes } from "../../helpers/routeHelpers";
import { NAVBAR_ICON_MAP } from "../../router/navbarIcons";
import { NAV_ROUTE_DEFS } from "../../router/routesConfig";
import AppIcon from "../AppIcon";
import NavLinkItem from "./NavLinkItem";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useAuth();
  const visible = getVisibleNavbarRoutes(user, NAV_ROUTE_DEFS);

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <AppIcon />

          <div className="hidden items-center gap-6 md:flex">
            {visible.map((route) => (
              <NavLinkItem
                key={route.path}
                to={route.path}
                label={route.label}
                activeMatch={route.activeMatch}
                icon={NAVBAR_ICON_MAP[route.icon]}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="text-slate-400 transition hover:text-slate-600"
                aria-label="Notifications"
                onClick={() => navigate("/notifications")}
              >
                <Bell size={20} />
              </button>
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm font-medium">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className={`relative cursor-pointer border-0 bg-transparent p-0 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  pathname === "/login" ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Connexion
                <span
                  className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300 ${
                    pathname === "/login" ? "w-full" : "w-0"
                  }`}
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="cursor-pointer rounded-md border-0 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Inscription
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
