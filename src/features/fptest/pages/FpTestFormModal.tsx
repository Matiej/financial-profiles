import { useEffect, useState } from "react";
import type { FpTest, FpTestStatement } from "../../../types/fpTestTypes";
import { apiFpTests } from "..//apiFpTests";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    testName: string;
    descriptionBefore: string;
    descriptionAfter: string;
    statementKeys: string[];
  }) => Promise<void> | void;
  initial?: FpTest | null; // jeśli edycja
};

export function FpTestFormModal({ open, onClose, onSubmit, initial }: Props) {
  const isEdit = !!initial;

  const [testName, setTestName] = useState("");
  const [descriptionBefore, setDescriptionBefore] = useState("");
  const [descriptionAfter, setDescriptionAfter] = useState("");
  const [availableStatements, setAvailableStatements] = useState<
    FpTestStatement[]
  >([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [loadingStatements, setLoadingStatements] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setError(null);
    setLoadingStatements(true);

    apiFpTests
      .listStatements()
      .then((list) => {
        setAvailableStatements(list);

        if (initial) {
          setTestName(initial.testName ?? "");
          setDescriptionBefore(initial.descriptionBefore ?? "");
          setDescriptionAfter(initial.descriptionAfter ?? "");
          setSelectedKeys(
            initial.fpTestStatementDtoList.map((s) => s.statementKey)
          );
        } else {
          setTestName("");
          setDescriptionBefore("");
          setDescriptionAfter("");
          setSelectedKeys([]);
        }
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error
            ? e.message
            : "Nie udało się pobrać listy przekonań."
        );
      })
      .finally(() => {
        setLoadingStatements(false);
      });
  }, [open, initial]);

  const toggleStatement = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const allSelected =
    availableStatements.length > 0 &&
    selectedKeys.length === availableStatements.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(availableStatements.map((s) => s.statementKey));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!testName.trim()) {
      setError("Podaj nazwę testu.");
      return;
    }

    if (selectedKeys.length === 0) {
      setError("Wybierz przynajmniej jedną parę przekonań.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onSubmit({
        testName: testName.trim(),
        descriptionBefore: descriptionBefore.trim(),
        descriptionAfter: descriptionAfter.trim(),
        statementKeys: selectedKeys,
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Nie udało się zapisać testu.");
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
          className="w-full max-w-2xl rounded-2xl bg-white border border-[#d4af37]/40 shadow-xl p-6 relative"
        >
          <h2 className="text-lg font-semibold text-[#0f1e3a] mb-4">
            {isEdit ? "Edytuj test" : "Nowy test"}
          </h2>

          <div className="space-y-4">
            {/* nazwa testu */}
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

            {/* opis przed */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Opis przed testem
              </label>
              <textarea
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm min-h-[80px]"
                value={descriptionBefore}
                onChange={(e) => setDescriptionBefore(e.target.value)}
                placeholder="Tekst widoczny przed rozpoczęciem testu..."
                disabled={saving}
              />
            </div>

            {/* opis po */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Opis po zakończeniu testu
              </label>
              <textarea
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm min-h-[80px]"
                value={descriptionAfter}
                onChange={(e) => setDescriptionAfter(e.target.value)}
                placeholder="Tekst widoczny po zakończeniu testu..."
                disabled={saving}
              />
            </div>

            {/* wybór statementów */}
            {/* <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-zinc-700">
                  Pary przekonań w teście
                </label>
                <span className="text-xs text-zinc-600">
                  Wybrane pary:{" "}
                  <span className="font-semibold">{selectedKeys.length}</span>
                </span>
              </div> */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <label className="block text-sm font-medium text-zinc-700">
                    Pary przekonań w teście
                  </label>

                  <label className="inline-flex items-center gap-1 text-xs text-zinc-600">
                    <input
                      type="checkbox"
                      className="rounded border-zinc-300"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      disabled={
                        saving ||
                        loadingStatements ||
                        availableStatements.length === 0
                      }
                    />
                    <span>
                      {allSelected ? "Odznacz wszystkie" : "Zaznacz wszystkie"}
                    </span>
                  </label>
                </div>

                <span className="text-xs text-zinc-600">
                  Wybrane pary:{" "}
                  <span className="font-semibold">{selectedKeys.length}</span>
                </span>
              </div>

              <div className="border border-zinc-200 rounded-md max-h-64 overflow-y-auto bg-neutral-50">
                {loadingStatements ? (
                  <div className="p-3 text-sm text-zinc-500">
                    Ładowanie listy przekonań…
                  </div>
                ) : availableStatements.length === 0 ? (
                  <div className="p-3 text-sm text-zinc-500">
                    Brak dostępnych przekonań.
                  </div>
                ) : (
                  <ul className="divide-y divide-zinc-200 text-sm">
                    {availableStatements.map((st) => {
                      const checked = selectedKeys.includes(st.statementKey);
                      return (
                        <li
                          key={st.statementKey}
                          className="flex items-start gap-2 px-3 py-2 hover:bg-white"
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={checked}
                            onChange={() => toggleStatement(st.statementKey)}
                            disabled={saving}
                          />
                          <div>
                            <div className="font-medium text-[#0f1e3a]">
                              {st.statementsDescription}
                            </div>
                            <div className="text-xs text-zinc-500">
                              Kategoria: {st.statementsCategory}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
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
