import type { ProfiledSubmission, SubmissionListItem } from "./types";

// dopasuj do swojego backendu; w dev możesz użyć Vite proxy albo .env
export const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/profiler";

// LISTA: GET /api/profiler → SubmissionListItem[]
export async function fetchSubmissions(): Promise<SubmissionListItem[]> {
  const res = await fetch(`${API_BASE}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// DETALE: GET /api/profiler/{submissionId} → ProfiledSubmission
export async function fetchProfiled(submissionId: string): Promise<ProfiledSubmission> {
  const res = await fetch(`${API_BASE}/${submissionId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// helper daty (PL)
export function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium", timeStyle: "short" })
      .format(new Date(iso));
  } catch {
    return iso ?? "—";
  }
}
