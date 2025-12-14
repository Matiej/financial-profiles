import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalysisLock } from "../features/analyses/AnalysisLockContext";
import { useAuth } from "../auth/AuthProvider";

export default function RouteAwareLockRefresher() {
  const { refreshGlobalStatus } = useAnalysisLock();
  const loc = useLocation();
  const { initialized, authenticated } = useAuth();

  useEffect(() => {
    if (!initialized || !authenticated) return;
    refreshGlobalStatus();
  }, [loc.key, refreshGlobalStatus, initialized, authenticated]);

  // na każdy change trasy
  useEffect(() => {
    refreshGlobalStatus();
  }, [loc.key, refreshGlobalStatus]);

  // na fokus/visibility
  useEffect(() => {
    const onFocus = () => refreshGlobalStatus();
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshGlobalStatus();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
