import { type FormEvent, useState } from "react";
import { apiNumerology } from "../apiNumerology";
import type { NumerologyPhraseResult } from "../../../types/ncalculatorTypes";

export default function NameCalculatorPage() {
  const [phrase, setPhrase] = useState("");
  const [result, setResult] = useState<NumerologyPhraseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = phrase.trim();
    if (!trimmed) {
      setError("Wpisz nazwę lub imię do obliczenia.");
      setResult(null);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await apiNumerology.calculatePhrase(trimmed);
      setResult(res);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error ? err.message : "Nie udało się obliczyć wibracji."
      );
    } finally {
      setLoading(false);
    }
  };

  const displayPhrase = phrase.trim().toUpperCase();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#0f1e3a] mb-4 text-center">
        Kalkulator numerologiczny – nazwy
      </h1>

      {/* Formularz */}
      <form
        onSubmit={onSubmit}
        className="mb-8 flex flex-col gap-3 items-center"
      >
        <input
          type="text"
          maxLength={100}
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="Wpisz dowolną frazę"
          className="w-full max-w-xl rounded-md border border-neutral-300 px-4 py-2.5 text-[15px]
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]
                     placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium
                     bg-[#8b2bbf] text-white shadow-sm border border-[#8b2bbf]
                     hover:bg-[#731fa0] disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors"
        >
          {loading ? "Liczenie…" : "Oblicz"}
        </button>
        {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
      </form>

      {/* Wyniki */}
      {result && (
        <div className="border border-zinc-200 rounded-xl bg-white shadow-sm p-6">
          {/* Nazwa */}
          <div className="text-center mb-4">
            <div className="text-sm tracking-wide text-zinc-500 mb-1">
              NAZWA
            </div>
            <div className="text-2xl font-semibold tracking-[0.18em] text-[#0f1e3a] uppercase">
              {displayPhrase || "—"}
            </div>
          </div>

          <div className="h-px bg-zinc-200 my-4" />

          {/* Podsumowanie liczb */}
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Wibracja
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.vibration}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Wynik samogłosek (dusza)
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.vowelsResult}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Wynik spółgłosek (ekspresja)
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.consonantsResult}
              </div>
            </div>
          </div>

          {/* Mała stopka z wyjaśnieniem */}
          <div className="mt-5 text-xs text-zinc-500 text-center leading-snug">
            Wibracja jest zapisana w formacie{" "}
            <span className="font-mono font-semibold">całość / suma cyfr</span>,
            np. <span className="font-mono">24/6</span>. Cyfry w nazwie są
            wliczane 1:1 do całości.
          </div>
        </div>
      )}
    </div>
  );
}
