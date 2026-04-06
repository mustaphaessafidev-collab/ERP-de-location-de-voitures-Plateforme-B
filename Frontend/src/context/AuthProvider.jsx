import { useCallback, useMemo, useState } from "react";
import { authService } from "../services/auth";
import { AuthContext } from "./authContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));

  const refreshAuth = useCallback(() => {
    setUser(authService.getCurrentUser());
    setToken(localStorage.getItem("auth_token"));
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    refreshAuth();
  }, [refreshAuth]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(token),
      refreshAuth,
      logout,
    }),
    [user, token, refreshAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
