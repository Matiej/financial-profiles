import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalysisLock } from "../features/analyses/AnalysisLockContext";

export default function RouteAwareLockRefresher() {
  const { refreshGlobalStatus } = useAnalysisLock();
  const loc = useLocation();

  // na każdy change trasy
  useEffect(() => { refreshGlobalStatus(); }, [loc.key]);

  // na fokus/visibility
  useEffect(() => {
    const onFocus = () => refreshGlobalStatus();
    const onVisible = () => { if (document.visibilityState === "visible") refreshGlobalStatus(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
