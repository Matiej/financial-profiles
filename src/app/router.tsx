import { Routes, Route, Navigate } from "react-router-dom";
import ListPage from "../features/profiler/pages/ListPage";
import DetailsPage from "../features/profiler/pages/DetailsPage"
import AnalysesListPage from "../features/analyses/pages/AnalysesListPage";
import AnalysisDetailsPage from "../features/analyses/pages/AnalysesDetailsPage";
import StatementsDictionaryPage from "../features/dictionary/pages/StatementsDictionaryPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/submissions" replace />} />
      <Route path="/submissions" element={<ListPage />} />
      <Route path="/submissions/:submissionId" element={<DetailsPage />} />
      <Route path="/submissions/:submissionId/analyses" element={<AnalysesListPage />} />
      <Route path="/submissions/:submissionId/analyses/:index" element={<AnalysisDetailsPage />} />
      <Route path="/dictionary" element={<StatementsDictionaryPage />} />
      <Route path="*" element={<div className="p-6">404</div>} />
    </Routes>
  );
}
