import { useState } from "react";
import Button from "../../../ui/Button";
import { useToast } from "../../../ui/Toast";
import { useAuth } from "../../../auth/AuthProvider";
import { apiAccount } from "../apiAccount";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({ open, onClose }: Props) {
  const { showToast } = useToast();
  const { logout } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      await apiAccount.deleteAccount();
      showToast("Konto zostało usunięte.", "success");
      logout();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Nie udało się usunąć konta.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setConfirmed(false);
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-red-200 shadow-xl p-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-red-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-red-900">
              Usuń konto
            </h2>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Czy na pewno chcesz usunąć swoje konto? Ta operacja jest{" "}
            <strong className="text-red-600">nieodwracalna</strong>. Wszystkie
            Twoje dane zostaną trwale usunięte.
          </p>

          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={loading}
              className="mt-0.5 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              Rozumiem, że ta operacja jest nieodwracalna i chcę usunąć swoje konto.
            </span>
          </label>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={handleClose}
              disabled={loading}
              variant="secondary"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={loading || !confirmed}
              variant="danger"
            >
              {loading ? "Usuwanie…" : "Usuń konto"}
            </Button>
          </div>

          {/* X */}
          <button
            type="button"
            aria-label="Zamknij"
            onClick={handleClose}
            disabled={loading}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
