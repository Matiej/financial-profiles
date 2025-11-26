import { useEffect, useState } from "react";
import type { FpTest } from "../../../types/fpTestTypes";
import { apiFpTests } from "../apiFpTests";
import { FpTestFormModal } from "./FpTestFormModal";
import { TestIdModal } from "./TestIdModal";

function formatCreatedAt(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FpTestListPage() {
  const [data, setData] = useState<FpTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FpTest | null>(null);

  // rozwinięte testy
  const [expandedTestIds, setExpandedTestIds] = useState<Set<string>>(
    () => new Set()
  );

  const [testIdModal, setTestIdModal] = useState<{
    open: boolean;
    testId: string | null;
  }>({
    open: false,
    testId: null,
  });

  const openTestIdModal = (testId: string) =>
    setTestIdModal({ open: true, testId });

  const closeTestIdModal = () => setTestIdModal({ open: false, testId: null });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await apiFpTests.list();
        setData(list);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Nie udało się pobrać listy testów."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleNew = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEdit = (test: FpTest) => {
    setEditTarget(test);
    setModalOpen(true);
  };

  const handleDelete = async (test: FpTest) => {
    const ok = window.confirm(
      `Czy na pewno chcesz usunąć test "${test.testName}"?`
    );
    if (!ok) return;

    try {
      await apiFpTests.delete(test.testId);
      setData((prev) => prev.filter((t) => t.testId !== test.testId));
    } catch (e: unknown) {
      alert(
        `Nie udało się usunąć testu: ${
          e instanceof Error ? e.message : String(e)
        }`
      );
    }
  };

  const handleSubmitForm = async (payload: {
    testName: string;
    descriptionBefore: string;
    descriptionAfter: string;
    statementKeys: string[];
  }) => {
    if (editTarget) {
      const updated = await apiFpTests.update(editTarget.testId, {
        testId: editTarget.testId,
        testName: payload.testName,
        descriptionBefore: payload.descriptionBefore,
        descriptionAfter: payload.descriptionAfter,
        statementKeys: payload.statementKeys,
      });

      setData((prev) =>
        prev.map((t) => (t.testId === updated.testId ? updated : t))
      );
    } else {
      const created = await apiFpTests.create({
        testName: payload.testName,
        descriptionBefore: payload.descriptionBefore,
        descriptionAfter: payload.descriptionAfter,
        statementKeys: payload.statementKeys,
      });

      setData((prev) => [created, ...prev]);
    }
  };

  const toggleExpanded = (testId: string) => {
    setExpandedTestIds((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-zinc-600">
        ⏳ Wczytywanie testów...
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
          Testy finansowego profilu
        </h1>
        <button
          onClick={handleNew}
          className="inline-flex items-center rounded-md bg-[#0f1e3a] text-white px-4 py-2 text-sm font-medium
                     hover:bg-[#0b172d] border border-[#d4af37]/60 shadow-sm"
        >
          + Nowy test
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">
          Brak testów. Kliknij „Nowy test”, aby utworzyć pierwszy.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-100">
                <th className="px-3 py-2">Nazwa testu</th>
                <th className="px-3 py-2">Liczba par przekonań</th>
                <th className="px-3 py-2">Utworzono</th>
                <th className="px-3 py-2 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {data.map((test) => {
                const count = test.fpTestStatementDtoList.length;
                const expanded = expandedTestIds.has(test.testId);

                return (
                  <>
                    <tr
                      key={test.testId}
                      className="bg-white shadow-sm hover:shadow-md transition rounded-md"
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(test.testId)}
                            className="text-zinc-500 hover:text-zinc-700"
                            aria-label={
                              expanded
                                ? "Zwiń szczegóły testu"
                                : "Rozwiń szczegóły testu"
                            }
                          >
                            <span className="inline-block text-xs">
                              {expanded ? "▾" : "▸"}
                            </span>
                          </button>
                          <span className="font-medium text-[#0f1e3a]">
                            {test.testName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-zinc-700">
                        {count}
                      </td>
                      <td className="px-3 py-2 text-sm text-zinc-700">
                        {formatCreatedAt(test.createdAt)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openTestIdModal(test.testId)}
                            className="inline-flex items-center rounded-md border border-[#0f1e3a] bg-white text-[#0f1e3a]
                 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 shadow-sm"
                          >
                            ID testu
                          </button>
                          <button
                            onClick={() => handleEdit(test)}
                            className="inline-flex items-center rounded-md border border-neutral-300 bg-white text-neutral-700
                                       px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 shadow-sm"
                          >
                            Edytuj
                          </button>

                          <button
                            onClick={() => handleDelete(test)}
                            className="inline-flex items-center rounded-md border border-red-200 bg-red-50 text-red-700
                                       px-3 py-1.5 text-xs font-medium hover:bg-red-100 shadow-sm"
                          >
                            Usuń
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expanded && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 pb-3 pt-0 text-sm bg-neutral-50 border border-zinc-100 rounded-b-md"
                        >
                          {count === 0 ? (
                            <div className="text-zinc-500 py-2">
                              Brak przypisanych par przekonań.
                            </div>
                          ) : (
                            <div className="py-2">
                              <div className="text-xs font-semibold text-zinc-500 mb-1">
                                Pary przekonań w tym teście:
                              </div>
                              <ul className="space-y-1">
                                {test.fpTestStatementDtoList.map((st) => (
                                  <li
                                    key={st.statementKey}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-zinc-200 rounded-md px-3 py-2"
                                  >
                                    <div className="text-sm text-[#0f1e3a]">
                                      {st.statementsDescription}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1 sm:mt-0 sm:ml-3">
                                      Kategoria: {st.statementsCategory}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <FpTestFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitForm}
        initial={editTarget}
      />
      <TestIdModal
        open={testIdModal.open}
        testId={testIdModal.testId}
        onClose={closeTestIdModal}
      />
    </div>
  );
}
