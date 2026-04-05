import { NAV_ROUTE_DEFS, PRIVATE_ROUTE_MATCHERS } from "../router/routesConfig";

/** Paths where the shell hides navbar/footer (guest auth flows). */
export const GUEST_ONLY_LAYOUT_PATHS = ["/login", "/register", "/validate-email"];

/**
 * @param {string} pathname
 */
export function isGuestOnlyLayoutPath(pathname) {
  return GUEST_ONLY_LAYOUT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/**
 * @param {string} pathname
 * @param {string} routePath
 * @param {'exact' | 'prefix'} [activeMatch='exact']
 */
export function isRouteActive(pathname, routePath, activeMatch = "exact") {
  if (activeMatch === "prefix") {
    return pathname === routePath || pathname.startsWith(`${routePath}/`);
  }
  return pathname === routePath;
}

/**
 * @param {object|null} user
 * @param {typeof NAV_ROUTE_DEFS} [routes=NAV_ROUTE_DEFS]
 */
export function getVisibleNavbarRoutes(user, routes = NAV_ROUTE_DEFS) {
  return routes.filter((r) => {
    if (!r.showInNavbar) return false;
    if (r.isPrivate && !user) return false;
    return true;
  });
}

/**
 * @param {string} pathname
 */
export function isPrivateRoute(pathname) {
  return PRIVATE_ROUTE_MATCHERS.some((matcher) => matcher(pathname));
}

/**
 * Normalizes route objects for createBrowserRouter (shallow; supports children).
 * @param {Array<{ path?: string; index?: boolean; element: import('react').ReactNode; children?: unknown[]; loader?: import('react-router-dom').LoaderFunction; id?: string }>} routeObjects
 */
export function mapRoutesToRouter(routeObjects) {
  return routeObjects.map(({ path, index, element, children, loader, id }) => ({
    ...(path != null ? { path } : {}),
    ...(index ? { index: true } : {}),
    ...(loader != null ? { loader } : {}),
    ...(id != null ? { id } : {}),
    element,
    ...(children?.length ? { children: mapRoutesToRouter(children) } : {}),
  }));
}
