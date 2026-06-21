import { Routes, Route } from "react-router-dom";
import StatementsDictionaryPage from "../features/dictionary/pages/StatementsDictionaryPage";
import NameCalculatorPage from "../features/numerology-calculator/pages/NameCalculatorPage";
import DateCalculatorPage from "../features/numerology-calculator/pages/DateCalculatorPage";
import SubmissionListPage from "../features/profiler/pages/SubmissionListPage";
import FpTestListPage from "../features/fptest/pages/FpTestListPage";
import DashboardHomePage from "../features/home/DashboardHomePage";
import ScoringDetailsPage from "../features/profiler/pages/ScoringDetailsPage";
import ScoringListPage from "../features/profiler/pages/ScoringListPage";
import LoginPage from "../auth/LoginPage";
import { ProtectedRoute } from "../auth/ProtectedRounte";
import LandingPage from "../features/LandingPage";
import UsersListPage from "../features/users/pages/UsersListPage";
import AccountPage from "../features/account/pages/AccountPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Root = smart landing */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN", "CALCULATOR_USER"]}
          >
            <LandingPage />
          </ProtectedRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <DashboardHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scoring-results"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <ScoringListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scoring-results/:testSubmissionPublicId"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <ScoringDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/submissions"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <SubmissionListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <FpTestListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dictionary"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <StatementsDictionaryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/calculators/names"
        element={
          <ProtectedRoute
            requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN", "CALCULATOR_USER"]}
          >
            <NameCalculatorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/calculators/dates"
        element={
          <ProtectedRoute
            requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN", "CALCULATOR_USER"]}
          >
            <DateCalculatorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <UsersListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute
            requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN", "CALCULATOR_USER"]}
          >
            <AccountPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div className="p-6">404</div>} />
    </Routes>
  );
}
