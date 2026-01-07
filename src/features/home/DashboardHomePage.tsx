import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { apiSubmissions } from "../profiler/apiSubmissions";
import { apiProfiler } from "../profiler/apiProfiler";
import { apiDictionary } from "../dictionary/apiDictionary";
import { apiFpTests } from "../fptest/apiFpTests";
import { apiUsers } from "../users/apiUsers";

type Tile = {
  id: string;
  to: string;
  title: string;
  description: string;
  category: "profiler" | "dictionary" | "calculator" | "users";
  badge?: string;
  icon?: ReactNode;
};

const TILES: Tile[] = [
  {
    id: "results",
    to: "/results",
    title: "Lista wyników (tally)",
    description:
      "Podgląd wszystkich zakończonych testów w wersji Tally, wysyłka do analizy AI, dostęp do raportów.",
    category: "profiler",
    badge: "Profiler",
  },
  {
    id: "results-scoring",
    to: "/scoring-results",
    title: "Lista wyników scoring",
    description:
      "Podgląd wyników nowego testu scoringowego – rozkład odpowiedzi i style w jednej przestrzeni.",
    category: "profiler",
    badge: "Profiler",
  },
  {
    id: "submissions",
    to: "/submissions",
    title: "Oczekujące zgłoszenia",
    description:
      "Tworzenie linków do testów, czas ważności, status wypełnienia przez klienta.",
    category: "profiler",
    badge: "Profiler",
  },
  {
    id: "tests",
    to: "/tests",
    title: "Testy finansowego profilu",
    description:
      "Zarządzanie testami: nazwy, opisy, przypisane pary przekonań.",
    category: "profiler",
    badge: "Profiler",
  },
  {
    id: "dictionary",
    to: "/dictionary",
    title: "Słownik stwierdzeń",
    description:
      "Pełna lista par przekonań: ograniczające i wspierające, z podziałem na kategorie.",
    category: "dictionary",
    badge: "Słownik",
  },
  {
    id: "calc-names",
    to: "/calculators/names",
    title: "Kalkulator – nazwy",
    description:
      "Wibracja nazwy, samogłoski (dusza) i spółgłoski (ekspresja), wizualizacja liter.",
    category: "calculator",
    badge: "Kalkulator",
  },
  {
    id: "calc-dates",
    to: "/calculators/dates",
    title: "Kalkulator – daty",
    description:
      "Rok osobisty, rok światowy, miesiąc osobisty i wibracje dnia dla wybranej daty.",
    category: "calculator",
    badge: "Kalkulator",
  },
  {
    id: "users",
    to: "/users",
    title: "Zarządzanie użytkownikami",
    description:
      "Tworzenie, edycja i zarządzanie kontami użytkowników systemu, ustawienia uprawnień.",
    category: "users",
    badge: "Użytkownicy",
  },
];

type DashboardSummary = {
  submissionsOpen: number;
  submissionsDone: number;
  resultsTotal: number;
  resultsAnalyzed: number;
  pairsTotal: number;
  testsTotal: number;
  scoringResultsTotal: number;
  usersTotal: number;
};

