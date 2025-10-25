import { http  } from "../../lib/httpClient";
import type { InsightReport, LatestStatus, PayloadMode } from "../../types/profilerTypes";

// GET /api/analysis/:submissionId  -> InsightReport[]
export const apiAnalyses = {
  listBySubmission: (submissionId: string): Promise<InsightReport[]> =>
    http.fetchJSON(`/analysis/${encodeURIComponent(submissionId)}`),

    latestStatus: async (submissionId: string, init?: RequestInit): Promise<LatestStatus> => {
    const res = await fetch(`${(import.meta).env.VITE_API_BASE ?? "/api"}/analysis/${encodeURIComponent(submissionId)}/status`, {
      headers: { Accept: "application/json" },
      credentials: "include",
      ...init,
    });
    if (res.status === 204) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
  },

//   analyze: (submissionId: string, mode: PayloadMode, force = false, retry = 1, init?: RequestInit) =>
//     http.fetchJSON<void>(
//       `/analysis/${encodeURIComponent(submissionId)}?force=${force}&mode=${mode}&retry=${retry}`,
//       { method: "POST", ...init }
//     ),
 analyze: async (submissionId: string, mode: PayloadMode, force = false, retry = 1, init?: RequestInit) => {
    const base = (import.meta  ).env.VITE_API_BASE ?? "/api";
    const url = `${base}/analysis/${encodeURIComponent(submissionId)}?force=${force}&mode=${mode}&retry=${retry}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
      ...init,
    });

    if (!res.ok) {
      // backend może zwrócić błąd z treścią – spróbujmy bezpiecznie odczytać
      let detail = "";
      try {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const j = await res.json();
          detail = typeof j === "string" ? j : JSON.stringify(j);
        } else {
          detail = await res.text();
        }
      } catch {
        /* ignoruj parse error */
      }
      throw new Error(`HTTP ${res.status} ${res.statusText}${detail ? ` – ${detail}` : ""}`);
    }
    // brak .json(): 202/201 z pustym body nie wywali błędu
    return;
  },
};
