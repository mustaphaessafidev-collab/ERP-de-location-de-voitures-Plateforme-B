import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "../../context/useAuth";

const NAV_ICONS = { User, Settings };

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const displayName = user?.nom_complet || user?.name || "Compte";
  const email = user?.email || "";

  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-sm transition hover:border-slate-300"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="menu"
        >
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
            {email ? <p className="truncate text-xs text-slate-500">{email}</p> : null}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
          >
            <NAV_ICONS.User className="h-4 w-4 shrink-0 text-slate-400" />
            Profil
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
            className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
          >
            <NAV_ICONS.Settings className="h-4 w-4 shrink-0 text-slate-400" />
            Paramètres
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-inset"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      ) : null}
    </div>
  );
}
