import { useEffect, useState } from "react";
import type { Submission } from "../../../types/submissionTypes";
import type { FpTest } from "../../../types/fpTestTypes";
import { apiSubmissions } from "../apiSubmissions";
import Button from "../../../ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    clientName: string;
    clientEmail: string;
    testId: string;
    durationDays: number;
  }) => Promise<void> | void;
  initial?: Submission | null; // jeśli edycja, wchodzą dane
};

export function SubmissionFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: Props) {
  const isEdit = !!initial;

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const [durationDays, setDurationDays] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tests, setTests] = useState<FpTest[]>([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    setError(null);

    if (initial) {
      setClientName(initial.clientName ?? "");
      setClientEmail(initial.clientEmail ?? "");
      setDurationDays(0);
      setSelectedTestId(initial.testId ?? "");
    } else {
      setClientName("");
      setClientEmail("");
      setDurationDays("");
      setSelectedTestId("");
    }

    setTestsLoading(true);
    apiSubmissions
      .listTests()
      .then((list) => setTests(list))
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "Nie udało się pobrać listy testów."
        );
      })
      .finally(() => {
        setTestsLoading(false);
      });
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (durationDays === "" || durationDays <= 0 || durationDays > 99) {
      setError("Podaj czas trwania w dniach (zakres 1–99).");
      return;
    }
    if (!clientName.trim()) {
      setError("Podaj imię / nazwę klienta.");
      return;
    }
    if (!selectedTestId) {
      setError("Wybierz test z listy.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSubmit({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        testId: selectedTestId.trim(),
        durationDays: durationDays,
      });
      onClose();
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Nie udało się zapisać zgłoszenia."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={saving ? undefined : onClose}
      />
      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl bg-white border border-[#d4af37]/40 shadow-xl p-6 relative"
        >
          <h2 className="text-lg font-semibold text-[#0f1e3a] mb-4">
            {isEdit ? "Edytuj zgłoszenie" : "Nowe zgłoszenie"}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Klient
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="np. Anna Kowalska"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="np. jan.kowlaski@email.com"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Test
              </label>
              <select
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white"
                value={selectedTestId}
                onChange={(e) => setSelectedTestId(e.target.value)}
                disabled={saving || testsLoading}
              >
                <option value="">
                  {testsLoading ? "Ładowanie testów…" : "Wybierz test z listy"}
                </option>
                {tests.map((t) => (
                  <option key={t.testId} value={t.testId}>
                    {t.testName}
                  </option>
                ))}
              </select>

              {selectedTestId && (
                <p className="mt-1 text-xs text-zinc-500">
                  Ilość par przekonań:{" "}
                  {
                    tests.find((t) => t.testId === selectedTestId)
                      ?.fpTestStatementDtoList.length
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Czas trwania (dni)
              </label>
              <input
                type="number"
                min={1}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                value={durationDays}
                onChange={(e) =>
                  setDurationDays(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="np. 7"
                disabled={saving}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={saving}
              variant="secondary"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={saving}
              variant="primary"
            >
              {saving ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Utwórz"}
            </Button>
          </div>

          {/* X w rogu */}
          <button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            disabled={saving}
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
        </form>
      </div>
    </div>
  );
}
