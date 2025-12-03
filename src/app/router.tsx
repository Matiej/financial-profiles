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

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardHomePage />} />

      <Route path="/results" element={<ListPage />} />
      <Route path="/results/:submissionId" element={<DetailsPage />} />

      <Route path="/scoring-results" element={<ScoringListPage />} />
      <Route
        path="/scoring-results/:testSubmissionPublicId"
        element={<ScoringDetailsPage />}
      />
      
      <Route
        path="/results/:submissionId/analyses"
        element={<AnalysesListPage />}
      />

      <Route path="/submissions" element={<SubmissionListPage />} />

      <Route
        path="/submissions/:submissionId/analyses/:index"
        element={<AnalysisDetailsPage />}
      />
      <Route path="/tests" element={<FpTestListPage />} />
      <Route path="/dictionary" element={<StatementsDictionaryPage />} />
      <Route path="/calculators/names" element={<NameCalculatorPage />} />
      <Route path="/calculators/dates" element={<DateCalculatorPage />} />
      <Route path="*" element={<div className="p-6">404</div>} />
    </Routes>
  );
}
