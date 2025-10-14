import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProfiled, fmtDate } from "../api";
import type { ProfiledSubmission } from "../types";

function BackLinkButton() {
  return (
    <Link
      to="/submissions"
      className="no-print group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium
                 bg-[#0f1e3a] text-white border border-[#d4af37]/70 shadow-sm
                 hover:bg-[#0b172d] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
    >
      <svg
        className="h-4 w-4 -ml-1 transition-transform group-hover:-translate-x-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span>Powrót do listy</span>
    </Link>
  );
}

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium
                 border border-neutral-300 shadow-sm hover:bg-neutral-50"
      title="Drukuj"
    >
      {/* Ikona drukarki */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9V2h12v7"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <path d="M6 14h12v8H6z"/>
      </svg>
      Drukuj
    </button>
  );
}

export default function DetailsPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [data, setData] = useState<ProfiledSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await fetchProfiled(submissionId);
        setData(d);
      } catch (e: unknown) {
        setError((e instanceof Error ? e.message : String(e)) + " Error while details retrieving");
      } finally {
        setLoading(false);
      }
    })();
  }, [submissionId]);

  const categories = useMemo(
    () => data?.profiledCategoryClientStatementsList ?? [],
    [data]
  );

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <style>
        {`
        @media print {
          .no-print { display: none !important; }
          a[href]:after { content: "" !important; } /* bez dopisków URL */
          .card { break-inside: avoid; page-break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        `}
      </style>

      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
        <BackLinkButton />
        <PrintButton />
      </div>

      <h1>Szczegóły</h1>

      {error && (
        <div style={{ color: "crimson", margin: "12px 0" }}>Błąd: {error}</div>
      )}
      {loading && <div>Wczytywanie…</div>}
      {!loading && !data && !error && <div>Brak danych.</div>}

      {data && (
        <>
          <div style={{ margin: "8px 0 16px", color: "#444" }}>
            <div><b>Test:</b> {data.testName}</div>
            <div><b>Klient:</b> {data.clientName} • <b>Client ID:</b> {data.clientId}</div>
            <div><b>Submission:</b> {data.submissionId} • <b>Data:</b> {fmtDate(data.submissionDate)}</div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {categories.map((cat) => {
              const total = Math.max(1, cat.totalLimiting + cat.totalSupporting);
              const limPct = Math.round((cat.totalLimiting / total) * 100);

              return (
                <div
                  key={cat.category.categoryName}
                  className="card"
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <h2 style={{ margin: 0 }}>{cat.category.description}</h2>
                    <div style={{ fontFamily: "monospace" }}>
                      {cat.totalLimiting} ✗ / {cat.totalSupporting} ✓
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 12, color: "#7f1d1d", fontWeight: 600 }}>
                      Ograniczające: {limPct}%
                    </div>
                    <div
                      style={{
                        height: 10,
                        background: "#e5e7eb",
                        borderRadius: 999,
                        overflow: "hidden",
                        display: "flex",
                      }}
                      aria-label={`Ograniczające ${limPct}%`}
                    >
                      <div style={{ width: `${limPct}%`, background: "#dc2626" }} />
                      <div style={{ flex: 1, background: "#22c55e" }} />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginTop: 12,
                    }}
                  >
  
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom: 6,
                          color: "#7f1d1d",
                        }}
                      >
                        Ograniczające (true)
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {cat.profiledStatementList
                          .filter((s) => s.type === "LIMITING" && s.status)
                          .map((s, i) => (
                            <li key={`lim-${i}`}>{s.description}</li>
                          ))}
                      </ul>
                    </div>

                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom: 6,
                          color: "#065f46",
                        }}
                      >
                        Wspierające (true)
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {cat.profiledStatementList
                          .filter((s) => s.type === "SUPPORTING" && s.status)
                          .map((s, i) => (
                            <li key={`sup-${i}`}>{s.description}</li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <details style={{ marginTop: 8 }}>
                    <summary>Reszta (false)</summary>
                    <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                      {cat.profiledStatementList
                        .filter((s) => !s.status)
                        .map((s, i) => (
                          <li key={`other-${i}`}>
                            <code style={{ marginRight: 6 }}>
                              {s.type === "SUPPORTING" ? "SUPPORT" : "LIMIT"}
                            </code>
                            {s.description}
                          </li>
                        ))}
                    </ul>
                  </details>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
