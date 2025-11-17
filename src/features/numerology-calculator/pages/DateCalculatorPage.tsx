import { type FormEvent, useState } from "react";
import type { NumerologyDatesResult } from "../../../types/ncalculatorTypes";
import { apiNumerology } from "../apiNumerology";
import DatePicker from "react-datepicker";

function formatForBackend(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DateCalculatorPage() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [referenceDate, setReferenceDate] = useState<Date | null>(new Date());
  const [result, setResult] = useState<NumerologyDatesResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!birthDate) {
      setError("Podaj datę urodzenia.");
      setResult(null);
      return;
    }

    const ref = referenceDate ?? new Date(); // na wszelki wypadek fallback na dziś

    const birthStr = formatForBackend(birthDate);
    const referenceStr = formatForBackend(ref);

    setError(null);
    setLoading(true);

    try {
      const res = await apiNumerology.calculateDates(birthStr, referenceStr);
      setResult(res);
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się obliczyć wibracji dla dat."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#0f1e3a] mb-4 text-center">
        Kalkulator numerologiczny – daty
      </h1>

      <p className="text-center text-zinc-600 mb-6 text-sm leading-relaxed">
        Tutaj obliczysz główną wibrację daty urodzenia, rok osobisty, rok
        energii światowej, rok numerologiczny, miesiąc osobisty oraz wibracje
        dnia – światową i osobistą.
      </p>

      {/* Formularz */}
      <form
        onSubmit={onSubmit}
        className="mb-8 flex flex-col gap-4 items-center"
      >
        <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data urodzenia */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#0f1e3a]">
              Data urodzenia
            </label>
            <DatePicker
              selected={birthDate}
              onChange={(date) => setBirthDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Wybierz datę urodzenia"
              maxDate={new Date()}
              className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-[15px]
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
            <p className="text-[11px] text-zinc-500">
              Format: <span className="font-mono">RRRR-MM-DD</span>, np.{" "}
              <span className="font-mono">1978-05-21</span>.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#0f1e3a]">
              Data referencyjna
            </label>
            <DatePicker
              selected={referenceDate}
              onChange={(date) => setReferenceDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Wybierz datę referencyjną"
              className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-[15px]
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
            />
            <p className="text-[11px] text-zinc-500">
              Domyślnie ustawiona na dzisiaj. Możesz ją zmienić, jeśli liczysz
              wibracje na inny dzień.
            </p>
          </div>
        </div>

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
          {/* Główna wibracja */}
          <div className="text-center mb-4">
            <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
              Główna wibracja daty urodzenia
            </div>
            <div className="text-2xl font-semibold text-[#0f1e3a]">
              {result.mainVibration}
            </div>
          </div>

          <div className="h-px bg-zinc-200 my-4" />

          {/* Grid liczb */}
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Rok osobisty
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.personalYear}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Rok energii światowej
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.yearOfGlobalEnergy}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Rok numerologiczny
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.numerologyYear}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Miesiąc osobisty
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.personalMonth}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Światowa wibracja dnia
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.worldDayVibration}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase mb-1">
                Dzień osobisty
              </div>
              <div className="text-lg font-semibold text-[#0f1e3a]">
                {result.personalDay}
              </div>
            </div>
          </div>

          <div className="mt-5 text-xs text-zinc-500 text-center leading-snug">
            Wartości są liczone na podstawie Twojej daty urodzenia i wybranej
            daty referencyjnej, z domyślnym ustawieniem na dzisiejszy dzień.
          </div>
        </div>
      )}
    </div>
  );
}
