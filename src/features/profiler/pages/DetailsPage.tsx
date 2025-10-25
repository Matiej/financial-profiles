import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiProfiler } from "../apiProfiler";
import type { ProfiledSubmission } from '../../../types/profilerTypes';
import { fmtDate } from "../../../lib/date";

function BackLinkButton() {
  return (
    <Link
      to="/submissions"
      className="no-print group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium
                 bg-brand-900 text-white border border-brand-gold/70 shadow-sm
                 hover:bg-[#0b172d] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold"
    >
      <svg className="h-4 w-4 -ml-1 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        const d = await apiProfiler.details(submissionId);
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
    <div className="p-6 max-w-[1100px] mx-auto">
      <div className="no-print flex justify-between mb-3 gap-3">
        <BackLinkButton />
        <PrintButton />
      </div>

      <h1 className="text-2xl font-semibold text-brand-900 mb-2">Szczegóły</h1>

      {error && <div className="text-red-600 my-3">Błąd: {error}</div>}
      {loading && <div>Wczytywanie…</div>}
      {!loading && !data && !error && <div>Brak danych.</div>}

      {data && (
        <>
          <div className="my-2 text-zinc-700">
            <div><b>Test:</b> {data.testName}</div>
            <div><b>Klient:</b> {data.clientName} • <b>Client ID:</b> {data.clientId}</div>
            <div><b>Submission:</b> {data.submissionId} • <b>Data:</b> {fmtDate(data.submissionDate)}</div>
          </div>

          <div className="grid gap-4">
            {categories.map((cat) => {
              const total = Math.max(1, cat.totalLimiting + cat.totalSupporting);
              const limPct = Math.round((cat.totalLimiting / total) * 100);

              return (
                <div key={cat.category.categoryName} className="avoid-break border border-zinc-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold m-0">{cat.category.description}</h2>
                    <div className="font-mono">
                      {cat.totalLimiting} ✗ / {cat.totalSupporting} ✓
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-xs text-[#7f1d1d] font-semibold">
                      Ograniczające: {limPct}%
                    </div>
                    <div className="h-2 bg-zinc-200 rounded-full overflow-hidden flex" aria-label={`Ograniczające ${limPct}%`}>
                      <div className="bg-red-600" style={{ width: `${limPct}%` }} />
                      <div className="flex-1 bg-green-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="font-bold mb-1 text-[#7f1d1d]">Ograniczające (true)</div>
                      <ul className="m-0 pl-5 list-disc">
                        {cat.profiledStatementList
                          .filter((s) => s.type === "LIMITING" && s.status)
                          .map((s, i) => (<li key={`lim-${i}`}>{s.description}</li>))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold mb-1 text-[#065f46]">Wspierające (true)</div>
                      <ul className="m-0 pl-5 list-disc">
                        {cat.profiledStatementList
                          .filter((s) => s.type === "SUPPORTING" && s.status)
                          .map((s, i) => (<li key={`sup-${i}`}>{s.description}</li>))}
                      </ul>
                    </div>
                  </div>

                  <details className="mt-2">
                    <summary>Reszta (false)</summary>
                    <ul className="mt-1 pl-5 list-disc">
                      {cat.profiledStatementList
                        .filter((s) => !s.status)
                        .map((s, i) => (
                          <li key={`other-${i}`}>
                            <code className="mr-1">{s.type === "SUPPORTING" ? "SUPPORT" : "LIMIT"}</code>
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
