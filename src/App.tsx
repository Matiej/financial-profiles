import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AppRoutes } from "./app/router";
import { useAuth } from "./auth/AuthProvider";
import Button from "./ui/Button";
import AccountSettingsDropdown from "./features/account/components/AccountSettingsDropdown";
import bgImage from "./assets/images/background.jpeg";

function Brand() {
  return (
    <Link
      to="/"
      className="text-sm font-normal tracking-wide text-slate-800 hover:text-brand-berry transition-colors"
    >
      Agnieszka Kotlonek Hipnoza w Biznesie
    </Link>
  );
}

function TopNavLink({ to, label }: { to: string; label: string }) {
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
        <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Button>

      <div className="absolute left-0 mt-1 w-56 rounded-md border border-brand-mist/70 bg-white shadow-lg py-1 text-sm z-50 hidden group-hover:block">
        <NavLink to="/scoring-results" className={({ isActive }) => itemClass(isActive)}>
          Wyniki testów
        </NavLink>
        <NavLink to="/submissions" className={({ isActive }) => itemClass(isActive)}>
          Nowy test
        </NavLink>
        <NavLink to="/tests" className={({ isActive }) => itemClass(isActive)}>
          Edycja testów
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
        <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Button>

      <div className="absolute left-0 mt-1 w-48 rounded-md border border-brand-mist/70 bg-white shadow-lg py-1 text-sm z-50 hidden group-hover:block">
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

// Mobile menu — płaskie linki, bez hover dropdownów
function MobileMenu({
  isAdmin,
  isCalculatorUser,
  logout,
  onClose,
}: {
  isAdmin: boolean;
  isCalculatorUser: boolean;
  logout: () => void;
  onClose: () => void;
}) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "block px-4 py-3 text-sm font-medium rounded-lg",
      isActive
        ? "bg-brand-ink text-white"
        : "text-slate-700 hover:bg-zinc-100",
    ].join(" ");

  const sectionLabel = (text: string) => (
    <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
      {text}
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
          <span className="text-sm font-semibold text-slate-800">Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100"
            aria-label="Zamknij menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Linki */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {isAdmin && (
            <>
              <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
                Dashboard
              </NavLink>

              {sectionLabel("Profiler")}
              <NavLink to="/scoring-results" className={linkClass} onClick={onClose}>
                Wyniki testów
              </NavLink>
              <NavLink to="/submissions" className={linkClass} onClick={onClose}>
                Nowy test
              </NavLink>
              <NavLink to="/tests" className={linkClass} onClick={onClose}>
                Edycja testów
              </NavLink>
            </>
          )}

          {(isAdmin || isCalculatorUser) && (
            <>
              {sectionLabel("Kalkulatory")}
              <NavLink to="/calculators/names" className={linkClass} onClick={onClose}>
                Imiona
              </NavLink>
              <NavLink to="/calculators/dates" className={linkClass} onClick={onClose}>
                Daty
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              {sectionLabel("Administracja")}
              <NavLink to="/dictionary" className={linkClass} onClick={onClose}>
                Słownik
              </NavLink>
              <NavLink to="/users" className={linkClass} onClick={onClose}>
                Użytkownicy
              </NavLink>
            </>
          )}

          {sectionLabel("Konto")}
          <NavLink to="/account" className={linkClass} onClick={onClose}>
            Ustawienia konta
          </NavLink>
        </nav>

        {/* Wyloguj */}
        <div className="p-3 border-t border-zinc-100">
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full px-4 py-2.5 text-sm font-medium text-left rounded-lg text-red-600 hover:bg-red-50"
          >
            Wyloguj się
          </button>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const { initialized, authenticated, roles, logout } = useAuth();
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = (roles ?? []).includes("BUSINESS_ADMIN") || (roles ?? []).includes("TECH_ADMIN");
  const isCalculatorUser = (roles ?? []).includes("CALCULATOR_USER");

  return (
    <div className="relative min-h-dvh">
      {/* Tło – zdjęcie z chmurami, wyśrodkowane, stałe na każdej zakładce */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-brand-cloud" />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-white/55" />

      {/* Header tylko poza /login */}
      {!isLoginRoute && (
        <header className="sticky top-0 z-40 border-b border-brand-mist/70 bg-white/85 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
            <Brand />

            {/* Desktop nav */}
            {initialized && authenticated && (
              <nav className="hidden md:flex items-center gap-2">
                {isAdmin && <TopNavLink to="/dashboard" label="Dashboard" />}
                {isAdmin && <ProfilerMenu />}
                {(isAdmin || isCalculatorUser) && <CalculatorMenu />}
                {isAdmin && <TopNavLink to="/dictionary" label="Słownik" />}
                {isAdmin && <TopNavLink to="/users" label="Użytkownicy" />}
              </nav>
            )}

            <div className="flex items-center gap-3">
              {initialized && authenticated && (
                <>
                  {/* Desktop: account + wyloguj */}
                  <div className="hidden md:flex items-center gap-3">
                    <AccountSettingsDropdown />
                    <Button onClick={logout} variant="secondary">
                      Wyloguj
                    </Button>
                  </div>

                  {/* Mobile: hamburger */}
                  <button
                    className="md:hidden p-2 rounded-md text-slate-700 hover:bg-zinc-100"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Otwórz menu"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Mobile menu panel */}
      {mobileOpen && initialized && authenticated && (
        <MobileMenu
          isAdmin={isAdmin}
          isCalculatorUser={isCalculatorUser}
          logout={logout}
          onClose={() => setMobileOpen(false)}
        />
      )}

      <main className={isLoginRoute ? "px-4 py-10" : "mx-auto max-w-6xl px-4 py-6"}>
        <AppRoutes />
      </main>
    </div>
  );
}
