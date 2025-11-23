import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiSubmissions } from "../apiSubmissions";
import type { Submission } from "../../../types/submissionTypes";

const TEST_BASE_URL = "https://prof-test/t";

export default function SubmissionDetailPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [data, setData] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const s = await apiSubmissions.get(submissionId);
        setData(s);
      } catch (e: unknown) {
        setError(
          e instanceof Error
            ? e.message
            : "Nie udało się pobrać zgłoszenia."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [submissionId]);

  if (loading) {
    return <div>Wczytywanie…</div>;
  }
  if (error) {
    return <div className="text-red-600">Błąd: {error}</div>;
  }
  if (!data) {
    return <div>Brak danych.</div>;
  }

  const isExpired = data.remainingSeconds <= 0;

  return (
    <div className="max-w-xl mx-auto">
      <Link
        to="/submissions"
        className="inline-flex items-center gap-1 text-sm text-[#0f1e3a] hover:underline mb-3"
      >
        ← Powrót do listy zgłoszeń
      </Link>

      <h1 className="text-2xl font-semibold text-[#0f1e3a] mb-4">
        Zgłoszenie {data.submissionId}
      </h1>

      <div className="space-y-2 text-sm text-zinc-800">
        <div>
          <b>Klient:</b> {data.clientName} ({data.clientId})
        </div>
        <div>
          <b>Test:</b> {data.testName}
        </div>
        <div>
          <b>Status:</b> {data.status}
        </div>
        <div>
          <b>Pozostały czas:</b>{" "}
          {isExpired ? "Wygasł" : `${data.remainingSeconds} s`}
        </div>
        <div>
          <b>Token:</b> {data.publicToken}
        </div>
      </div>

      {!isExpired && (
        <div className="mt-4">
          <a
            href={`${TEST_BASE_URL}/${encodeURIComponent(data.publicToken)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-[#0f1e3a] bg-white text-[#0f1e3a]
                       px-4 py-2 text-sm font-medium hover:bg-neutral-50 shadow-sm"
          >
            Otwórz stronę testu
          </a>
        </div>
      )}
    </div>
  );
}