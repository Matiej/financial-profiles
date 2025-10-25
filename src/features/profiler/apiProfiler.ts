import { fetchJSON } from "../../lib/httpClient";
import type { SubmissionListItem, ProfiledSubmission } from "../../types/profilerTypes";

export const apiProfiler = {
  list: (): Promise<SubmissionListItem[]> => fetchJSON("/profiler"),
  details: (submissionId: string): Promise<ProfiledSubmission> =>
    fetchJSON(`/profiler/${encodeURIComponent(submissionId)}`),
};
