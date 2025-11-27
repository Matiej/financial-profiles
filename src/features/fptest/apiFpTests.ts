import { fetchJSON } from "../../lib/httpClient";

import type {
  FpTest,
  FpTestCreatePayload,
  FpTestUpdatePayload,
  FpTestStatement,
} from "../../types/fpTestTypes";

// export const apiFpTests = {
//   // GET /api/pftest
//   list: (): Promise<FpTest[]> => fetchJSON("/pftest"),

//   // GET /api/pftest/{testId}
//   get: (testId: string): Promise<FpTest> =>
//     fetchJSON(`/pftest/${encodeURIComponent(testId)}`),

//   // POST /api/pftest
//   create: (payload: FpTestCreatePayload): Promise<FpTest> =>
//     fetchJSON("/pftest", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     }),

//   // PUT /api/pftest/{testId}
//   update: (testId: string, payload: FpTestUpdatePayload): Promise<FpTest> =>
//     fetchJSON(`/pftest/${encodeURIComponent(testId)}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     }),

//   // DELETE /api/pftest/{testId}
//   delete: async (testId: string): Promise<void> => {
//     // UWAGA: ścieżka musi być spójna z pozostałymi.
//     // Jeśli fetchJSON dokleja /api, to tutaj daj "/pftest/..."
//     // Jeśli fetchJSON używa pełnej ścieżki /api/pftest, to dostosuj.
//     const res = await fetch(`/api/pftest/${encodeURIComponent(testId)}`, {
//       method: "DELETE",
//       credentials: "include",
//       headers: { Accept: "application/json" },
//     });

//     const status = res.status;
//     let text = "";

//     try {
//       text = await res.text();
//     } catch {
//       // nic nie robimy, body może być puste
//     }

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let json: any = null;
//     if (text) {
//       try {
//         json = JSON.parse(text);
//       } catch {
//         // body nie jest JSON-em, trudno
//       }
//     }

//     // 1) Jeśli backend zwrócił kod błędu – traktujemy to jako błąd,
//     //    nawet gdyby status był dziwnie ustawiony na 200.
//     if (json?.code) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const err: any = new Error(json?.message || "Request failed");
//       err.status = status;
//       err.code = json.code;
//       throw err;
//     }

//     // 2) Jeśli status jest 4xx/5xx, a nie ma code – też traktujemy jako błąd
//     if (status < 200 || status >= 300) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const err: any = new Error(
//         `HTTP ${status} ${res.statusText}${text && !json ? ` – ${text}` : ""}`
//       );
//       err.status = status;
//       throw err;
//     }

//     // 3) Sukces: nie musi być body, więc po prostu wychodzimy.
//     return;
//   },


//   listStatements: (): Promise<FpTestStatement[]> =>
//     fetchJSON("/pftest/statements"),
// };

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

