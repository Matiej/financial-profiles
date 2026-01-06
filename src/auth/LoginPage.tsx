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
        <h1 className="mb-3 text-center text-2xl font-semibold text-brand-ink">
          Panel Finance Profiler
        </h1>

        {/* OPIS GŁÓWNY */}
        <p className="mb-6 text-center text-sm text-zinc-600">
          Zaloguj się, aby uzyskać dostęp do systemu Finance Profiler
          zgodnie z przypisanym zakresem uprawnień.
        </p>

        {/* INFO O RODZAJACH DOSTĘPU */}
        <div className="mb-6 space-y-3 text-sm">
          <div className="rounded-lg border border-brand-mist/50 bg-brand-cloud/40 p-3">
            <div className="font-medium text-brand-ink">
              Dostęp administracyjny
            </div>
            <div className="text-zinc-600 text-xs mt-1">
              Zarządzanie testami, wynikami, analizami oraz użytkownikami systemu.
            </div>
          </div>

          <div className="rounded-lg border border-brand-mist/50 bg-brand-cloud/40 p-3">
            <div className="font-medium text-brand-ink">
              Dostęp do kalkulatorów
            </div>
            <div className="text-zinc-600 text-xs mt-1">
              Praca wyłącznie z kalkulatorami numerologicznymi
              (imiona, daty) bez dostępu do panelu administracyjnego.
            </div>
          </div>
        </div>

        {/* LOGO NAD PRZYCISKIEM */}
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
      </div>
    </div>
  );
}
