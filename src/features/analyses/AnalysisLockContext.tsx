import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { LatestStatus, PayloadMode } from "../../types/profilerTypes";
import { apiAnalyses } from "../analyses/apiAnalyses";

type LockState = {
  locked: boolean;
  mode?: PayloadMode;
  until?: Date | null;
  remaining?: number | null;
  sourceSubmissionId?: string | null;
};

type Ctx = {
  lock: LockState;
  setLockedFromStatus: (submissionId: string, st: LatestStatus) => void;
  clearLock: () => void;
  startPolling: (
    submissionId: string,
    onDone: (st: LatestStatus) => void
  ) => void;
};

const AnalysisLockContext = createContext<Ctx | null>(null);

export function AnalysisLockProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lock, setLock] = useState<LockState>({ locked: false });
  const pollRef = useRef<number | null>(null);

  const clearPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const setLockedFromStatus = (_submissionId: string, st: LatestStatus) => {
    if (!st) {
      setLock({ locked: false });
      return;
    }
    if (st.status === "RUNNING" && st.isLocked) {
      setLock({
        locked: true,
        mode: st.mode,
        until: null,
        remaining: null,
        sourceSubmissionId: _submissionId,
      });
    } else if (st.status === "DONE" && st.isLocked) {
      const until = st.expireAt ? new Date(st.expireAt) : null;
      setLock({
        locked: true,
        mode: st.mode,
        until,
        remaining: st.remainingLockSeconds ?? null,
        sourceSubmissionId: _submissionId,
      });
    } else {
      setLock({ locked: false });
    }
  };

  const clearLock = () => {
    clearPolling();
    setLock({ locked: false });
  };

  // odliczanie co sekundę przy karencji
  useEffect(() => {
    let t: number | null = null;
    if (lock.locked && (lock.remaining ?? null) !== null) {
      t = window.setInterval(() => {
        setLock((prev) => {
          const r = (prev.remaining ?? 0) - 1;
          if (r <= 0) return { locked: false };
          return { ...prev, remaining: r };
        });
      }, 1000);
    }
    return () => {
      if (t) window.clearInterval(t);
    };
  }, [lock.locked, lock.remaining]);

  const startPolling = (
    submissionId: string,
    onDone: (st: LatestStatus) => void
  ) => {
    clearPolling();
    pollRef.current = window.setInterval(async () => {
      try {
        const st = await apiAnalyses.latestStatus(submissionId);
        setLockedFromStatus(submissionId, st);
        if (st && st.status === "DONE") {
          clearPolling();
          onDone(st);
        }
      } catch {
        // ignore tmp errors
      }
    }, 2000);
  };

  return (
    <AnalysisLockContext.Provider
      value={{ lock, setLockedFromStatus, clearLock, startPolling }}
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

// Komponent do headera: licznik karencji
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
