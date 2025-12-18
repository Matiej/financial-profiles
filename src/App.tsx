import { Link, NavLink } from "react-router-dom";
import { NavLockCountdown } from "./features/analyses/AnalysisLockContext";
import RouteAwareLockRefresher from "./app/RouteAwareLockRefresher";
import { useAuth } from "./auth/AuthProvider";
import { AppRoutes } from "./app/router";

function MenuLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "inline-flex items-center rounded-md border transition-colors",
          "px-5 py-2.5 text-[15px] font-medium",
          isActive
            ? "bg-[#0f1e3a] text-white border-[#0f1e3a]"
            : "bg-white text-[#0f1e3a] border-[#d4af37]/60 hover:bg-neutral-50",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

function ProfilerMenu() {
  return (
    <div className="relative group">
      <button
        className="inline-flex items-center rounded-md border transition-colors
                   px-5 py-2.5 text-[15px] font-medium
                   bg-white text-[#0f1e3a] border-[#d4af37]/60 hover:bg-neutral-50"
        type="button"
      >
        Profiler
        <svg
          className="ml-2 h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 8l4 4 4-4" />
        </svg>
      </button>

      <div
        className="absolute right-0 mt-1 w-56 rounded-md border border-zinc-200 bg-white shadow-lg
                   py-1 text-sm z-50 hidden group-hover:block"
      >
        <NavLink
          to="/results"
          className={({ isActive }) =>
            [
              "block px-4 py-2",
              isActive
                ? "bg-[#0f1e3a] text-white"
                : "text-[#0f1e3a] hover:bg-neutral-50",
            ].join(" ")
          }
        >
          Lista wyników (tally)
        </NavLink>

        <NavLink
          to="/scoring-results"
          className={({ isActive }) =>
            [
              "block px-4 py-2",
              isActive
                ? "bg-[#0f1e3a] text-white"
                : "text-[#0f1e3a] hover:bg-neutral-50",
            ].join(" ")
          }
        >
          Wyniki scoring
        </NavLink>

        <NavLink
          to="/submissions"
          className={({ isActive }) =>
            [
              "block px-4 py-2",
              isActive
                ? "bg-[#0f1e3a] text-white"
                : "text-[#0f1e3a] hover:bg-neutral-50",
            ].join(" ")
          }
        >
          Oczekujące zgłoszenia
        </NavLink>

        <NavLink
          to="/tests"
          className={({ isActive }) =>
            [
              "block px-4 py-2",
              isActive
                ? "bg-[#0f1e3a] text-white"
                : "text-[#0f1e3a] hover:bg-neutral-50",
            ].join(" ")
          }
        >
          Testy
        </NavLink>
      </div>
    </div>
  );
}

function CalculatorMenu() {
  return (
    <div className="relative group">
      <button
        className="inline-flex items-center rounded-md border transition-colors
                   px-5 py-2.5 text-[15px] font-medium
                   bg-white text-[#0f1e3a] border-[#d4af37]/60 hover:bg-neutral-50"
        type="button"
      >
        Kalkulatory
        <svg
          className="ml-2 h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 8l4 4 4-4" />
        </svg>
      </button>

      <div
        className="absolute right-0 mt-1 w-48 rounded-md border border-zinc-200 bg-white shadow-lg
                   py-1 text-sm z-50 hidden group-hover:block"
      >
        <NavLink
          to="/calculators/names"
          className={({ isActive }) =>
            [
              "block px-4 py-2",
              isActive
                ? "bg-[#0f1e3a] text-white"
                : "text-[#0f1e3a] hover:bg-neutral-50",
            ].join(" ")
          }
        >
          Nazwy
        </NavLink>
        <NavLink
          to="/calculators/dates"
          className={({ isActive }) =>
            [
              "block px-4 py-2",
              isActive
                ? "bg-[#0f1e3a] text-white"
                : "text-[#0f1e3a] hover:bg-neutral-50",
            ].join(" ")
          }
        >
          Daty
        </NavLink>
      </div>
    </div>
  );
}

export default function App() {
  const { roles } = useAuth();
  const { authenticated, logout } = useAuth();
  const isAdmin = roles.some((r: string) =>
    ["BUSINESS_ADMIN", "TECH_ADMIN"].includes(r)
  );

  const isCalculatorUser = roles.includes("CALCULATOR_USER") && !isAdmin;

  return (
    <div className="relative min-h-dvh">
      {/* TŁO APLIKACJI */}
      <div
        className="pointer-events-none absolute inset-0 -z-10
                   bg-gradient-to-br from-[#ebf3e2] via-white to-[#e2ebd5]"
      />

      <RouteAwareLockRefresher />

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-6 py-4">
            <Link
              to="https://agnieszkakotlonek.pl/"
              className="block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/logo.png"
                alt="Agnieszka Kotlonek – Hipnoterapia w Biznesie"
                className="h-20 w-auto md:h-23 -my-4"
              />
            </Link>

            <nav className="no-print flex items-center gap-3">
              <NavLockCountdown />

              {isAdmin && (
                <>
                  <MenuLink to="/" label="Panel główny" />
                  <ProfilerMenu />
                  <MenuLink to="/dictionary" label="Słownik stwierdzeń" />
                  <MenuLink to="/users" label="Użytkownicy" />
                </>
              )}

              {}

              {(isAdmin || isCalculatorUser) && <CalculatorMenu />}
              {authenticated && (
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center rounded-md border px-4 py-2 text-[14px] font-medium
                             bg-white text-[#0f1e3a] border-[#d4af37]/60 hover:bg-neutral-50"
                >
                  Wyloguj
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <AppRoutes />
      </main>
    </div>
  );
}
