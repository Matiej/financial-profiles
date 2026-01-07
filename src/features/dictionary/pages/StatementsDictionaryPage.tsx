import { useEffect, useState } from "react";
import { CATEGORY_PL, ALL_CATEGORIES, apiDictionary } from "../apiDictionary";
import type {
  StatementCategory,
  StatementDefinitionDto,
} from "../../../types/profilerTypes";
import Button from "../../../ui/Button";
// import type { StatementDefinitionDto, StatementCategory } from "@/types/profilerTypes";

function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      variant="secondary"
      className="no-print gap-2"
      title="Drukuj"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v8H6z" />
      </svg>
      Drukuj
    </Button>
  );
}

type DictState = {
  data: Partial<Record<StatementCategory, StatementDefinitionDto[]>>;
  loading: boolean;
  error: string | null;
};

function FragmentRow({
  limiting,
  supporting,
}: {
  limiting: string;
  supporting: string;
}) {
  return (
    <>
      <div className="rounded-md px-3 py-2 border text-sm leading-tight bg-rose-50 border-rose-200 text-rose-900">
        {limiting}
      </div>
      <div className="rounded-md px-3 py-2 border text-sm leading-tight bg-emerald-50 border-emerald-200 text-emerald-800">
        {supporting}
      </div>
    </>
  );
}

export default function StatementsDictionaryPage() {
  const [state, setState] = useState<DictState>({
    data: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const all = await apiDictionary.all();
        setState({ data: all, loading: false, error: null });
      } catch (e) {
        setState({
          data: {},
          loading: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    })();
  }, []);

  return (
    <div className="p-2">
      <div className="no-print flex justify-end mb-2">
        <PrintButton />
      </div>

      <h1 className="text-[1.55rem] font-semibold text-[#0f1e3a] pb-1 border-b border-zinc-200 mb-2 tracking-wide text-center">
        Słownik stwierdzeń
      </h1>

      {state.loading && <div>Wczytywanie…</div>}
      {state.error && <div className="text-red-600">Błąd: {state.error}</div>}

      {!state.loading && !state.error && (
        <div className="grid grid-cols-1 gap-5 max-w-[1100px]">
          {ALL_CATEGORIES.map((cat) => {
            const list = state.data[cat] ?? [];
            const sorted = [...list].sort(
              (a, b) => Number(a.statementId) - Number(b.statementId)
            );

            return (
              <div
                key={cat}
                className="avoid-break border border-zinc-200 rounded-xl p-5 bg-white"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[1.25rem] font-medium text-slate-800 pb-1 border-b-2 border-slate-200 mb-2">
                    {CATEGORY_PL[cat]}
                  </div>
                  <div className="text-xs text-zinc-600">
                    {sorted.length} par
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="font-bold text-rose-900">Ograniczające</div>
                  <div className="font-bold text-emerald-800">Wspierające</div>

                  {sorted.map((def) => {
                    const limiting = def.statementTypeDefinitions.find(
                      (d) => d.statementType === "LIMITING"
                    );
                    const supporting = def.statementTypeDefinitions.find(
                      (d) => d.statementType === "SUPPORTING"
                    );
                    return (
                      <FragmentRow
                        key={def.statementId}
                        limiting={limiting?.statementDescription || "—"}
                        supporting={supporting?.statementDescription || "—"}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
