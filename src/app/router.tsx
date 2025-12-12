import { Routes, Route } from "react-router-dom";
import ListPage from "../features/profiler/pages/ListPage";
import DetailsPage from "../features/profiler/pages/DetailsPage";
import AnalysesListPage from "../features/analyses/pages/AnalysesListPage";
import AnalysisDetailsPage from "../features/analyses/pages/AnalysesDetailsPage";
import StatementsDictionaryPage from "../features/dictionary/pages/StatementsDictionaryPage";
import NameCalculatorPage from "../features/numerology-calculator/pages/NameCalculatorPage";
import DateCalculatorPage from "../features/numerology-calculator/pages/DateCalculatorPage";
import SubmissionListPage from "../features/profiler/pages/SubmissionListPage";
import FpTestListPage from "../features/fptest/pages/FpTestListPage";
import DashboardHomePage from "../features/home/DashboardHomePage";
import ScoringDetailsPage from "../features/profiler/pages/ScoringDetailsPage";
import ScoringListPage from "../features/profiler/pages/ScoringListPage";
import LoginPage from "../auth/LoginPage";
import { ProtectedRoute } from "../ProtectedRounte";
import LandingPage from "../features/LandingPage";

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
        path="/"
        element={
          <ProtectedRoute
            requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN", "CALCULATOR_USER"]}
          >
            <DashboardHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <ListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/:submissionId"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <DetailsPage />
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
        path="/results/:submissionId/analyses"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <AnalysesListPage />
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
        path="/submissions/:submissionId/analyses/:index"
        element={
          <ProtectedRoute requiredRoles={["BUSINESS_ADMIN", "TECH_ADMIN"]}>
            <AnalysisDetailsPage />
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

      <Route path="*" element={<div className="p-6">404</div>} />
    </Routes>
  );
}
