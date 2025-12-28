import Button from "./DetailButton";

type Props = {
  open: boolean;
  status: "DONE" | "FAILED";
  mode?: string | null;
  onClose: () => void;
  onGoToAnalyses?: () => void;
};

export default function AnalysisDoneModal({
  open,
  status,
  mode,
  onClose,
  onGoToAnalyses,
}: Props) {
  if (!open) return null;

  const success = status === "DONE";

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-brand-mist/70 shadow-xl p-6 relative">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={[
                "inline-flex h-9 w-9 items-center justify-center rounded-full",
                success ? "bg-emerald-50" : "bg-red-50",
              ].join(" ")}
            >
              <svg
                className={[
                  "h-5 w-5",
                  success ? "text-emerald-600" : "text-red-600",
                ].join(" ")}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {success ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </>
                )}
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-brand-ink">
              {success
                ? "Analiza została zakończona"
                : "Analiza zakończona błędem"}
            </h3>
          </div>

          <div className="text-sm text-zinc-700 leading-relaxed">
            {success ? (
              <>
                <p>
                  Wyniki są dostępne w sekcji <b>Analizy</b> tego testu.
                </p>
                {mode && (
                  <p className="mt-1 text-xs text-zinc-500">
                    Tryb analizy: <b>{mode}</b>
                  </p>
                )}
              </>
            ) : (
              <p>
                Coś poszło nie tak. Możesz ponowić analizę po zakończeniu
                karencji.
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            {success && onGoToAnalyses && (
              <Button variant="secondary" onClick={onGoToAnalyses}>
                Przejdź do analiz
              </Button>
            )}
            <Button variant="primary" onClick={onClose}>
              OK
            </Button>
          </div>

          {/* X w rogu */}
          <button
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
