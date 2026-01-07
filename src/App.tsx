import { Link, NavLink, useLocation } from "react-router-dom";
import { AppRoutes } from "./app/router";
import { useAuth } from "./auth/AuthProvider";
import RouteAwareLockRefresher from "./app/RouteAwareLockRefresher";
import Button from "./ui/Button";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img src="/logo.png" alt="Finance Profiler" className="h-10 w-auto" />
      <div className="leading-tight">
        <div className="text-sm font-semibold text-slate-900">Finance Profiler</div>
        <div className="text-xs text-slate-600">Panel</div>
      </div>
    </Link>
  );
}

function TopNavLink({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Button
          variant={isActive ? "primary" : "secondary"}
          className={`min-w-[140px] ${isActive ? "!bg-brand-ink" : ""}`}
        >
          {label}
        </Button>
      )}
    </NavLink>
  );
}

function ProfilerMenu() {
  const itemClass = (isActive: boolean) =>
    [
      "block px-4 py-2",
      isActive ? "bg-brand-ink text-white" : "text-black hover:bg-zinc-100",
    ].join(" ");

  return (
    <div className="relative group">
      <Button variant="secondary" type="button" className="gap-2 min-w-[140px]">
        Profiler
        <svg
          className="h-4 w-4 opacity-70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Button>

      <div
        className="absolute left-0 mt-1 w-56 rounded-md border border-brand-mist/70 bg-white shadow-lg
                   py-1 text-sm z-50 hidden group-hover:block"
      >
        <NavLink to="/results" className={({ isActive }) => itemClass(isActive)}>
          Lista wyników (tally)
        </NavLink>
        <NavLink to="/scoring-results" className={({ isActive }) => itemClass(isActive)}>
          Wyniki scoring
        </NavLink>
        <NavLink to="/submissions" className={({ isActive }) => itemClass(isActive)}>
          Oczekujące zgłoszenia
        </NavLink>
        <NavLink to="/tests" className={({ isActive }) => itemClass(isActive)}>
          Testy
        </NavLink>
      </div>
    </div>
  );
}

function CalculatorMenu() {
  const itemClass = (isActive: boolean) =>
    [
      "block px-4 py-2",
      isActive ? "bg-brand-ink text-white" : "text-black hover:bg-zinc-100",
    ].join(" ");

  return (
    <div className="relative group">
      <Button variant="secondary" type="button" className="gap-2 min-w-[140px]">
        Kalkulatory
        <svg
          className="h-4 w-4 opacity-70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Button>

      <div
        className="absolute left-0 mt-1 w-48 rounded-md border border-brand-mist/70 bg-white shadow-lg
                   py-1 text-sm z-50 hidden group-hover:block"
      >
        <NavLink to="/calculators/names" className={({ isActive }) => itemClass(isActive)}>
          Imiona
        </NavLink>
        <NavLink to="/calculators/dates" className={({ isActive }) => itemClass(isActive)}>
          Daty
        </NavLink>
      </div>
    </div>
  );
}

export default function App() {
  const { initialized, authenticated, roles, logout } = useAuth();
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";

  const isAdmin = (roles ?? []).includes("BUSINESS_ADMIN") || (roles ?? []).includes("TECH_ADMIN");
  const isCalculatorUser = (roles ?? []).includes("CALCULATOR_USER");

  return (
    <div className="relative min-h-dvh">
      {/* Tło */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-brand-cloud" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-cloud via-white to-brand-mist/40" />

      {/* (opcjonalne) odświeżanie locków */}
      <RouteAwareLockRefresher />

      {/* Header tylko poza /login */}
      {!isLoginRoute && (
        <header className="sticky top-0 z-40 border-b border-brand-mist/70 bg-white/85 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
            <Brand />

            <nav className="flex items-center gap-2">
              {/* pokazuj menu dopiero jak auth zainicjalizowany (żeby nie mrugało) */}
              {initialized && authenticated && (
                <>
                  {isAdmin && <TopNavLink to="/dashboard" label="Dashboard" />}
                  {isAdmin && <ProfilerMenu />}
                  {(isAdmin || isCalculatorUser) && <CalculatorMenu />}
                  {isAdmin && <TopNavLink to="/dictionary" label="Słownik" />}
                  {isAdmin && <TopNavLink to="/users" label="Użytkownicy" />}
                </>
              )}
            </nav>

            <div className="flex items-center gap-2">
              {initialized && authenticated ? (
                <Button onClick={logout} variant="secondary">
                  Wyloguj
                </Button>
              ) : null}
            </div>
          </div>
        </header>
      )}

      <main className={isLoginRoute ? "px-4 py-10" : "mx-auto max-w-6xl px-4 py-6"}>
        <AppRoutes />
      </main>
    </div>
  );
}
