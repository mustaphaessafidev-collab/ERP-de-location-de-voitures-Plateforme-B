/**
 * Single source of truth for nav-visible routes: path, label, visibility, auth, active matching, icon key.
 * Icon keys map to `NAVBAR_ICON_MAP` in `navbarIcons.js`.
 */
export const NAV_ROUTE_DEFS = [
  {
    path: "/VehicleCatalogPage",
    label: "Véhicules",
    isPrivate: false,
    showInNavbar: true,
    activeMatch: "exact",
    icon: "Car",
  },
  {
    path: "/dashboard",
    label: "Tableau de bord",
    isPrivate: true,
    showInNavbar: true,
    activeMatch: "prefix",
    icon: "LayoutDashboard",
  },
  {
    path: "/bookings",
    label: "Réservations",
    isPrivate: true,
    showInNavbar: true,
    activeMatch: "prefix",
    icon: "Calendar",
  },

  {
    path: "/booking-review",
    label: "Réservation en cours",
    isPrivate: true,
    showInNavbar: true,
    activeMatch: "prefix",
    icon: "CircleDashed",
  },

];

/** Used by isPrivateRoute — any path matching these is treated as private. */
export const PRIVATE_ROUTE_MATCHERS = [
  (pathname) => pathname.startsWith("/dashboard"),
  (pathname) => pathname.startsWith("/bookings"),
  (pathname) => pathname.startsWith("/profile"),
  (pathname) => pathname.startsWith("/settings"),
  (pathname) => pathname === "/reservation" || pathname.startsWith("/reservation/"),
  (pathname) => pathname === "/booking-review" || pathname.startsWith("/booking-review/"),
  (pathname) => pathname === "/test" || pathname.startsWith("/test/"),
];
