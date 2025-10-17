import { useEffect, useState } from "react";
import {
  CATEGORY_PL,
  ALL_CATEGORIES,
  fetchAllCategories,
  type StatementDefinitionDto,
  type StatementCategory,
} from "../apiDictionary";

function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium border border-neutral-300 shadow-sm hover:bg-neutral-50"
      title="Drukuj"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <path d="M6 14h12v8H6z"/>
      </svg>
      Drukuj
    </button>
  );
}

type DictState = {
  data: Partial<Record<StatementCategory, StatementDefinitionDto[]>>;
  loading: boolean;
  error: string | null;
};

export default function StatementsDictionaryPage() {
  const [state, setState] = useState<DictState>({ data: {}, loading: true, error: null });

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchAllCategories(); // 8 równoległych strzałów
        setState({ data: all, loading: false, error: null });
      } catch (e) {
        setState({ data: {}, loading: false, error: (e instanceof Error ? e.message : String(e)) });
      }
    })();
  }, []);

  return (
    <div style={{ padding: 8 }}>
      <style>{`
        :root { --card-border: #eee; --muted: #666; }
        h1, h2 { line-height: 1.2 }
        .card { border: 1px solid var(--card-border); border-radius: 10px; padding: 22px }
        .meta { font-size: 12px; color: var(--muted) }
        .pair-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px }
        .pill { border-radius: 6px; padding: 8px 10px; line-height: 1.35 }
        .pill--lim { background:#fef2f2; border:1px solid #fee2e2; color:#7f1d1d }
        .pill--sup { background:#ecfdf5; border:1px solid #d1fae5; color:#065f46 }

        /* większy, bardziej wyrazisty nagłówek kategorii */
        .category-header {
          font-size: 1.25rem;
          font-weight: 500;
          color: #1e293b;
          padding-bottom: 6px;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 10px;
          letter-spacing: 0.3px;
        }
        .title {
          font-size: 1.55rem;
          font-weight: 600;
          color: #084944ff;
          padding-bottom: 6px;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 10px;
          letter-spacing: 0.3px;
        }

        @media print {
          .no-print { display: none !important; }
          .card { break-inside: avoid; page-break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <PrintButton />
      </div>

      <h1 className="title">Słownik stwierdzeń</h1>

      {state.loading && <div>Wczytywanie…</div>}
      {state.error && <div style={{ color: "crimson" }}>Błąd: {state.error}</div>}

      {!state.loading && !state.error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr", // jedna szeroka kolumna
            gap: 20,
            maxWidth: 1100,
          }}
        >
          {ALL_CATEGORIES.map((cat) => {
            const list = state.data[cat] ?? [];
            const sorted = [...list].sort((a, b) => Number(a.statementId) - Number(b.statementId));

            return (
              <div key={cat} className="card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div className="category-header">{CATEGORY_PL[cat]}</div>
                  <div className="meta">{sorted.length} par</div>
                </div>

                <div className="pair-grid">
                  <div style={{ fontWeight: 700, color: "#7f1d1d" }}>Ograniczające</div>
                  <div style={{ fontWeight: 700, color: "#065f46" }}>Wspierające</div>

                  {sorted.map((def) => {
                    const limiting = def.statementTypeDefinitions.find((d) => d.statementType === "LIMITING");
                    const supporting = def.statementTypeDefinitions.find((d) => d.statementType === "SUPPORTING");
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

function FragmentRow({ limiting, supporting }: { limiting: string; supporting: string }) {
  return (
    <>
      <div className="pill pill--lim">{limiting}</div>
      <div className="pill pill--sup">{supporting}</div>
    </>
  );
}
