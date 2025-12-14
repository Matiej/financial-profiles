import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
  requiredRoles?: string[];
};

export function ProtectedRoute({ children, requiredRoles }: Props) {
  const { initialized, authenticated, roles } = useAuth();

  if (!initialized) {
    return <div className="p-6">Ładowanie...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.some((r) => roles.includes(r))) {
    // 403 – można zrobić ładną stronę „brak dostępu”
    return <div className="p-6">Brak dostępu do tej sekcji.</div>;
  }

  return children;
}
