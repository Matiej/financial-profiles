import "./App.css";
import { Routes, Route, Navigate, Link, NavLink } from "react-router-dom";
import ListPage from "./pages/ListPage";
import DetailsPage from "./pages/DetailsPage";
import StatementsDictionaryPage from "./pages/StatementsDictionaryPage";

function App() {
  return (
    <div className="min-h-dvh bg-white">
      {/* HEADER */}
      <header className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="https://agnieszkakotlonek.pl/"
              className="block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/logo.png"
                alt="Agnieszka Kotlonek – Hipnoterapia w Biznesie"
                className="h-12 w-auto"
              />
            </Link>

            {/* MENU */}
            <nav className="no-print flex items-center gap-2">
              <MenuLink to="/submissions" label="Profiler" />
              <MenuLink to="/dictionary" label="Słownik stwierdzeń" />
            </nav>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/submissions" replace />} />
          <Route path="/submissions" element={<ListPage />} />
          <Route path="/submissions/:submissionId" element={<DetailsPage />} />
          <Route path="/dictionary" element={<StatementsDictionaryPage />} />
          <Route path="*" element={<div className="p-6">404</div>} />
        </Routes>
      </main>
    </div>
  );
}

function MenuLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center rounded-md px-4 py-2 text-sm border ${
          isActive
            ? "bg-[#0f1e3a] text-white border-[#0f1e3a]"
            : "bg-white text-[#0f1e3a] border-[#d4af37]/60 hover:bg-neutral-50"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default App;
