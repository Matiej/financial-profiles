import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Button from "../ui/Button";

export default function LoginPage() {
  const { initialized, authenticated, login } = useAuth();

  if (!initialized) {
    return <div className="p-6 text-brand-ink">Ładowanie...</div>;
  }

  if (initialized && authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-brand-mist/70 bg-white p-8 shadow-lg">

        {/* TYTUŁ */}
        <h1 className="mb-6 text-center text-2xl font-semibold text-brand-ink">
          Panel Finance Profiler
        </h1>

        {/* LOGO */}
        <div className="mb-4 flex justify-center">
          <img
            src="/logo.png"
            alt="Finance Profiler"
            className="h-30 w-auto opacity-90"
          />
        </div>

        {/* PRZYCISK */}
        <Button
          onClick={login}
          variant="primary"
          className="w-full py-2.5"
        >
          Zaloguj się
        </Button>

        {/* INFO O RODZAJACH DOSTĘPU */}
        <div className="mt-6 space-y-2.5 border-t border-zinc-100 pt-5">
          <p className="text-xs text-zinc-400 uppercase tracking-wide font-medium mb-3">
            Poziomy dostępu
          </p>

          <div className="flex items-start gap-2.5 text-sm text-zinc-600">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <span className="font-medium text-zinc-700">Administracyjny</span>
              <span className="text-zinc-400"> — </span>
              zarządzanie testami, wynikami, analizami i użytkownikami.
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-sm text-zinc-600">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="10" x2="16" y2="10" />
              <line x1="8" y1="14" x2="16" y2="14" />
              <line x1="8" y1="18" x2="11" y2="18" />
            </svg>
            <div>
              <span className="font-medium text-zinc-700">Kalkulatory</span>
              <span className="text-zinc-400"> — </span>
              praca z kalkulatorami numerologicznymi (imiona, daty).
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
