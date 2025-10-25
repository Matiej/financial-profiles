import { http } from "../../lib/httpClient";
import type { InsightReport, LatestStatus, PayloadMode } from "../../types/profilerTypes";

// GET /api/analysis/:submissionId  -> InsightReport[]
export const apiAnalyses = {
  listBySubmission: (submissionId: string): Promise<InsightReport[]> =>
    http.fetchJSON(`/analysis/${encodeURIComponent(submissionId)}`),

  // status DLA KONKRETNEGO submissionId (zostawiamy jak było)
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

  // ⬇⬇⬇ NOWE: GLOBALNY status (bez submissionId w ścieżce)
  latestGlobalStatus: async (init?: RequestInit): Promise<LatestStatus> => {
    const res = await fetch(`${(import.meta).env.VITE_API_BASE ?? "/api"}/analysis/status`, {
      headers: { Accept: "application/json" },
      credentials: "include",
      ...init,
    });
    if (res.status === 204) return null;        // ← brak jobów ⇒ odblokuj
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
  },

  // POST /api/analysis/:submissionId
  analyze: async (submissionId: string, mode: PayloadMode, force = false, retry = 1, init?: RequestInit) => {
    const base = (import.meta).env.VITE_API_BASE ?? "/api";
    const url = `${base}/analysis/${encodeURIComponent(submissionId)}?force=${force}&mode=${mode}&retry=${retry}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
      ...init,
    });

    if (!res.ok) {
      let detail = "";
      try {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const j = await res.json();
          detail = typeof j === "string" ? j : JSON.stringify(j);
        } else {
          detail = await res.text();
        }
      } catch { /* empty */ }
      throw new Error(`HTTP ${res.status} ${res.statusText}${detail ? ` – ${detail}` : ""}`);
    }
    // 202/201 no body
    return;
  },
};
