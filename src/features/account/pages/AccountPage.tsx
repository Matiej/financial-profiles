import { useCallback, useEffect, useState } from "react";
import type { AccountResponse } from "../../../types/accountTypes";
import Button from "../../../ui/Button";
import { apiAccount } from "../apiAccount";
import ProfileEditModal from "../components/ProfileEditModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

export default function AccountPage() {
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchAccount = useCallback(async () => {
    try {
      const data = await apiAccount.getAccount();
      setAccount(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Nie udało się pobrać danych konta.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Ładowanie...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!account) {
    return (
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-slate-600">
        Brak danych konta.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Moje konto</h1>

      {/* Email unverified banner */}
      {!account.emailVerified && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">
                Adres email niezweryfikowany
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Sprawdź swoją skrzynkę pocztową i kliknij link weryfikacyjny, aby potwierdzić adres email.
              </p>
              <button
                type="button"
                className="mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 underline"
                disabled
                title="Funkcja wkrótce dostępna"
              >
                Wyślij link weryfikacyjny ponownie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sekcja: Dane profilu */}
      <section className="rounded-lg bg-white border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Dane profilu</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Imię
              </div>
              <div className="text-sm text-slate-900">{account.firstName || "—"}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Nazwisko
              </div>
              <div className="text-sm text-slate-900">{account.lastName || "—"}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              Email
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-900">{account.email || "—"}</span>
              {account.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Zweryfikowany
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Niezweryfikowany
                </span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditModalOpen(true)}
            >
              Edytuj dane
            </Button>
          </div>
        </div>
      </section>

      {/* Sekcja: Bezpieczeństwo */}
      <section className="rounded-lg bg-white border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Bezpieczeństwo</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-slate-900">Hasło</div>
              <div className="text-sm text-slate-500">
                Zmień swoje hasło, aby zabezpieczyć konto.
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setResetModalOpen(true)}
            >
              Reset hasła
            </Button>
          </div>

          <hr className="border-slate-200" />

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-red-600">Usuń konto</div>
              <div className="text-sm text-slate-500">
                Trwale usuń swoje konto i wszystkie dane.
              </div>
            </div>
            <Button
              type="button"
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
            >
              Usuń konto
            </Button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProfileEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        account={account}
        onSuccess={fetchAccount}
      />

      <ResetPasswordModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      />

      <DeleteAccountModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
