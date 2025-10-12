import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DetailButton from "../components/DetailButton"; 

type ProfiledClientAnswerShort = {
  clientName: string;
  clientId: string;
  submissionId: string;
  submissionDate: string;
  testName: string;
};

export default function ListPage() {
  const [data, setData] = useState<ProfiledClientAnswerShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profiler")
      .then((res) => {
        if (!res.ok) throw new Error("Błąd podczas pobierania danych");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading)
    return (
      <div className="flex justify-center items-center py-10 text-zinc-600">
        ⏳ Wczytywanie danych...
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center py-10">
        ❌ Błąd: {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#0f1e3a] mb-4 text-center">
        Lista wyników testu
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
                <th className="px-3 py-2">Client ID</th>
                <th className="px-3 py-2">Submission</th>
                <th className="px-3 py-2">Data</th>
                <th className="px-3 py-2 text-right">Akcje</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row) => (
                <tr
                  key={row.submissionId}
                  className="bg-white shadow-sm hover:shadow-md transition rounded-md"
                >
                  <td className="px-3 py-2">{row.clientName || "—"}</td>
                  <td className="px-3 py-2 font-mono text-sm text-zinc-700">
                    {row.clientId}
                  </td>
                  <td className="px-3 py-2 font-mono text-sm text-zinc-700">
                    {row.submissionId}
                  </td>
                  <td className="px-3 py-2 text-sm text-zinc-700">
                    {formatDate(row.submissionDate)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/submissions/${row.submissionId}`}>
                      <DetailButton size="sm">Detale</DetailButton>
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
