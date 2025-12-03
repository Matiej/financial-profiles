import { fetchJSON } from "../../lib/httpClient";
import type {
  SubmissionListItem,
  ProfiledSubmission,
  ScoringProfiledSubmission,
  ScoringProfiledShort
} from "../../types/profilerTypes";

export const apiProfiler = {
  list: (): Promise<SubmissionListItem[]> => fetchJSON("/profiler"),

  details: (submissionId: string): Promise<ProfiledSubmission> =>
    fetchJSON(`/profiler/${encodeURIComponent(submissionId)}`),


  scoringList: (): Promise<ScoringProfiledShort[]> =>
    fetchJSON("/profiler/scoring"),

  scoringDetails: (
    testSubmissionPublicId: string
  ): Promise<ScoringProfiledSubmission> =>
    fetchJSON(
      `/profiler/${encodeURIComponent(testSubmissionPublicId)}/scoring`
    ),
};