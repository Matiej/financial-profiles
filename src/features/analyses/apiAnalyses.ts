import { fetchJSON } from "../../lib/httpClient";
import type { InsightReport } from "../../types/profilerTypes";

// GET /api/analysis/:submissionId  -> InsightReport[]
export const apiAnalyses = {
  listBySubmission: (submissionId: string): Promise<InsightReport[]> =>
    fetchJSON(`/analysis/${encodeURIComponent(submissionId)}`),
};
