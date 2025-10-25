import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiAnalyses } from "../analyses/apiAnalyses";
import type { PayloadMode, LatestStatus } from "../../types/profilerTypes";

type LockState = {
  locked: boolean;
  mode?: PayloadMode;
  until?: Date | null;
  remaining?: number | null;        // sekundy do końca karencji (gdy DONE)
  sourceSubmissionId?: string | null;
};

type Ctx = {
  lock: LockState;
  setLockedFromStatus: (submissionIdOrNull: string | null, st: LatestStatus) => void;
  clearLock: () => void;
  startPolling: (submissionId: string, onDone: (st: LatestStatus) => void) => void;
};

const AnalysisLockContext = createContext<Ctx | null>(null);

export function AnalysisLockProvider({ children }: { children: React.ReactNode }) {
  const [lock, setLock] = useState<LockState>({ locked: false });
  const pollRef = useRef<number | null>(null);

  const clearPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // 🔑 Centralna logika ustawiania/odblokowania
  const setLockedFromStatus = (submissionIdOrNull: string | null, st: LatestStatus) => {
    if (!st) {
      // 204 No Content ⇒ odblokuj wszystko
      setLock({ locked: false });
      return;
    }

    const status = st.status;
    const remaining = st.remainingLockSeconds ?? null;

    // DONE + brak karencji lub karencja = 0 ⇒ OD-BLO-KUJ (nawet jeśli isLocked=true przez stary TTL)
    if (status === "DONE" && (remaining === null || remaining <= 0)) {
      setLock({ locked: false });
      return;
    }

    if (status === "RUNNING") {
      setLock({
        locked: true,
        mode: (st.mode ?? undefined) as PayloadMode | undefined,
        until: null,
        remaining: null, // RUNNING bez licznika
        sourceSubmissionId: submissionIdOrNull ?? st.submissionId ?? null,
      });
      return;
    }

    // DONE + karencja > 0 ⇒ lock z odliczaniem
    if (status === "DONE" && st.isLocked && remaining !== null && remaining > 0) {
      const until = st.expireAt ? new Date(st.expireAt) : null;
      setLock({
        locked: true,
        mode: (st.mode ?? undefined) as PayloadMode | undefined,
        until,
        remaining,
        sourceSubmissionId: submissionIdOrNull ?? st.submissionId ?? null,
      });
      return;
    }

    // Inne statusy / brak locka ⇒ odblokuj
    setLock({ locked: false });
  };

  const clearLock = () => {
    clearPolling();
    setLock({ locked: false });
  };

  // ⏱️ Lokalny licznik – gdy remaining spada do 0 ⇒ odblokuj
  useEffect(() => {
    let t: number | null = null;
    if (lock.locked && (lock.remaining ?? null) !== null) {
      t = window.setInterval(() => {
        setLock(prev => {
          const r0 = prev.remaining ?? 0;
          const r = r0 - 1;
          if (r <= 0) {
            return { locked: false }; // koniec karencji ⇒ odblokuj
          }
          return { ...prev, remaining: r };
        });
      }, 1000);
    }
    return () => { if (t) window.clearInterval(t); };
  }, [lock.locked, lock.remaining]);

  // 📡 Polling po kliknięciu „Prześlij do analizy”
  const startPolling = (submissionId: string, onDone: (st: LatestStatus) => void) => {
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
        // ignore tmp erros
      }
    }, 2000);
  };

 
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const st = await apiAnalyses.latestGlobalStatus();
        if (cancelled) return;
        const sid = st && "submissionId" in st ? (st).submissionId as string : null;
        setLockedFromStatus(sid, st);
      } catch {
        // brak statusu ≈ odblokowane – nic nie robimy
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <AnalysisLockContext.Provider value={{ lock, setLockedFromStatus, clearLock, startPolling }}>
      {children}
    </AnalysisLockContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAnalysisLock() {
  const ctx = useContext(AnalysisLockContext);
  if (!ctx) throw new Error("useAnalysisLock must be used within AnalysisLockProvider");
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
    <div className="no-print inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium
                    border border-amber-300 bg-amber-50 text-amber-900">
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
