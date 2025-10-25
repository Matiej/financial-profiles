import { Link, NavLink } from "react-router-dom";
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
            ? "bg-brand-900 text-white border-brand-900"
            : "bg-white text-brand-900 border-brand-gold/60 hover:bg-neutral-50"
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="min-h-dvh bg-white">
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
                className="h-14 w-auto md:h-16"
              />
            </Link>

            <nav className="no-print flex items-center gap-3">
              <MenuLink to="/submissions" label="Profiler" />
              <MenuLink to="/dictionary" label="Słownik stwierdzeń" />
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
