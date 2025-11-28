import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiProfiler } from "../apiProfiler";
import DetailButton from "../../../components/DetailButton";
import type {
  SubmissionListItem,
  PayloadMode,
} from "../../../types/profilerTypes";
import { useAnalysisLock } from "../../../features/analyses/AnalysisLockContext";
import { apiAnalyses } from "../../../features/analyses/apiAnalyses";
import AnalysisDoneModal from "../../../components/AnalysisDoneModal";

export default function ListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { lock, setLockedFromStatus, startPolling } = useAnalysisLock();
  const [modeById, setModeById] = useState<Record<string, PayloadMode>>({}); // per row
  const [modal, setModal] = useState<{
    open: boolean;
    status: "DONE" | "FAILED";
    mode?: string | null;
    submissionId?: string | null;
  }>({ open: false, status: "DONE", mode: null, submissionId: null });

  useEffect(() => {
    apiProfiler
      .list()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleModeChange = (submissionId: string, m: PayloadMode) => {
    setModeById((prev) => ({ ...prev, [submissionId]: m }));
  };

  const sendToAnalysis = async (submissionId: string) => {
    if (lock.locked) return;
    const mode = modeById[submissionId] ?? "MINIMAL";
    try {
      await apiAnalyses.analyze(submissionId, mode, false, 1);
      // after 202 starts pulling statuses
      const st = await apiAnalyses.latestStatus(submissionId);
      setLockedFromStatus(submissionId, st);

      startPolling(submissionId, (statusDto) => {
        if (!statusDto) return;
        // alert("Analiza ukończona. Wyniki znajdziesz w zakładce „Analizy”.");
        if (statusDto.status === "DONE" || statusDto.status === "FAILED") {
          setModal({
            open: true,
            status: statusDto.status as "DONE" | "FAILED",
            mode: statusDto.mode ?? null,
            submissionId,
          });
        }
      });

      // const st = await apiAnalyses.latestStatus(submissionId);
      // setLockedFromStatus(submissionId, st);
    } catch (e: unknown) {
      alert(`Nie udało się wysłać do analizy: ${e ?? String(e)}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-10 text-zinc-600">
        ⏳ Wczytywanie danych...
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 text-center py-10">❌ Błąd: {error}</div>
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
              {data.map((row) => {
                const disabled = lock.locked;
                const mode = modeById[row.submissionId] ?? "MINIMAL";
                return (
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
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* Detale – po LEWEJ */}
                        <Link
                          to={`/results/${encodeURIComponent(
                            row.submissionId
                          )}`}
                        >
                          <DetailButton size="sm">Detale</DetailButton>
                        </Link>

                        {/* Prawa strona*/}
                        <div className="flex items-center gap-2">
                          {/* Wybór trybu */}
                          <select
                            value={mode}
                            onChange={(e) =>
                              handleModeChange(
                                row.submissionId,
                                e.target.value as PayloadMode
                              )
                            }
                            className="inline-flex rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm"
                            disabled={lock.locked}
                            title="Wybierz zakres danych do analizy"
                          >
                            <option value="MINIMAL">Minimalny</option>
                            <option value="ENRICHED">Wzbogacony</option>
                            <option value="FULL">Pełny</option>
                          </select>

                          {/* Prześlij do analizy */}
                          <button
                            onClick={() => sendToAnalysis(row.submissionId)}
                            disabled={disabled}
                            className={[
                              "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium shadow-sm border",
                              disabled
                                ? "cursor-not-allowed opacity-70 border-neutral-300 bg-neutral-100 text-neutral-400"
                                : "border-[#0f1e3a] bg-white text-[#0f1e3a] hover:bg-neutral-50",
                            ].join(" ")}
                            title={
                              lock.locked
                                ? "Analiza zablokowana – poczekaj na zakończenie/karencję"
                                : "Wyślij do analizy AI"
                            }
                          >
                            Prześlij do analizy
                          </button>

                          {/* Analizy */}
                          {row.isAnalyzed ? (
                            <Link
                              to={`/results/${encodeURIComponent(
                                row.submissionId
                              )}/analyses`}
                            >
                              <button
                                className="inline-flex items-center rounded-md border border-[#0f1e3a] bg-white text-[#0f1e3a]
                                           px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 shadow-sm"
                              >
                                Analizy
                              </button>
                            </Link>
                          ) : (
                            <button
                              disabled
                              aria-disabled="true"
                              title="Analizy będą dostępne po przetworzeniu"
                              className="inline-flex items-center rounded-md border border-neutral-300 bg-neutral-100 text-neutral-400
                                         px-3 py-1.5 text-sm font-medium cursor-not-allowed opacity-70"
                            >
                              Analizy
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <AnalysisDoneModal
        open={modal.open}
        status={modal.status}
        mode={modal.mode}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onGoToAnalyses={
          modal.submissionId
            ? () =>
                navigate(
                  `/submissions/${encodeURIComponent(
                    modal.submissionId!
                  )}/analyses`
                )
            : undefined
        }
      />
    </div>
  );
}
