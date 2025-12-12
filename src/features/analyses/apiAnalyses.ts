import { http } from "../../lib/httpClient";
import type { InsightReport, LatestStatus, PayloadMode } from "../../types/profilerTypes";


export const apiAnalyses = {
  // GET /api/analysis/:submissionId
  listBySubmission: (submissionId: string): Promise<InsightReport[]> =>
    http.fetchJSON(`/analysis/${encodeURIComponent(submissionId)}`),

  // GET /api/analysis/:submissionId/status
  latestStatus: (submissionId: string): Promise<LatestStatus> =>
    http.fetchJSON(
      `/analysis/${encodeURIComponent(submissionId)}/status`
    ),

  // GET /api/analysis/status
  latestGlobalStatus: (): Promise<LatestStatus> =>
    http.fetchJSON(`/analysis/status`),

  // POST /api/analysis/:submissionId
  analyze: (
    submissionId: string,
    mode: PayloadMode,
    force = false,
    retry = 1
  ): Promise<void> =>
    http.fetchJSON(
      `/analysis/${encodeURIComponent(submissionId)}?force=${force}&mode=${mode}&retry=${retry}`,
      {
        method: "POST",
      }
    ),
};