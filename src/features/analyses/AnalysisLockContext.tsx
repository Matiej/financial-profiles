import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiAnalyses } from "../analyses/apiAnalyses";
import type { PayloadMode, LatestStatus } from "../../types/profilerTypes";
import { useAuth } from "../../auth/AuthProvider";

type LockState = {
  locked: boolean;
  mode?: PayloadMode;
  until?: Date | null;
  remaining?: number | null; // sekundy do końca karencji (gdy DONE/FAILED)
  sourceSubmissionId?: string | null;
};

type Ctx = {
  lock: LockState;
  setLockedFromStatus: (
    submissionIdOrNull: string | null,
    st: LatestStatus
  ) => void;
  clearLock: () => void;
  startPolling: (
    submissionId: string,
    onDone: (st: LatestStatus) => void
  ) => void;
  refreshGlobalStatus: () => Promise<void>;
};

const AnalysisLockContext = createContext<Ctx | null>(null);

export function AnalysisLockProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated, initialized } = useAuth();
  const [lock, setLock] = useState<LockState>({ locked: false });

  // interwał „twardy” (co 2s po kliknięciu Wyślij)
  const pollRef = useRef<number | null>(null);
  // interwał „miękki” (co 15s, gdy jest lock — żeby odświeżać zegar/nowe joby)
  const softPollRef = useRef<number | null>(null);

  const clearPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const clearSoftPolling = () => {
    if (softPollRef.current) {
      window.clearInterval(softPollRef.current);
      softPollRef.current = null;
    }
  };

  // 🔑 Centralna logika ustawiania/odblokowania
  const setLockedFromStatus = (
    submissionIdOrNull: string | null,
    st: LatestStatus
  ) => {
    if (!st) {
      // 204 No Content ⇒ odblokuj wszystko
      setLock({ locked: false });
      return;
    }

    const status = st.status;
    const remaining = st.remainingLockSeconds ?? null;

    // DONE/FAILED + brak karencji lub karencja = 0 ⇒ OD-BLO-KUJ
    if (
      (status === "DONE" || status === "FAILED") &&
      (remaining === null || remaining <= 0)
    ) {
      setLock({ locked: false });
      return;
    }

    // RUNNING ⇒ lock bez licznika
    if (status === "RUNNING") {
      setLock({
        locked: true,
        mode: (st.mode ?? undefined) as PayloadMode | undefined,
        until: null,
        remaining: null,
        sourceSubmissionId: submissionIdOrNull ?? st.submissionId ?? null,
      });
      return;
    }

    // DONE/FAILED + karencja > 0 ⇒ lock z odliczaniem
    if (
      (status === "DONE" || status === "FAILED") &&
      st.isLocked &&
      remaining !== null &&
      remaining > 0
    ) {
      const until = st.expireAt ? new Date(st.expireAt) : null;
      setLock((prev) => {
        // jeśli backend zwróci WIĘKSZĄ karencję (np. nowy job), przyjmij większą
        const nextRemaining =
          prev.locked && prev.remaining != null
            ? Math.max(prev.remaining, remaining)
            : remaining;
        return {
          locked: true,
          mode: (st.mode ?? prev.mode ?? undefined) as PayloadMode | undefined,
          until,
          remaining: nextRemaining,
          sourceSubmissionId:
            submissionIdOrNull ??
            st.submissionId ??
            prev.sourceSubmissionId ??
            null,
        };
      });
      return;
    }

    // Inne statusy / brak locka ⇒ odblokuj
    setLock({ locked: false });
  };

  const clearLock = () => {
    clearPolling();
    clearSoftPolling();
    setLock({ locked: false });
  };

  // ⏱️ Lokalny sekundnik – gdy remaining spada do 0 ⇒ odblokuj
  useEffect(() => {
    let t: number | null = null;
    if (lock.locked && (lock.remaining ?? null) !== null) {
      t = window.setInterval(() => {
        setLock((prev) => {
          const r0 = prev.remaining ?? 0;
          const r = r0 - 1;
          return r <= 0 ? { locked: false } : { ...prev, remaining: r };
        });
      }, 1000);
    }
    return () => {
      if (t) window.clearInterval(t);
    };
  }, [lock.locked, lock.remaining]);

  // 📡 Polling po kliknięciu „Prześlij do analizy”
  const startPolling = (
    submissionId: string,
    onDone: (st: LatestStatus) => void
  ) => {
    clearPolling();
    pollRef.current = window.setInterval(async () => {
      try {
        const st = await apiAnalyses.latestStatus(submissionId);
        setLockedFromStatus(submissionId, st);
        if (st && (st.status === "DONE" || st.status === "FAILED")) {
          clearPolling();
          onDone(st);
        }
      } catch {
        // ignoruj chwilowe błędy
      }
    }, 2000);
  };

  // 🔄 miękki polling globalny co 15 s, tylko gdy lock aktywny
  useEffect(() => {
    clearSoftPolling();
    if (lock.locked && lock.remaining !== null) {
      softPollRef.current = window.setInterval(async () => {
        try {
          const st = await apiAnalyses.latestGlobalStatus();

          // ⛔️ DODANE: defensywnie ignoruj 204/null — nie nadpisuj
          if (!st) return;

          const sid = st.submissionId ?? null;
          setLockedFromStatus(sid, st);
        } catch {
          // ignorujemy
        }
      }, 15000);
    }

    return () => clearSoftPolling();
  }, [lock.locked, lock.remaining]);

  // 🟢 global check on startup or reload
  const refreshGlobalStatus = async () => {
    if (!initialized) return;
    if (!authenticated) {
      setLockedFromStatus(null, null);
      return;
    }
    try {
      const st = await apiAnalyses.latestGlobalStatus();

      if (!st && lock.locked && lock.remaining === null) {
        return;
      }

      const sid = st?.submissionId ?? null;
      setLockedFromStatus(sid, st);
    } catch {
      // brak statusu
    }
  };

  useEffect(() => {
    // pojedynczy startowy check (drugi, z cancelled — USUNIĘTY jako nadmiarowy)
    refreshGlobalStatus();
    // cleanup wszystkich interwałów na odmontowanie providera
    return () => {
      clearPolling();
      clearSoftPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnalysisLockContext.Provider
      value={{
        lock,
        setLockedFromStatus,
        clearLock,
        startPolling,
        refreshGlobalStatus,
      }}
    >
      {children}
    </AnalysisLockContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAnalysisLock() {
  const ctx = useContext(AnalysisLockContext);
  if (!ctx)
    throw new Error("useAnalysisLock must be used within AnalysisLockProvider");
  return ctx;
}

// (opcjonalnie) komponent licznika w headerze
export function NavLockCountdown() {
  const { lock } = useAnalysisLock();
  if (!lock.locked) return null;

  const seconds = lock.remaining ?? null;
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="no-print inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium
                    border border-amber-300 bg-amber-50 text-amber-900"
    >
      {seconds !== null ? (
        <>
          <span>Karencja analizy</span>
          <span className="font-mono">{fmt(seconds)}</span>
        </>
      ) : (
        <span>Analiza w toku…</span>
      )}
    </div>
  );
}
