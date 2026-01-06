import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiProfiler } from "../apiProfiler";
import type { ScoringProfiledShort } from "../../../types/profilerTypes";
import Button from "../../../ui/Button";

export default function ScoringListPage() {
  const [data, setData] = useState<ScoringProfiledShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiProfiler
      .scoringList()
      .then(setData)
      .catch((err) => setError(err.message ?? String(err)))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-zinc-600">
        ⏳ Wczytywanie danych...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-10">❌ Błąd: {error}</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#0f1e3a] mb-4 text-center">
        Wyniki testu scoringowego
      </h1>

      {data.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">
          Brak danych do wyświetlenia.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-100">
                <th className="px-3 py-2">Klient</th>
                <th className="px-3 py-2">Nazwa testu</th>
                <th className="px-3 py-2">Data wykonania testu</th>
                <th className="px-3 py-2">Data zgłoszenia</th>
                <th className="px-3 py-2 text-right">Scoring</th>
                <th className="px-3 py-2 text-right">Ilość par</th>
                <th className="px-3 py-2 text-right">Akcje</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr
                  key={row.testSubmissionPublicId}
                  className="bg-white shadow-sm hover:shadow-md transition rounded-md"
                >
                  {/* Klient */}
                  <td className="px-3 py-2">{row.clientName || "—"}</td>

                  {/* Nazwa testu */}
                  <td className="px-3 py-2 text-sm text-zinc-700">
                    {row.testName}
                  </td>

                  {/* Data wykonania testu */}
                  <td className="px-3 py-2 text-sm text-zinc-700">
                    {formatDate(row.clientTestDate ?? row.submissionDate)}
                  </td>

                  {/* Data zgłoszenia */}
                  <td className="px-3 py-2 text-sm text-zinc-700">
                    {formatDate(row.submissionDate)}
                  </td>

                  {/* Scoring */}
                  <td className="px-3 py-2 text-right font-mono text-sm">
                    <span
                      className={
                        row.totalScoring < 0
                          ? "text-red-700"
                          : row.totalScoring > 0
                          ? "text-emerald-700"
                          : "text-zinc-700"
                      }
                    >
                      {row.totalScoring}
                    </span>
                  </td>

                  {/* Ilość par */}
                  <td className="px-3 py-2 text-right text-sm text-zinc-700">
                    {row.numberOfStatements}
                  </td>

                  {/* Akcje */}
                  <td className="px-3 py-2 text-right">
                    <Link
                      to={`/scoring-results/${encodeURIComponent(
                        row.testSubmissionPublicId
                      )}`}
                    >
                      <Button variant="outline" size="sm">
                        Detale
                      </Button>
                    </Link>
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
