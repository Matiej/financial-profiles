import { useState } from "react";

export type TestIdModalProps = {
  open: boolean;
  testId: string | null;
  onClose: () => void;
};

export function TestIdModal({ open, testId, onClose }: TestIdModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open || !testId) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(testId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Nie udało się skopiować ID testu.");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white border border-[#d4af37]/40 shadow-xl p-6 relative">
          <h2 className="text-lg font-semibold text-[#0f1e3a] mb-3">
            ID testu
          </h2>

          <p className="text-sm text-zinc-700 mb-2">
            Poniżej znajduje się identyfikator testu. Użyj go w WordPressie
            lub w innych integracjach.
          </p>

          <div className="mt-2 mb-4">
            <div className="text-xs font-mono break-all border border-zinc-200 rounded-md px-3 py-2 bg-neutral-50">
              {testId}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center rounded-md border border-zinc-300 bg-white text-zinc-800
                         px-4 py-2 text-sm font-medium hover:bg-neutral-50 shadow-sm"
            >
              {copied ? "Skopiowano!" : "Skopiuj"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-md bg-[#0f1e3a] text-white px-4 py-2 text-sm font-medium
                         hover:bg-[#0b172d] border border-[#d4af37]/60 shadow-sm"
            >
              OK
            </button>
          </div>

          {/* X w rogu */}
          <button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}