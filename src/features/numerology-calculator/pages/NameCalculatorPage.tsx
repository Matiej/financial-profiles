import { type FormEvent, useState } from "react";
import { apiNumerology } from "../apiNumerology";
import type { NumerologyPhraseResult } from "../../../types/ncalculatorTypes";
import {
  LETTER_VIBRATION,
  VOWELS,
  isDigit,
  getNumberForChar,
} from "../../../lib/letterVibrations";

export default function NameCalculatorPage() {
  const [phrase, setPhrase] = useState("");
  const [result, setResult] = useState<NumerologyPhraseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculatedPhrase, setCalculatedPhrase] = useState<string | null>(null);

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
      setCalculatedPhrase(trimmed);
    } catch (err) {
      setResult(null);
      setCalculatedPhrase(null);
      setError(
        err instanceof Error ? err.message : "Nie udało się obliczyć wibracji."
      );
    } finally {
      setLoading(false);
    }
  };

  const displayPhrase = (calculatedPhrase ?? "").toUpperCase();

  let letters: string[] = [];
  let vowelRow: (number | "")[] = [];
  let consonantRow: (number | "")[] = [];

  let lettersSum: number | null = null;
  let lettersReduced: string | null = null;

  if (result && displayPhrase) {
    // bierzemy tylko znaki, które są literą z mapy lub cyfrą
    letters = Array.from(displayPhrase).filter((ch) => {
      return isDigit(ch) || LETTER_VIBRATION[ch] !== undefined;
    });

    letters
      .map((ch) => getNumberForChar(ch))
      .filter((n): n is number => n !== null);

    const [fullPart, reducedPart] = result.vibration
      .split("/")
      .map((s) => s.trim());

    lettersSum = fullPart ? Number(fullPart) || null : null;
    lettersReduced = reducedPart && reducedPart.length > 0 ? reducedPart : null;

    vowelRow = letters.map((ch) => {
      const num = getNumberForChar(ch);
      if (num === null) return "";
      return VOWELS.has(ch) ? num : "";
    });

    consonantRow = letters.map((ch) => {
      const num = getNumberForChar(ch);
      if (num === null) return "";

      if (isDigit(ch)) return "";
      return VOWELS.has(ch) ? "" : num;
    });
  }

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
            <div className="text-lg sm:text-2xl font-semibold tracking-[0.18em] text-[#0f1e3a] uppercase break-words max-w-full px-2">
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

          {/* --- NOWA SEKCJA: TABELA ROZKŁADU LITER --- */}
          {letters.length > 0 && (
            <div className="mt-8">
              <div className="text-center mb-3">
                <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                  Rozkład liter i wibracji
                </div>
                <div className="text-xs text-zinc-500">
                  Samogłoski, litery, spółgłoski
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm border-separate border-spacing-y-1">
                  <tbody>
                    {/* Wiersz samogłoski */}
                    <tr className="bg-emerald-50">
                      {vowelRow.map((val, idx) => (
                        <td key={`vowel-${idx}`} className="px-1 py-1">
                          {val !== "" ? (
                            <span className="font-mono text-[13px]">{val}</span>
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                      <td className="px-2">=</td>
                      <td className="px-2 text-left font-semibold">
                        {result.vowelsResult}
                      </td>
                    </tr>

                    {/* Wiersz litery */}
                    <tr className="bg-neutral-50">
                      {letters.map((ch, idx) => (
                        <td key={`letter-${idx}`} className="px-1 py-1">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[13px] font-semibold">
                              {ch}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              {getNumberForChar(ch) ?? ""}
                            </span>
                          </div>
                        </td>
                      ))}
                      <td className="px-2">=</td>
                      <td className="px-2 text-left font-semibold">
                        {lettersSum !== null ? lettersSum : ""}
                        {lettersReduced && lettersSum !== null
                          ? ` = ${lettersReduced}`
                          : ""}
                      </td>
                    </tr>

                    {/* Wiersz spółgłoski */}
                    <tr className="bg-sky-50">
                      {consonantRow.map((val, idx) => (
                        <td key={`cons-${idx}`} className="px-1 py-1">
                          {val !== "" ? (
                            <span className="font-mono text-[13px]">{val}</span>
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                      <td className="px-2">=</td>
                      <td className="px-2 text-left font-semibold">
                        {result.consonantsResult}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
