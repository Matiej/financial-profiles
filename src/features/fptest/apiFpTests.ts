import { fetchJSON } from "../../lib/httpClient";

import type {
  FpTest,
  FpTestCreatePayload,
  FpTestUpdatePayload,
  FpTestStatement,
} from "../../types/fpTestTypes";

export const apiFpTests = {
  // GET /api/pftest
  list: (): Promise<FpTest[]> => fetchJSON("/pftest"),

  // GET /api/pftest/{testId}
  get: (testId: string): Promise<FpTest> =>
    fetchJSON(`/pftest/${encodeURIComponent(testId)}`),

  // POST /api/pftest
  create: (payload: FpTestCreatePayload): Promise<FpTest> =>
    fetchJSON("/pftest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  // PUT /api/pftest/{testId}
  update: (testId: string, payload: FpTestUpdatePayload): Promise<FpTest> =>
    fetchJSON(`/pftest/${encodeURIComponent(testId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  // DELETE /api/pftest/{testId}
  delete: async (testId: string): Promise<void> => {
    const res = await fetch(`/api/pftest/${encodeURIComponent(testId)}`, {
      method: "DELETE",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `HTTP ${res.status} ${res.statusText}${text ? ` – ${text}` : ""}`
      );
    }
  },

  listStatements: (): Promise<FpTestStatement[]> =>
    fetchJSON("/pftest/statements"),
};