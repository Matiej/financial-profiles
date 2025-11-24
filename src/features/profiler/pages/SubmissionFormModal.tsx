import { useEffect, useState } from "react";
import type { Submission } from "../../../types/submissionTypes";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    clientName: string;
    clientEmail: string;
    testName: string;
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
  const [testName, setTestName] = useState("");
  const [durationDays, setDurationDays] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (initial) {
      setClientName(initial.clientName ?? "");
      setClientEmail(initial.clientEmail ?? "");
      setTestName(initial.testName ?? "");
      // przy edycji szacujemy startową wartość z remainingSeconds
      const approxDays = Math.max(1, Math.ceil(initial.remainingSeconds / 60));
      setDurationDays(approxDays);
    } else {
      setClientName("");
      setClientEmail("");
      setTestName("");
      setDurationDays("");
    }
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
    if (!testName.trim()) {
      setError("Podaj nazwę testu.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSubmit({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        testName: testName.trim(),
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
                Nazwa testu
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="np. Profil finansowy 8 stylów"
                disabled={saving}
              />
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
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex items-center rounded-md border border-neutral-300 bg-white text-neutral-700
                         px-4 py-2 text-sm font-medium hover:bg-neutral-50 shadow-sm"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-md bg-[#0f1e3a] text-white px-4 py-2 text-sm font-medium
                         hover:bg-[#0b172d] border border-[#d4af37]/60 shadow-sm disabled:opacity-70"
            >
              {saving ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Utwórz"}
            </button>
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
