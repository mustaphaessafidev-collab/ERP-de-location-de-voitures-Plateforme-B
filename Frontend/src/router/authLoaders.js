import { redirect } from "react-router-dom";

/** Must match `auth` storage keys in `services/auth.js`. */
const AUTH_TOKEN_KEY = "auth_token";

/** Where authenticated users are sent when they hit guest-only auth routes. */
const POST_AUTH_HOME = "/VehicleCatalogPage";

/**
 * Runs before login / register / validate-email render — blocks flash when already signed in.
 */
export function guestRouteLoader() {
  if (localStorage.getItem(AUTH_TOKEN_KEY)) {
    throw redirect(POST_AUTH_HOME);
  }
  return null;
}

/**
 * Runs before any private route renders — blocks flash of protected UI when signed out.
 */
export function privateRouteLoader({ request }) {
  if (localStorage.getItem(AUTH_TOKEN_KEY)) return null;
  const url = new URL(request.url);
  const next = `${url.pathname}${url.search}`;
  throw redirect(`/login?from=${encodeURIComponent(next)}`);
}
