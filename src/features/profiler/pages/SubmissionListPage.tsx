import { useEffect, useState } from "react";
import { apiSubmissions } from "../apiSubmissions";
import type { Submission } from "../../../types/submissionTypes";
import { SubmissionFormModal } from "./SubmissionFormModal";
import type { FpTest } from "../../../types/fpTestTypes";
import Button from "../../../ui/Button";

const TEST_BASE_URL =
  import.meta.env.VITE_TEST_BASE_URL ?? "http://localhost:3210/t";

function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function renderRemaining(row: Submission): string {
  if (row.status === "DONE") return "Zakończony";
  if (row.remainingSeconds <= 0) return "Wygasł";
  return formatRemaining(row.remainingSeconds);
}

function formatRemaining(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

type LinkModalState = {
  open: boolean;
  url: string | null;
};

function LinkModal({
  open,
  url,
  onClose,
}: {
  open: boolean;
  url: string | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  if (!open || !url) return null;

  const handleCopy = async () => {
    // --- Próba 1: Clipboard API (działa tylko w HTTPS lub localhost) ---
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.error("Clipboard API error:", err);
        // lecimy do fallbacku
      }
    }

    // --- Próba 2: Fallback dla HTTP, LAN, 192.168.x.x itd. ---
    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;

      // ukrycie textarea
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";

      document.body.appendChild(textarea);
      textarea.select();

      const success = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (!success) {
        throw new Error("execCommand zwrócił false");
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fallback copy error:", err);
      alert(
        "Nie udało się skopiować linku. Skopiuj go ręcznie z pola powyżej."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white border border-[#d4af37]/40 shadow-xl p-6 relative">
          <h2 className="text-lg font-semibold text-[#0f1e3a] mb-3">
            Link do testu
          </h2>

          <p className="text-sm text-zinc-700 mb-2">
            Poniżej znajduje się pełny link dla klienta. Możesz go skopiować i
            wkleić w wiadomości.
          </p>

          <div className="mt-2 mb-4">
            <div className="text-xs font-mono break-all border border-zinc-200 rounded-md px-3 py-2 bg-neutral-50">
              {url}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              onClick={handleCopy}
              variant="secondary"
            >
              {copied ? "Skopiowano!" : "Skopiuj"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="primary"
            >
              OK
            </Button>
          </div>

          {/* X w rogu */}
          <button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubmissionListPage() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Submission | null>(null);

  const [linkModal, setLinkModal] = useState<LinkModalState>({
    open: false,
    url: null,
  });

  const [tests, setTests] = useState<FpTest[]>([]);
  const [testsLoading, setTestsLoading] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setData((prev) =>
        prev.map((s) => {
          if (s.status !== "OPEN") {
            return s;
          }
          if (s.remainingSeconds <= 0) {
            return { ...s, remainingSeconds: 0 };
          }
          return { ...s, remainingSeconds: s.remainingSeconds - 1 };
        })
      );
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTestsLoading(true);
      try {
        const [submissions, testsList] = await Promise.all([
          apiSubmissions.list(),
          apiSubmissions.listTests(),
        ]);
        setData(submissions);
        setTests(testsList);
      } catch (e: unknown) {
        setError(
          e instanceof Error
            ? e.message
            : "Nie udało się pobrać zgłoszeń lub testów."
        );
      } finally {
        setLoading(false);
        setTestsLoading(false);
      }
    })();
  }, []);

  const handleNew = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEdit = (sub: Submission) => {
    setEditTarget(sub);
    setModalOpen(true);
  };

  const handleDelete = async (sub: Submission) => {
    const ok = window.confirm(
      `Czy na pewno chcesz usunąć zgłoszenie dla klienta "${sub.clientName}"?`
    );
    if (!ok) return;

    try {
      await apiSubmissions.delete(sub.submissionId);
      setData((prev) =>
        prev.filter((it) => it.submissionId !== sub.submissionId)
      );
    } catch (e: unknown) {
      alert(
        `Nie udało się usunąć zgłoszenia: ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
  };

  const handleSubmitForm = async (payload: {
    clientName: string;
    clientEmail: string;
    testId: string;
    durationDays: number;
  }) => {
    if (editTarget) {
      // UPDATE – bez clientId
      const updated = await apiSubmissions.update(editTarget.submissionId, {
        clientName: payload.clientName,
        clientEmail: payload.clientEmail,
        testId: payload.testId,
        durationDays: payload.durationDays,
      });
      setData((prev) =>
        prev.map((it) =>
          it.submissionId === updated.submissionId ? updated : it
        )
      );
    } else {
      // CREATE – clientId = fe_client_test_id
      const created = await apiSubmissions.create({
        clientId: "fe_client_test_id",
        clientName: payload.clientName,
        clientEmail: payload.clientEmail,
        orderId: "admin_order",
        testId: payload.testId,
        durationDays: payload.durationDays,
      });
      setData((prev) => [created, ...prev]);
    }
  };

  const openLinkModal = (publicToken: string) => {
    const url = `${TEST_BASE_URL}/${encodeURIComponent(publicToken)}`;
    setLinkModal({ open: true, url });
  };

  const closeLinkModal = () => setLinkModal({ open: false, url: null });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-zinc-600">
        ⏳ Wczytywanie zgłoszeń...
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
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#0f1e3a]">
          Oczekujące zgłoszenia
        </h1>
        <Button onClick={handleNew} variant="primary">
          + Nowe zgłoszenie
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">
          Brak zgłoszeń. Kliknij „Nowe zgłoszenie”, aby rozpocząć.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-100">
                <th className="px-3 py-2">Klient</th>
                <th className="px-3 py-2">E-mail</th>
                <th className="px-3 py-2">Test</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Pozostały czas</th>
                <th className="px-3 py-2">Utworzono</th>
                <th className="px-3 py-2 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const isExpired = row.remainingSeconds <= 0;
                const rowBg = isExpired ? "bg-neutral-50" : "bg-white";

                const testName =
                  tests.find((t) => t.testId === row.testId)?.testName ??
                  `Test ${row.testId}`;

                return (
                  <tr
                    key={row.submissionId}
                    className={`${rowBg} shadow-sm hover:shadow-md transition rounded-md`}
                  >
                    <td className="px-3 py-2">{row.clientName || "—"}</td>
                    <td className="px-3 py-2 text-sm text-zinc-700">
                      {row.clientEmail || "—"}
                    </td>
                    <td className="px-3 py-2 text-sm text-zinc-700">
                      {testsLoading ? "Ładowanie testów…" : testName}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {row.status === "OPEN" ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-medium border border-emerald-100">
                          OPEN
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-700 px-2 py-0.5 text-xs font-medium border border-zinc-200">
                          DONE
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm text-zinc-700 font-mono">
                      {renderRemaining(row)}
                    </td>
                    <td className="px-3 py-2 text-sm text-zinc-700">
                      {formatCreatedAt(row.createdAt)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          onClick={() => openLinkModal(row.publicToken)}
                          variant="outline"
                          size="sm"
                        >
                          Link do testu
                        </Button>

                        <Button
                          onClick={
                            row.status === "DONE"
                              ? undefined
                              : () => handleEdit(row)
                          }
                          disabled={row.status === "DONE"}
                          variant="outline"
                          size="sm"
                        >
                          Edytuj
                        </Button>

                        <Button
                          onClick={
                            row.status === "DONE"
                              ? undefined
                              : () => handleDelete(row)
                          }
                          disabled={row.status === "DONE"}
                          variant="danger"
                          size="sm"
                        >
                          Usuń
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal linku */}
      <LinkModal
        open={linkModal.open}
        url={linkModal.url}
        onClose={closeLinkModal}
      />

      <SubmissionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitForm}
        initial={editTarget}
      />
    </div>
  );
}
