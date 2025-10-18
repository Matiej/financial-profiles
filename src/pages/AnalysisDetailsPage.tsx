import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAnalyses, type InsightReport, type CategoryInsight } from "../apiAnalyses";

function BackLinkButton({ submissionId }: { submissionId: string }) {
  return (
    <Link
      to={`/submissions/${submissionId}/analyses`}
      className="no-print group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium
                 bg-[#0f1e3a] text-white border border-[#d4af37]/70 shadow-sm
                 hover:bg-[#0b172d] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
    >
      <svg className="h-4 w-4 -ml-1 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span>Powrót do analiz</span>
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <path d="M6 14h12v8H6z"/>
      </svg>
      Drukuj
    </button>
  );
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium
                   border-[#d4af37]/50 text-[#0f1e3a] bg-white">
    {children}
  </span>
);

export default function AnalysisDetailsPage() {
  const { submissionId, index } = useParams<{ submissionId: string; index: string }>();
  const [list, setList] = useState<InsightReport[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idx = Number(index ?? -1);
  const data = useMemo(() => (list && idx >= 0 && idx < list.length ? list[idx] : null), [list, idx]);

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    setError(null);
    fetchAnalyses(submissionId)
      .then((r) => r.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [submissionId]);

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <style>{`
        :root { --muted:#667085; --border:#e5e7eb; }
        .section-card { border:1px solid var(--border); border-radius:12px; padding:18px; background:white; }
        .h2 { font-size:1.25rem; font-weight:600; margin:0 0 10px; color:#0f1e3a; }
        .subtle { color: var(--muted); }
        .grid-2 { display:grid; grid-template-columns: 1fr 1fr; gap:14px; }
        .list { margin: 6px 0 0; padding-left: 18px; }
        .badge-row { display:flex; flex-wrap:wrap; gap:6px; }
        @media print {
          .no-print { display: none !important; }
          .section-card { break-inside: avoid; page-break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print" style={{ display:"flex", justifyContent:"space-between", marginBottom:12, gap:12 }}>
        {submissionId && <BackLinkButton submissionId={submissionId} />}
        <PrintButton />
      </div>

      <h1 className="text-2xl font-semibold text-[#0f1e3a] mb-2">Raport analizy AI</h1>

      {loading && <div>Wczytywanie…</div>}
      {error && <div style={{ color:"crimson" }}>Błąd: {error}</div>}
      {!loading && !data && !error && <div>Nie znaleziono analizy.</div>}

      {data && (
        <>
          {/* META */}
          <div className="subtle" style={{ marginBottom: 14 }}>
            <div><b>Test:</b> {data.testName}</div>
            <div>
              <b>Klient:</b> {data.clientName || "—"} • <b>Client ID:</b> {data.clientId}
            </div>
            <div>
              <b>Submission:</b> {data.submissionId} • <b>Utworzono:</b>{" "}
              {new Date(data.createdAt).toLocaleString("pl-PL", { dateStyle:"medium", timeStyle:"short" })}
            </div>
            <div>
              <b>Model:</b> {data.model} • <b>Schema:</b> {data.schemaName} ({data.schemaVersion})
            </div>
          </div>

          {/* PODSUMOWANIE KLIENTKI */}
          <div className="section-card" style={{ marginBottom: 16 }}>
            <div className="h2">Podsumowanie</div>
            <div style={{ marginBottom: 8 }}>
              <div className="subtle" style={{ marginBottom: 4 }}>Motywy przewodnie</div>
              <div className="badge-row">
                {data.insightReportStructuredAiResponseDto.clientSummary.keyThemes.map((t, i) => (
                  <Pill key={i}>{t}</Pill>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div className="subtle" style={{ marginBottom: 4 }}>Dominujące kategorie</div>
              <div className="badge-row">
                {data.insightReportStructuredAiResponseDto.clientSummary.dominantCategories.map((d, i) => {
                  const pct = Math.round((d.balanceIndex ?? 0) * 100);
                  return (
                    <Pill key={i}>
                      <span className="font-medium">{d.categoryId}</span>
                      <span className="mx-1">•</span>
                      <span title={d.why}>{pct}%</span>
                    </Pill>
                  );
                })}
              </div>
            </div>

            <p style={{ marginTop: 12 }}>{data.insightReportStructuredAiResponseDto.clientSummary.overallNarrativePl}</p>
          </div>

          {/* WGLĄDY KATEGORII */}
          <div style={{ display:"grid", gap: 14 }}>
            {data.insightReportStructuredAiResponseDto.categoryInsights.map((c: CategoryInsight) => (
              <div key={c.categoryId} className="section-card">
                <div className="h2">{c.categoryLabelPl}</div>

                <div className="grid-2">
                  {/* Mocne strony */}
                  <div>
                    <div className="subtle">Mocne strony</div>
                    <ul className="list">
                      {c.strengthsPl.map((s, i) => <li key={`s-${i}`}>{s}</li>)}
                    </ul>
                  </div>

                  {/* Ryzyka */}
                  <div>
                    <div className="subtle">Ryzyka</div>
                    <ul className="list">
                      {c.risksPl.map((s, i) => <li key={`r-${i}`}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Sprzeczności */}
                {c.contradictionsPl?.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div className="subtle">Sprzeczności do obserwacji</div>
                    <ul className="list">
                      {c.contradictionsPl.map((s, i) => <li key={`c-${i}`}>{s}</li>)}
                    </ul>
                  </div>
                )}

                {/* Rekomendowane interwencje */}
                {c.recommendedInterventionsDto?.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div className="subtle">Rekomendowane interwencje</div>
                    <div style={{ display:"grid", gap:10 }}>
                      {c.recommendedInterventionsDto.map((it, i) => (
                        <div key={`i-${i}`} style={{ border:"1px solid var(--border)", borderRadius:10, padding:12 }}>
                          <div className="badge-row" style={{ marginBottom:6 }}>
                            <Pill>{it.type}</Pill>
                          </div>
                          <div className="font-medium" style={{ marginBottom:4 }}>{it.titlePl}</div>
                          <div style={{ fontSize:14, color:"#0f1e3a" }}>
                            <b>Po co:</b> {it.whyPl}
                          </div>
                          <div style={{ fontSize:14, marginTop:4 }}>
                            <b>Jak:</b> {it.howPl}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* NEXT STEPS */}
          {data.insightReportStructuredAiResponseDto.nextSteps?.length > 0 && (
            <div className="section-card" style={{ marginTop: 16 }}>
              <div className="h2">Następne kroki</div>
              <ul className="list">
                {data.insightReportStructuredAiResponseDto.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
