import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiProfiler } from "../apiProfiler";
import type {
  ScoringProfiledSubmission,
  ScoringStatementPair,
  ScoreBucketKey,
} from "../../../types/profilerTypes";
import { fmtDate } from "../../../lib/date";

function BackLinkButton() {
  return (
    <Link
      to="/scoring-results"
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
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span>Powrót do listy scoringów</span>
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

const BUCKET_ORDER: ScoreBucketKey[] = ["-2", "-1", "0", "1", "2"];

const BUCKET_LABELS: Record<ScoreBucketKey, string> = {
  "-2": "mocno limitujące",
  "-1": "limitujące",
  "0": "neutralne",
  "1": "wspierające",
  "2": "mocno wspierające",
};

const BUCKET_COLORS: Record<ScoreBucketKey, string> = {
  "-2": "#b91c1c", // ciemny czerwony
  "-1": "#f97316", // pomarańczowy
  "0": "#9ca3af", // szary
  "1": "#22c55e", // zielony
  "2": "#15803d", // ciemniejszy zielony
};

type PieChartProps = {
  buckets: Partial<Record<ScoreBucketKey, number>>;
  total: number;
};

function OverallPieChart({ buckets, total }: PieChartProps) {
  if (total === 0) {
    return (
      <div className="text-sm text-zinc-500">Brak odpowiedzi do pokazania.</div>
    );
  }

  let offset = 0;
  const segments: {
    key: ScoreBucketKey;
    value: number;
    dasharray: string;
    dashoffset: string;
  }[] = [];

  BUCKET_ORDER.forEach((b) => {
    const v = buckets[b] ?? 0;
    if (!v) return;
    const fraction = v / total;
    const length = fraction * 100;
    segments.push({
      key: b,
      value: v,
      dasharray: `${length} ${100 - length}`,
      dashoffset: `${-offset}`,
    });
    offset += length;
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <svg
        viewBox="0 0 32 32"
        className="w-32 h-32"
        aria-label="Rozkład odpowiedzi -2..2"
      >
        <circle
          cx="16"
          cy="16"
          r="15.9"
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        {segments.map((seg) => (
          <circle
            key={seg.key}
            cx="16"
            cy="16"
            r="15.9"
            fill="transparent"
            stroke={BUCKET_COLORS[seg.key]}
            strokeWidth="4"
            strokeDasharray={seg.dasharray}
            strokeDashoffset={seg.dashoffset}
            transform="rotate(-90 16 16)"
          />
        ))}
      </svg>

      <div className="flex-1 text-xs space-y-1">
        {BUCKET_ORDER.map((b) => {
          const v = buckets[b] ?? 0;
          if (!v) return null;
          return (
            <div key={b} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: BUCKET_COLORS[b] }}
              />
              <span className="font-mono">{b}</span>
              <span>= {v}</span>
              <span className="text-zinc-500">({BUCKET_LABELS[b]})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function groupByScoring(pairs: ScoringStatementPair[]) {
  const groups: Record<string, ScoringStatementPair[]> = {};
  for (const p of pairs) {
    const key = String(p.scoring);
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  return groups;
}

export default function ScoringDetailsPage() {
  const { testSubmissionPublicId } = useParams<{
    testSubmissionPublicId: string;
  }>();
  const [data, setData] = useState<ScoringProfiledSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testSubmissionPublicId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await apiProfiler.scoringDetails(testSubmissionPublicId);
        setData(d);
      } catch (e: unknown) {
        setError(
          (e instanceof Error ? e.message : String(e)) +
            " Error while scoring details retrieving"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [testSubmissionPublicId]);

  const overallBuckets = useMemo(
    () => data?.overallSummary.scoreBuckets ?? {},
    [data]
  );

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="no-print flex justify-between mb-3 gap-3">
        <BackLinkButton />
        <PrintButton />
      </div>

      <h1 className="text-2xl font-semibold text-brand-900 mb-2">
        Wynik testu scoringowego
      </h1>

      {error && <div className="text-red-600 my-3">Błąd: {error}</div>}
      {loading && <div>Wczytywanie…</div>}
      {!loading && !data && !error && <div>Brak danych.</div>}

      {data && (
        <>
          {/* META */}
          <div className="my-2 text-zinc-700">
            <div>
              <b>Test:</b> {data.testName} ({data.testId})
            </div>
            <div>
              <b>Klient:</b> {data.clientName} • <b>Client ID:</b>{" "}
              {data.clientId}
            </div>
            <div>
              <b>Submission:</b> {data.submissionId} • <b>Data systemowa:</b>{" "}
              {fmtDate(data.submissionDate)}
            </div>
            <div>
              <b>Data wykonania testu:</b>{" "}
              {fmtDate(data.clientTestDate ?? data.submissionDate)}
            </div>
            <div>
              <b>Public ID:</b> {data.testSubmissionPublicId}
            </div>
          </div>

          {/* OVERALL SUMMARY */}
          <div className="mt-4 mb-6 grid gap-4 md:grid-cols-3">
            <div className="border border-zinc-200 rounded-lg p-4 bg-white">
              <div className="text-sm text-zinc-500">Liczba odpowiedzi</div>
              <div className="text-2xl font-semibold">
                {data.overallSummary.totalAnswers}
              </div>
            </div>

            <div className="border border-zinc-200 rounded-lg p-4 bg-white">
              <div className="text-sm text-zinc-500">Łączny wynik</div>
              <div
                className={[
                  "text-2xl font-semibold",
                  data.overallSummary.totalScore < 0
                    ? "text-red-700"
                    : data.overallSummary.totalScore > 0
                    ? "text-emerald-700"
                    : "text-zinc-800",
                ].join(" ")}
              >
                {data.overallSummary.totalScore}
              </div>
            </div>

            <div className="border border-zinc-200 rounded-lg p-4 bg-white">
              <div className="text-sm text-zinc-500 mb-2">
                Rozkład odpowiedzi (-2..2)
              </div>
              <OverallPieChart
                buckets={
                  overallBuckets as Partial<Record<ScoreBucketKey, number>>
                }
                total={data.overallSummary.totalAnswers}
              />
            </div>
          </div>

          {/* ZBIORCZA TABLICA KATEGORII */}
          <div className="mb-6 border border-zinc-200 rounded-lg bg-white">
            <div className="border-b border-zinc-200 px-4 py-2">
              <h2 className="text-sm font-semibold text-zinc-800 m-0">
                Kategorie – przegląd (od najbardziej obciążonej)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100">
                    <th className="px-4 py-2">Kategoria</th>
                    <th className="px-4 py-2 text-right">Scoring</th>
                    <th className="px-4 py-2 text-right">
                      Liczba odpowiedzi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories
                    .slice()
                    .sort((a, b) => a.totalScore - b.totalScore)
                    .map((cat) => (
                      <tr
                        key={cat.category.categoryName}
                        className="border-t border-zinc-100 hover:bg-zinc-50/60"
                      >
                        <td className="px-4 py-2">
                          {cat.category.description}
                        </td>
                        <td className="px-4 py-2 text-right font-mono">
                          <span
                            className={
                              cat.totalScore < 0
                                ? "text-red-700"
                                : cat.totalScore > 0
                                ? "text-emerald-700"
                                : "text-zinc-800"
                            }
                          >
                            {cat.totalScore}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right text-xs text-zinc-600">
                          {cat.totalAnswers}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SZCZEGÓŁOWE KARTY KATEGORII */}
          <div className="grid gap-4">
            {data.categories.map((cat) => {
              const grouped = groupByScoring(cat.answersBySeverity);
              return (
                <div
                  key={cat.category.categoryName}
                  className="avoid-break border border-zinc-200 rounded-lg p-4 bg-white"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h2 className="text-xl font-semibold m-0">
                      {cat.category.description}
                    </h2>
                    <div className="text-right text-sm">
                      <div>
                        <b>Wynik kategorii:</b>{" "}
                        <span
                          className={
                            cat.totalScore < 0
                              ? "text-red-700"
                              : cat.totalScore > 0
                              ? "text-emerald-700"
                              : "text-zinc-800"
                          }
                        >
                          {cat.totalScore}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {cat.totalAnswers} odpowiedzi•średnia{" "}
                        {cat.avgScore.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Mini rozkład bucketów w kategorii */}
                  <div className="mt-1 mb-3 flex flex-wrap gap-2 text-xs">
                    {BUCKET_ORDER.map((b) => {
                      const v = cat.scoreBuckets[b] ?? 0;
                      if (!v) return null;
                      return (
                        <span
                          key={b}
                          className="inline-flex items-center rounded-full border border-zinc-200 px-2 py-1 bg-zinc-50"
                        >
                          <span className="font-mono mr-1">{b}</span>
                          <span>{v} odp.</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Lista par przekonań, pogrupowana po scoringu */}
                  <div className="mt-2 space-y-3">
                    {BUCKET_ORDER.map((b) => {
                      const bucketPairs = grouped[b];
                      if (!bucketPairs || bucketPairs.length === 0) return null;

                      const label =
                        b === "-2"
                          ? "Mocno limitujące odpowiedzi (-2)"
                          : b === "-1"
                          ? "Limitujące odpowiedzi (-1)"
                          : b === "0"
                          ? "Odpowiedzi neutralne (0)"
                          : b === "1"
                          ? "Odpowiedzi wspierające (1)"
                          : "Mocno wspierające odpowiedzi (2)";

                      return (
                        <div key={b}>
                          <div className="text-sm font-semibold text-zinc-800 mb-1">
                            {label}
                          </div>
                          <ul className="m-0 pl-5 list-disc text-sm space-y-1">
                            {bucketPairs.map((p: ScoringStatementPair) => (
                              <li key={p.statementKey}>
                                <div className="text-[11px] text-zinc-400 mb-0.5">
                                  {p.statementKey}
                                </div>
                                <div className="text-[#7f1d1d]">
                                  <b>Limitujące:</b> {p.limitingDescription}
                                </div>
                                <div className="text-[#065f46]">
                                  <b>Wspierające:</b> {p.supportingDescription}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
