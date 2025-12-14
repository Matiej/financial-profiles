import { fetchJSON } from "../../lib/httpClient";

import type {
  FpTest,
  FpTestCreatePayload,
  FpTestUpdatePayload,
  FpTestStatement,
} from "../../types/fpTestTypes";

export const apiFpTests = {
  list: (): Promise<FpTest[]> => fetchJSON("/pftest"),

  get: (testId: string): Promise<FpTest> =>
    fetchJSON(`/pftest/${encodeURIComponent(testId)}`),

  create: (payload: FpTestCreatePayload): Promise<FpTest> =>
    fetchJSON("/pftest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  update: (testId: string, payload: FpTestUpdatePayload): Promise<FpTest> =>
    fetchJSON(`/pftest/${encodeURIComponent(testId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  delete: (testId: string): Promise<void> =>
    fetchJSON<void>(`/pftest/${encodeURIComponent(testId)}`, {
      method: "DELETE",
    }),

  listStatements: (): Promise<FpTestStatement[]> =>
    fetchJSON("/pftest/statements"),
};

