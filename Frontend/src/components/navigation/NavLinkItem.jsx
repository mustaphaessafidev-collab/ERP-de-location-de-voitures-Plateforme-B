import { useLocation, useNavigate } from "react-router-dom";
import { isRouteActive } from "../../helpers/routeHelpers";

export default function NavLinkItem({ to, label, activeMatch = "exact", icon: Icon }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = isRouteActive(pathname, to, activeMatch);

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`group relative inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        active ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
      }`}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden /> : null}
      <span>{label}</span>
      <span
        className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300 ease-out ${
          active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-40"
        }`}
        aria-hidden
      />
    </button>
  );
}
