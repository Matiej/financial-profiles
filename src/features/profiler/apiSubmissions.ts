import { fetchJSON } from "../../lib/httpClient";
import type {
  Submission,
  SubmissionCreatePayload,
  SubmissionUpdatePayload,
} from "../../types/submissionTypes";

export const apiSubmissions = {
  list: (): Promise<Submission[]> => fetchJSON("/submission"),

  get: (submissionId: string): Promise<Submission> =>
    fetchJSON(`/submission/${encodeURIComponent(submissionId)}`),

  create: (payload: SubmissionCreatePayload): Promise<Submission> =>
    fetchJSON("/submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  update: (
    submissionId: string,
    payload: SubmissionUpdatePayload
  ): Promise<Submission> =>
    fetchJSON(`/submission/${encodeURIComponent(submissionId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  delete: async (submissionId: string): Promise<void> => {
    const res = await fetch(`/api/submission/${encodeURIComponent(submissionId)}`, {
      method: "DELETE",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `HTTP ${res.status} ${res.statusText}${
          text ? ` – ${text}` : ""
        }`
      );
    }
  },
};