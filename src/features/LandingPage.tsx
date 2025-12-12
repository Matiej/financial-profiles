import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function LandingPage() {
  const { roles } = useAuth();

  const isAdmin = roles.includes("BUSINESS_ADMIN") || roles.includes("TECH_ADMIN");
  const isCalcOnly = roles.includes("CALCULATOR_USER") && !isAdmin;

  if (isAdmin) return <Navigate to="/dashboard" replace />;
  if (isCalcOnly) return <Navigate to="/calculators/names" replace />;
 
  return <div className="p-6">Brak przypisanych uprawnień.</div>;
}
