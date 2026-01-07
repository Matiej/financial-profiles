import { useEffect, useState } from "react";
import type { CreateUserPayload, UserResponse } from "../../../types/userTypes";
import Button from "../../../ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
  initial?: UserResponse | null; // jeśli edycja
};

export function UserFormModal({ open, onClose, onSubmit, initial }: Props) {
  const isEdit = !!initial;

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setError(null);

    if (initial) {
      setUsername(initial.username ?? "");
      setFirstName(initial.firstName ?? "");
      setLastName(initial.lastName ?? "");
      setEmail(initial.email ?? "");
      setEnabled(!!initial.enabled);
      setEmailVerified(!!initial.emailVerified);
    } else {
      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setEnabled(true);
      setEmailVerified(false);
    }
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // minimalna walidacja FE (backend i tak waliduje)
    if (!username.trim()) return setError("Podaj username.");
    if (!firstName.trim()) return setError("Podaj imię.");
    if (!lastName.trim()) return setError("Podaj nazwisko.");
    if (!email.trim()) return setError("Podaj email.");

    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        enabled,
        emailVerified,
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Nie udało się zapisać użytkownika.");
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
          className="w-full max-w-xl rounded-2xl bg-white border border-[#d4af37]/40 shadow-xl p-6 relative"
        >
          <h2 className="text-lg font-semibold text-[#0f1e3a] mb-4">
            {isEdit ? "Edytuj użytkownika" : "Nowy użytkownik"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Username</label>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={saving}
                placeholder="np. ewelina"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Imię</label>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Nazwisko</label>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
                placeholder="user@example.com"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  className="rounded border-zinc-300"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  disabled={saving}
                />
                Enabled
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  className="rounded border-zinc-300"
                  checked={emailVerified}
                  onChange={(e) => setEmailVerified(e.target.checked)}
                  disabled={saving}
                />
                Email verified
              </label>
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
              {saving ? "Zapisywanie…" : isEdit ? "Zapisz" : "Utwórz"}
            </Button>
          </div>

          {/* X */}
          <button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            disabled={saving}
            className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600"
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
