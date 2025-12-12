import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import keycloak from "../keycloak";

import { setAuthToken } from "../lib/httpClient";

type AuthContextType = {
  initialized: boolean;
  authenticated: boolean;
  token: string | undefined;
  roles: string[];
  login: () => void;
  logout: () => void;
};

let keycloakInitStarted = false;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (keycloakInitStarted) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed = keycloak.tokenParsed as any | undefined;
      const realmRoles: string[] = parsed?.realm_access?.roles ?? [];

      setAuthenticated(!!keycloak.token);
      setToken(keycloak.token ?? undefined);
      setAuthToken(keycloak.token ?? undefined);
      setRoles(realmRoles);
      setInitialized(true);
      return;
    }

    keycloakInitStarted = true;
    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(!!auth);
        setToken(keycloak.token ?? undefined);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed = keycloak.tokenParsed as any | undefined;
        const realmRoles: string[] = parsed?.realm_access?.roles ?? [];

        setRoles(realmRoles);
        setInitialized(true);
        setAuthToken(keycloak.token ?? undefined);

        // prosty auto-refresh tokena co 20s
        const refreshInterval = setInterval(() => {
          keycloak
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed && keycloak.token) {
                setToken(keycloak.token);
                setAuthToken(keycloak.token ?? undefined);
              }
            })
            .catch(() => {
              setAuthenticated(false);
              setToken(undefined);
              setAuthToken(undefined);
            });
        }, 20000);

        return () => clearInterval(refreshInterval);
      })
      .catch((err) => {
        console.error("Keycloak init error", err);
        setInitialized(true);
      });
  }, []);

  const login = useCallback(() => {
    keycloak.login();
  }, []);

  const logout = useCallback(() => {
    // wyczyść FE
    setAuthenticated(false);
    setToken(undefined);
    setAuthToken(undefined);
    setRoles([]);

    keycloak.logout({
      redirectUri: window.location.origin,
    });
  }, []);

  const value: AuthContextType = {
    initialized,
    authenticated,
    token,
    roles,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
