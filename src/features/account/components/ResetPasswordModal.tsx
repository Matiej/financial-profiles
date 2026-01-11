import { useState } from "react";
import Button from "../../../ui/Button";
import { useToast } from "../../../ui/Toast";
import { apiAccount } from "../apiAccount";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ResetPasswordModal({ open, onClose }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await apiAccount.requestPasswordReset();
      showToast("Wysłano maila do resetu hasła.", "success");
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Nie udało się wysłać maila.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6 relative">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Reset hasła
          </h2>

          <p className="text-sm text-slate-600 mb-6">
            Wyślemy na Twój adres e-mail link do ustawienia nowego hasła.
          </p>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              variant="secondary"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              variant="primary"
            >
              {loading ? "Wysyłanie…" : "Wyślij link"}
            </Button>
          </div>

          {/* X */}
          <button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
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
