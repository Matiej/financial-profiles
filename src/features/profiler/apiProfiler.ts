import { fetchJSON } from "../../lib/httpClient";
import type {
  ScoringProfiledSubmission,
  ScoringProfiledShort
} from "../../types/profilerTypes";

export const apiProfiler = {
  scoringList: (): Promise<ScoringProfiledShort[]> =>
    fetchJSON("/profiler/scoring"),

  scoringDetails: (
    testSubmissionPublicId: string
  ): Promise<ScoringProfiledSubmission> =>
    fetchJSON(
      `/profiler/${encodeURIComponent(testSubmissionPublicId)}/scoring`
    ),
};