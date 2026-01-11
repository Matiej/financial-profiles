import { useEffect, useState } from "react";
import type { AccountResponse, UpdateProfilePayload } from "../../../types/accountTypes";
import Button from "../../../ui/Button";
import { useToast } from "../../../ui/Toast";
import { apiAccount } from "../apiAccount";

type Props = {
  open: boolean;
  onClose: () => void;
  account: AccountResponse | null;
  onSuccess: () => void;
};

const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 320;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileEditModal({ open, onClose, account, onSuccess }: Props) {
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Original email to detect changes
  const originalEmail = account?.email ?? "";

  useEffect(() => {
    if (!open || !account) return;

    setError(null);
    setFirstName(account.firstName ?? "");
    setLastName(account.lastName ?? "");
    setEmail(account.email ?? "");
  }, [open, account]);

  const validate = (): string | null => {
    if (!firstName.trim()) return "Imię jest wymagane.";
    if (firstName.length > MAX_NAME_LENGTH) return `Imię może mieć maksymalnie ${MAX_NAME_LENGTH} znaków.`;

    if (!lastName.trim()) return "Nazwisko jest wymagane.";
    if (lastName.length > MAX_NAME_LENGTH) return `Nazwisko może mieć maksymalnie ${MAX_NAME_LENGTH} znaków.`;

    if (!email.trim()) return "Email jest wymagany.";
    if (!EMAIL_REGEX.test(email)) return "Podaj poprawny adres email.";
    if (email.length > MAX_EMAIL_LENGTH) return `Email może mieć maksymalnie ${MAX_EMAIL_LENGTH} znaków.`;

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    const emailChanged = email.trim().toLowerCase() !== originalEmail.toLowerCase();

    const payload: UpdateProfilePayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };

    // Wariant A: jeśli email się zmienił, dodajemy emailVerified: false
    if (emailChanged) {
      payload.emailVerified = false;
    }

    try {
      await apiAccount.updateProfile(payload);

      if (emailChanged) {
        showToast(
          "Adres e-mail został zmieniony. Wysłaliśmy link weryfikacyjny na nowy adres.",
          "info"
        );
      } else {
        showToast("Zapisano zmiany.", "success");
      }

      onSuccess();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Nie udało się zapisać zmian.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={saving ? undefined : onClose}
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-xl p-6 relative"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Edytuj dane profilu
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Imię
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={saving}
                  maxLength={MAX_NAME_LENGTH}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nazwisko
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={saving}
                  maxLength={MAX_NAME_LENGTH}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
                maxLength={MAX_EMAIL_LENGTH}
              />
              {email.trim().toLowerCase() !== originalEmail.toLowerCase() && (
                <p className="mt-1 text-xs text-amber-600">
                  Zmiana adresu email wymaga ponownej weryfikacji.
                </p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={saving}
              variant="secondary"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={saving}
              variant="primary"
            >
              {saving ? "Zapisywanie…" : "Zapisz"}
            </Button>
          </div>

          {/* X */}
          <button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            disabled={saving}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
