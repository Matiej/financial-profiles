const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

export async function fetchJSON<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${input}`, {
    headers: { "Accept": "application/json" },
    credentials: "include", // jeśli kiedyś włączysz cookie auth, to już jest gotowe
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` – ${text}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export const http = { fetchJSON };
