import { useEffect, useRef } from "react";
import { X, CheckCheck, Trash2, Bell, CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  return `Il y a ${Math.floor(diff / 86400)} j`;
}

export default function NotificationPanel({ onClose }) {
  const { notifications, unreadCount, loading, markOneRead, markAllRead, removeOne, clearAll } =
    useNotifications();
  const panelRef = useRef(null);

  // Fermer si clic à l'extérieur
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl"
      style={{ animation: "slideDown 0.2s ease" }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-800">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              title="Tout marquer comme lu"
              className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800"
            >
              <CheckCheck size={13} />
              Tout lire
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              title="Tout effacer"
              className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-500"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-400">
            Chargement…
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400">
            <Bell size={28} className="opacity-30" />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((notif) => {
              const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.info;
              const Icon = cfg.icon;
              return (
                <li
                  key={notif.id}
                  className={`relative flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
                    !notif.isRead ? "bg-blue-50/40" : ""
                  }`}
                >
                  {/* Indicateur non-lu */}
                  {!notif.isRead && (
                    <span className={`absolute left-1 top-4 h-2 w-2 rounded-full ${cfg.dot}`} />
                  )}

                  {/* Icône */}
                  <div className={`mt-0.5 flex-shrink-0 rounded-full p-1.5 ${cfg.bg}`}>
                    <Icon size={14} className={cfg.color} />
                  </div>

                  {/* Contenu */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                      {notif.message}
                    </p>
                    {notif.reservationId && (
                      <p className="mt-1 text-[10px] font-mono text-slate-400">
                        {notif.reservationId}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-slate-400">{timeAgo(notif.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 flex-col gap-1">
                    {!notif.isRead && (
                      <button
                        onClick={() => markOneRead(notif.id)}
                        title="Marquer comme lu"
                        className="rounded p-1 text-slate-300 hover:text-blue-500"
                      >
                        <CheckCheck size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => removeOne(notif.id)}
                      title="Supprimer"
                      className="rounded p-1 text-slate-300 hover:text-rose-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
