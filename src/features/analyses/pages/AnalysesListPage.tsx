import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiAnalyses } from "../apiAnalyses";
import { apiProfiler } from "../../profiler/apiProfiler"; // <-- dodany import do meta
import type { InsightReport } from "../../../types/profilerTypes";

const MODE_PL: Record<string, string> = {
  MINIMAL: "Minimalny",
  ENRICHED: "Wzbogacony",
  FULL: "Pełny",
};

function BackLinkButton() {
  return (
    <Link
      to={`/submissions`}
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
      <span>Powrót do listy testów</span>
    </Link>
  );
}

export default function AnalysesListPage() {
  const { submissionId } = useParams<{ submissionId: string }>();

  const [data, setData] = useState<InsightReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // meta do pseudo-nagłówka (z profilera)
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    clientName: string;
    clientId: string;
    submissionId: string;
    submissionDate: string;
    testName: string;
  } | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    setMetaLoading(true);
    setMetaError(null);
    apiProfiler
      .details(submissionId)
      .then((d) =>
        setMeta({
          clientName: d.clientName,
          clientId: d.clientId,
          submissionId: d.submissionId,
          submissionDate: d.submissionDate,
          testName: d.testName,
        })
      )
      .catch((e) => setMetaError(e instanceof Error ? e.message : String(e)))
      .finally(() => setMetaLoading(false));

    // 2) lista analiz
    setLoading(true);
    setError(null);
    apiAnalyses
      .listBySubmission(submissionId)
      .then((r) =>
        setData(r.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      )
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [submissionId]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (!submissionId) return <div>Brak submissionId.</div>;

  return (
    <div className="max-w-5xl mx-auto px-2">
      <div className="no-print flex items-center justify-between mb-4 gap-3">
        <BackLinkButton />
      </div>

      {/* PSEUDO-NAGŁÓWEK z danymi testu (po lewej) */}
      <div className="mb-3">
        <h1 className="text-2xl font-semibold text-[#0f1e3a] mb-2 text-center">
          Analizy AI
        </h1>

        <div className="border border-zinc-200 rounded-lg p-4 bg-white max-w-xl">
          {metaLoading && (
            <div className="text-zinc-600">Wczytywanie danych testu…</div>
          )}
          {metaError && (
            <div className="text-red-600">Błąd meta: {metaError}</div>
          )}
          {meta && (
            <div className="text-sm text-zinc-700 space-y-1">
              <div>
                <b>Test:</b> {meta.testName}
              </div>
              <div>
                <b>Klient:</b> {meta.clientName || "—"}{" "}
                <span className="mx-1">•</span> <b>Client ID:</b>{" "}
                <span className="font-mono">{meta.clientId}</span>
              </div>
              <div>
                <b>Submission:</b>{" "}
                <span className="font-mono">{meta.submissionId}</span>{" "}
                <span className="mx-1">•</span>
                <b>Data testu:</b> {fmt(meta.submissionDate)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista analiz */}
      {loading && (
        <div className="py-8 text-zinc-600 text-center">
          ⏳ Wczytywanie analiz…
        </div>
      )}
      {error && <div className="py-8 text-red-600 text-center">❌ {error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="py-8 text-zinc-500 text-center">
          Brak analiz dla tego zgłoszenia.
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-100">
                <th className="px-3 py-2">Data analizy</th>
                <th className="px-3 py-2">Model</th>
                <th className="px-3 py-2">Schema</th>
                <th className="px-3 py-2">Wersja</th>
                <th className="px-3 py-2">Dane wejściowe</th>
                <th className="px-3 py-2">Test</th>
                <th className="px-3 py-2 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.createdAt}
                  className="bg-white shadow-sm hover:shadow-md transition rounded-md"
                >
                  <td className="px-3 py-2">{fmt(row.createdAt)}</td>
                  <td className="px-3 py-2 font-mono text-sm">{row.model}</td>
                  <td className="px-3 py-2">{row.schemaName}</td>
                  <td className="px-3 py-2">{row.schemaVersion}</td>
                  <td className="px-3 py-2">
                    {MODE_PL[row.payloadMode ?? ""] ?? "—"}
                  </td>
                  <td className="px-3 py-2">{row.testName}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end">
                      <Link
                        to={`/submissions/${submissionId}/analyses/${idx}`}
                        className="inline-flex items-center rounded-md border border-[#0f1e3a] bg-white text-[#0f1e3a]
                                   px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 shadow-sm"
                      >
                        Detale
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
