import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProfiled, fmtDate } from "../api";
import type { ProfiledSubmission } from "../types";

function BackLinkButton() {
  return (
    <Link
      to="/submissions"
      className="group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium
                 bg-[#0f1e3a] text-white border border-[#d4af37]/70 shadow-sm
                 hover:bg-[#0b172d] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
    >
      {/* strzałka w lewo */}
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
        setError(e + "Error while details retrieving");
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
      <div className="mb-4">
        <BackLinkButton />
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
            <div>
              <b>Test:</b> {data.testName}
            </div>
            <div>
              <b>Klient:</b> {data.clientName} • <b>Client ID:</b>{" "}
              {data.clientId}
            </div>
            <div>
              <b>Submission:</b> {data.submissionId} • <b>Data:</b>{" "}
              {fmtDate(data.submissionDate)}
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {categories.map((cat) => {
              const total = Math.max(
                1,
                cat.totalLimiting + cat.totalSupporting
              );
              const supPct = Math.round((cat.totalSupporting / total) * 100);
              return (
                <div
                  key={cat.category.categoryName}
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
                    }}
                  >
                    <h2 style={{ margin: 0 }}>{cat.category.description}</h2>
                    <div style={{ fontFamily: "monospace" }}>
                      {cat.totalSupporting} ✓ / {cat.totalLimiting} ✗
                    </div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      Wspierające: {supPct}%
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#eee",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${supPct}%`,
                          background: "#22c55e",
                        }}
                      />
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
                          fontWeight: 600,
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
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
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
