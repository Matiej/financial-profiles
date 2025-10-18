import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAnalyses, type InsightReport } from "../apiAnalyses";

function BackLinkButton({ submissionId }: { submissionId: string }) {
  return (
    <Link
      to={`/submissions/${submissionId}`}
      className="no-print group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium
                 bg-[#0f1e3a] text-white border border-[#d4af37]/70 shadow-sm
                 hover:bg-[#0b172d] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
    >
      <svg className="h-4 w-4 -ml-1 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span>Powrót do wyników</span>
    </Link>
  );
}

export default function AnalysesListPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [data, setData] = useState<InsightReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    setError(null);
    fetchAnalyses(submissionId)
      .then((r) => setData(r.sort((a, b) => b.createdAt.localeCompare(a.createdAt))))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [submissionId]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" });

  if (!submissionId) return <div>Brak submissionId.</div>;

  return (
    <div className="max-w-5xl mx-auto px-2">
      <div className="no-print flex items-center justify-between mb-4 gap-3">
        <BackLinkButton submissionId={submissionId} />
      </div>

      <h1 className="text-2xl font-semibold text-[#0f1e3a] mb-4 text-center">
        Analizy AI – {submissionId}
      </h1>

      {loading && <div className="py-8 text-zinc-600 text-center">⏳ Wczytywanie analiz…</div>}
      {error && <div className="py-8 text-red-600 text-center">❌ {error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="py-8 text-zinc-500 text-center">Brak analiz dla tego zgłoszenia.</div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-100">
                <th className="px-3 py-2">Data</th>
                <th className="px-3 py-2">Model</th>
                <th className="px-3 py-2">Schema</th>
                <th className="px-3 py-2">Wersja</th>
                <th className="px-3 py-2">Test</th>
                <th className="px-3 py-2 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.createdAt} className="bg-white shadow-sm hover:shadow-md transition rounded-md">
                  <td className="px-3 py-2">{fmt(row.createdAt)}</td>
                  <td className="px-3 py-2 font-mono text-sm">{row.model}</td>
                  <td className="px-3 py-2">{row.schemaName}</td>
                  <td className="px-3 py-2">{row.schemaVersion}</td>
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
