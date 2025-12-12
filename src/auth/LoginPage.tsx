import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
  const { initialized, authenticated, login } = useAuth();

  if (!initialized) {
    return <div className="p-6">Ładowanie...</div>;
  }

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-xl border border-zinc-200 bg-white/80 p-8 shadow-sm">
        <h1 className="mb-3 text-2xl font-semibold text-[#0f1e3a]">
          Panel administracyjny Finance Profiler
        </h1>
        <p className="mb-6 text-sm text-zinc-700">
          To jest przestrzeń do pracy z testami, wynikami i kalkulatorami
          numerologicznymi dla Twoich klientek. Zaloguj się, aby uzyskać dostęp
          do panelu administracyjnego.
        </p>
        <button
          onClick={login}
          className="w-full rounded-md bg-[#0f1e3a] px-4 py-2.5 text-sm font-medium text-white
                     hover:bg-[#172a4d] transition-colors"
        >
          Zaloguj się
        </button>
      </div>
    </div>
  );
}
