import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({
  children,
  requiredRoles,
}: {
  children: React.ReactNode;
  requiredRoles: string[];
}) {
  const { initialized, authenticated, roles } = useAuth();

  // 1) Auth jeszcze się ładuje -> pokaż coś, nigdy null
  if (!initialized) {
    return (
      <div className="p-6 text-brand-ink">
        Ładowanie...
      </div>
    );
  }

  // 2) Niezalogowany -> idź na login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3) Brak ról -> pokaż komunikat (żeby nie było białej strony)
  const hasRole = requiredRoles.some((r) => (roles ?? []).includes(r));
  if (!hasRole) {
    return (
      <div className="p-6 text-brand-ink">
        Brak uprawnień do tej sekcji.
      </div>
    );
  }

  return <>{children}</>;
}