export default function DashboardHomePage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          submissions,
          profilerList,
          dictionaryData,
          fpTests,
          scoringList,
          usersList,
        ] = await Promise.all([
          apiSubmissions.list(),
          apiProfiler.list(),
          apiDictionary.all(),
          apiFpTests.list(),
          apiProfiler.scoringList(),
          apiUsers.listUsers(),
        ]);

        const submissionsOpen = submissions.filter(
          (s) => s.status === "OPEN"
        ).length;
        const submissionsDone = submissions.filter(
          (s) => s.status === "DONE"
        ).length;

        const resultsTotal = profilerList.length;
        const resultsAnalyzed = profilerList.filter(
          (r) => r.isAnalyzed
        ).length;

        const pairsTotal = Object.values(dictionaryData).reduce(
          (acc, list) => acc + (list?.length ?? 0),
          0
        );

        const testsTotal = fpTests.length;
        const scoringResultsTotal = scoringList.length;
        const usersTotal = usersList.length;

        setSummary({
          submissionsOpen,
          submissionsDone,
          resultsTotal,
          resultsAnalyzed,
          pairsTotal,
          testsTotal,
          scoringResultsTotal,
          usersTotal,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const profilerTiles = TILES.filter((t) => t.category === "profiler");
  const dictionaryTiles = TILES.filter((t) => t.category === "dictionary");
  const calculatorTiles = TILES.filter((t) => t.category === "calculator");
  const usersTiles = TILES.filter((t) => t.category === "users");

  // Podział Profiler na dwa wiersze:
  const profilerRow1 = profilerTiles.filter((t) =>
    ["results", "results-scoring"].includes(t.id)
  );
  const profilerRow2 = profilerTiles.filter((t) =>
    ["submissions", "tests"].includes(t.id)
  );

  const getMeta = (id: string): string | null => {
    if (!summary) return null;

    switch (id) {
      case "results":
        return `${summary.resultsTotal} wyników, ${summary.resultsAnalyzed} z analizą AI`;
      case "results-scoring":
        return `${summary.scoringResultsTotal} wyników scoring`;
      case "submissions":
        return `${summary.submissionsOpen} oczekujące, ${summary.submissionsDone} zakończone`;
      case "tests":
        return `${summary.testsTotal} zdefiniowanych testów`;
      case "dictionary":
        return `${summary.pairsTotal} par przekonań`;
      case "users":
        return `${summary.usersTotal} użytkowników w systemie`;
      default:
        return null;
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-2 sm:px-4 py-6">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70
      bg-[radial-gradient(circle_at_90%_0%,_#f4ecff_0,_transparent_60%),
          radial-gradient(circle_at_80%_100%,_#e0f2fe_0,_transparent_60%)]"
      />

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#0f1e3a] mb-2">
          Panel główny systemu testów
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 max-w-3xl">
          Tutaj zaczynasz pracę z klientami. Wybierz sekcję, do której chcesz
          przejść – wyniki testów, zgłoszenia, słownik stwierdzeń albo
          kalkulatory numerologiczne.
        </p>
        {error && (
          <p className="mt-2 text-xs text-red-600">
            Nie udało się załadować podsumowania: {error}
          </p>
        )}
      </header>

      <div className="space-y-6">
        {/* Profiler */}
        <section>
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold text-[#0f1e3a]">
              Profiler i testy
            </h2>
            <span className="text-xs text-zinc-500">
              Zarządzanie testami, zgłoszeniami i analizami AI
            </span>
          </div>

          {/* Wiersz 1: lista wyników tally + lista wyników scoring */}
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            {profilerRow1.map((tile) => (
              <DashboardTile
                key={tile.id}
                tile={tile}
                meta={getMeta(tile.id)}
                loading={loading}
              />
            ))}
          </div>

          {/* Wiersz 2: oczekujące zgłoszenia + testy */}
          <div className="grid gap-4 md:grid-cols-2">
            {profilerRow2.map((tile) => (
              <DashboardTile
                key={tile.id}
                tile={tile}
                meta={getMeta(tile.id)}
                loading={loading}
              />
            ))}
          </div>
        </section>

        {/* Słownik */}
        <section>
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold text-[#0f1e3a]">
              Słownik stwierdzeń
            </h2>
            <span className="text-xs text-zinc-500">
              Podgląd i praca z pełnym słownikiem przekonań
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {dictionaryTiles.map((tile) => (
              <DashboardTile
                key={tile.id}
                tile={tile}
                meta={getMeta(tile.id)}
                loading={loading}
              />
            ))}
          </div>
        </section>

        {/* Kalkulatory */}
        <section>
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold text-[#0f1e3a]">
              Kalkulatory numerologiczne
            </h2>
          <span className="text-xs text-zinc-500">
              Szybkie narzędzia do pracy indywidualnej
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {calculatorTiles.map((tile) => (
              <DashboardTile
                key={tile.id}
                tile={tile}
                meta={null} // na razie bez liczb
                loading={loading}
              />
            ))}
          </div>
        </section>

        {/* Użytkownicy */}
        <section>
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h2 className="text-lg font-semibold text-[#0f1e3a]">
              Zarządzanie użytkownikami
            </h2>
            <span className="text-xs text-zinc-500">
              Tworzenie i edycja kont użytkowników
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {usersTiles.map((tile) => (
              <DashboardTile
                key={tile.id}
                tile={tile}
                meta={getMeta(tile.id)}
                loading={loading}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardTile({
  tile,
  meta,
  loading,
}: {
  tile: Tile;
  meta: string | null;
  loading: boolean;
}) {
  return (
    <Link
      to={tile.to}
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50
                 px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:shadow-md
                 hover:bg-slate-100 hover:border-slate-300 transition-all"
    >
      {tile.badge && (
        <span
          className="inline-flex items-center self-start rounded-full border border-brand-berry/20
                         bg-brand-berry/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-brand-berry mb-2"
        >
          {tile.badge}
        </span>
      )}

      <h3 className="text-base sm:text-[17px] font-semibold text-[#0f1e3a] mb-1">
        {tile.title}
      </h3>

      <p className="text-xs sm:text-sm text-zinc-600 flex-1">
        {tile.description}
      </p>

      {meta && (
        <p
          className="mt-2 text-[11px] text-slate-600
               bg-slate-100/50 border border-slate-200
               rounded-md px-2 py-1 w-fit"
        >
          {loading ? "Ładowanie podsumowania…" : meta}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-[#0f1e3a]">
        <span className="font-medium">Przejdź do widoku</span>
        <span className="inline-flex items-center gap-1">
          <span className="hidden sm:inline">Otwórz</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M9 7H17V15" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
