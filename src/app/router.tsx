import { Routes, Route, Navigate } from "react-router-dom";
import ListPage from "../features/profiler/pages/ListPage";
import DetailsPage from "../features/profiler/pages/DetailsPage";
import AnalysesListPage from "../features/analyses/pages/AnalysesListPage";
import AnalysisDetailsPage from "../features/analyses/pages/AnalysesDetailsPage";
import StatementsDictionaryPage from "../features/dictionary/pages/StatementsDictionaryPage";
import NameCalculatorPage from "../features/numerology-calculator/pages/NameCalculatorPage";
import DateCalculatorPage from "../features/numerology-calculator/pages/DateCalculatorPage";
import SubmissionDetailPage from "../features/profiler/pages/SubmissionDetailPage";
import SubmissionListPage from "../features/profiler/pages/SubmissionListPage";
import FpTestListPage from "../features/fptest/pages/FpTestListPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/submissions" replace />} />

      <Route path="/results" element={<ListPage />} />
      <Route path="/results/:submissionId" element={<DetailsPage />} />
      <Route
        path="/results/:submissionId/analyses"
        element={<AnalysesListPage />}
      />

      <Route path="/submissions" element={<SubmissionListPage />} />
      <Route
        path="/submissions/:submissionId"
        element={<SubmissionDetailPage />}
      />

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
