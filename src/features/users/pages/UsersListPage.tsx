import { useEffect, useState } from "react";
import { apiUsers } from "../apiUsers";
import type { UserResponse } from "../../../types/userTypes";

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" });
}

export default function UsersListPage() {
  const [data, setData] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await apiUsers.listUsers();
        setData(list);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Nie udało się pobrać użytkowników."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-zinc-600">
        ⏳ Wczytywanie użytkowników...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-10">❌ Błąd: {error}</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-[#0f1e3a]">Użytkownicy</h1>

        <button
          type="button"
          className="inline-flex items-center rounded-md bg-[#0f1e3a] text-white px-4 py-2 text-sm font-medium
                     hover:bg-[#0b172d] border border-[#d4af37]/60 shadow-sm"
          onClick={() => alert("Następny krok: modal tworzenia użytkownika 🙂")}
        >
          + Nowy użytkownik
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">Brak użytkowników.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-100">
                <th className="px-3 py-2">Login</th>
                <th className="px-3 py-2">Imię i nazwisko</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Utworzono</th>
                <th className="px-3 py-2 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white shadow-sm hover:shadow-md transition rounded-md"
                >
                  <td className="px-3 py-2 font-medium text-[#0f1e3a]">
                    {user.username}
                  </td>
                  <td className="px-3 py-2 text-sm text-zinc-700">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-3 py-2 text-sm text-zinc-700">
                    {user.email}
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wide border " +
                        (user.enabled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200")
                      }
                    >
                      {user.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-zinc-700">
                    {fmtDate(user.createdAt)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-neutral-300 bg-white text-neutral-700
                                   px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 shadow-sm"
                        onClick={() => alert("Następny krok: modal edycji")}
                      >
                        Edytuj
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-red-200 bg-red-50 text-red-700
                                   px-3 py-1.5 text-xs font-medium hover:bg-red-100 shadow-sm"
                        onClick={async () => {
                          const ok = window.confirm(
                            `Usunąć użytkownika "${user.username}"?`
                          );
                          if (!ok) return;
                          await apiUsers.deleteUser(user.id);
                          // czy tuatj nie potrzeba pociągnąć nowych danych z backend?
                          setData((prev) =>
                            prev.filter((x) => x.id !== user.id)
                          );
                        }}
                      >
                        Usuń
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
