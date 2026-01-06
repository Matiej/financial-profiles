import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiAnalyses } from "../apiAnalyses";
import type {
  InsightReport,
  CategoryInsight,
} from "../../../types/profilerTypes";
import Button from "../../../ui/Button";

function BackLinkButton({ submissionId }: { submissionId: string }) {
  return (
    <Link to={`/results/${submissionId}/analyses`} className="no-print">
      <Button variant="primary" className="group gap-2 px-5 py-2.5">
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
        <span>Powrót do analiz</span>
      </Button>
    </Link>
  );
}

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium
            border border-brand-mist/70 bg-white shadow-sm hover:bg-brand-cloud"
      title="Drukuj"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v8H6z" />
      </svg>
      Drukuj
    </button>
  );
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium
                   border-brand-mist/70 text-brand-ink bg-white"
  >
    {children}
  </span>
);

export default function AnalysesDetailsPage() {
  const { submissionId, index } = useParams<{
    submissionId: string;
    index: string;
  }>();
  const [list, setList] = useState<InsightReport[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idx = Number(index ?? -1);
  const data = useMemo(
    () => (list && idx >= 0 && idx < list.length ? list[idx] : null),
    [list, idx]
  );

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    setError(null);
    apiAnalyses
      .listBySubmission(submissionId)
      .then((r) => r.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [submissionId]);

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="no-print flex justify-between mb-3 gap-3">
        {submissionId && <BackLinkButton submissionId={submissionId} />}
        <PrintButton />
      </div>

      <h1 className="text-2xl font-semibold text-brand-ink mb-2">
        Raport analizy AI
      </h1>

      {loading && <div>Wczytywanie…</div>}
      {error && <div className="text-red-600">Błąd: {error}</div>}
      {!loading && !data && !error && <div>Nie znaleziono analizy.</div>}

      {data && (
        <>
          <div className="text-zinc-600 mb-3">
            <div>
              <b>Test:</b> {data.testName}
            </div>
            <div>
              <b>Klient:</b> {data.clientName || "—"} • <b>Client ID:</b>{" "}
              {data.clientId}
            </div>
            <div>
              <b>Submission:</b> {data.submissionId} • <b>Utworzono:</b>{" "}
              {new Date(data.createdAt).toLocaleString("pl-PL", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
            <div>
              <b>Model:</b> {data.model} • <b>Schema:</b> {data.schemaName} (
              {data.schemaVersion})
            </div>
          </div>

         <div className="avoid-break border border-brand-mist/70 rounded-xl p-4 bg-white mb-4">
            <div className="text-xl font-semibold mb-2">Podsumowanie</div>

            <div className="mb-2">
              <div className="text-zinc-600 mb-1">Motywy przewodnie</div>
              <div className="flex flex-wrap gap-1.5">
                {data.insightReportStructuredAiResponseDto.clientSummary.keyThemes.map(
                  (t, i) => (
                    <Pill key={i}>{t}</Pill>
                  )
                )}
              </div>
            </div>

            <div className="mt-2">
              <div className="text-zinc-600 mb-1">Dominujące kategorie</div>
              <div className="flex flex-wrap gap-1.5">
                {data.insightReportStructuredAiResponseDto.clientSummary.dominantCategories.map(
                  (d, i) => {
                    const pct = Math.round((d.balanceIndex ?? 0) * 100);
                    return (
                      <Pill key={i}>
                        <span className="font-medium">{d.categoryId}</span>
                        <span className="mx-1">•</span>
                        <span title={d.why}>{pct}%</span>
                      </Pill>
                    );
                  }
                )}
              </div>
            </div>

            <p className="mt-3">
              {
                data.insightReportStructuredAiResponseDto.clientSummary
                  .overallNarrativePl
              }
            </p>
          </div>

          <div className="grid gap-3">
            {data.insightReportStructuredAiResponseDto.categoryInsights.map(
              (c: CategoryInsight) => (
                <div
                  key={c.categoryId}
                   className="avoid-break border border-brand-mist/70 rounded-xl p-4 bg-white">
                  <div className="text-xl font-semibold mb-2">
                    {c.categoryLabelPl}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-zinc-600">Mocne strony</div>
                      <ul className="mt-1 pl-5 list-disc">
                        {c.strengthsPl.map((s, i) => (
                          <li key={`s-${i}`}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-zinc-600">Ryzyka</div>
                      <ul className="mt-1 pl-5 list-disc">
                        {c.risksPl.map((s, i) => (
                          <li key={`r-${i}`}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {c.contradictionsPl?.length > 0 && (
                    <div className="mt-2">
                      <div className="text-zinc-600">
                        Sprzeczności do obserwacji
                      </div>
                      <ul className="mt-1 pl-5 list-disc">
                        {c.contradictionsPl.map((s, i) => (
                          <li key={`c-${i}`}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.recommendedInterventionsDto?.length > 0 && (
                    <div className="mt-2">
                      <div className="text-zinc-600">
                        Rekomendowane interwencje
                      </div>
                      <div className="grid gap-2">
                        {c.recommendedInterventionsDto.map((it, i) => (
                          <div
                            key={`i-${i}`}
                            className="border border-brand-mist/70 rounded-lg p-3"
                          >
                            <div className="mb-1">
                              <Pill>{it.type}</Pill>
                            </div>
                            <div className="font-medium mb-1">{it.titlePl}</div>
                            <div className="text-sm text-brand-ink">
                              <b>Po co:</b> {it.whyPl}
                            </div>
                            <div className="text-sm mt-1">
                              <b>Jak:</b> {it.howPl}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {data.insightReportStructuredAiResponseDto.nextSteps?.length > 0 && (
            <div className="avoid-break border border-brand-mist/70 rounded-xl p-4 bg-white mb-4">
              <div className="text-xl font-semibold mb-2">Następne kroki</div>
              <ul className="pl-5 list-disc">
                {data.insightReportStructuredAiResponseDto.nextSteps.map(
                  (s, i) => (
                    <li key={i}>{s}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
