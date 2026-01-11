import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResetPasswordModal from "./ResetPasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";

export default function AccountSettingsDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click-outside handler
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleMyAccount = () => {
    setOpen(false);
    navigate("/account");
  };

  const handleResetPassword = () => {
    setOpen(false);
    setResetModalOpen(true);
  };

  const handleDeleteAccount = () => {
    setOpen(false);
    setDeleteModalOpen(true);
  };

  const itemClass =
    "block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100";

  const dangerItemClass =
    "block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50";

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          title="Ustawienia konta"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          {/* Gear/Cog icon */}
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-1 w-48 rounded-md border border-slate-200 bg-white shadow-lg py-1 z-50">
            <button type="button" onClick={handleMyAccount} className={itemClass}>
              Moje konto
            </button>
            <button type="button" onClick={handleResetPassword} className={itemClass}>
              Reset hasła
            </button>
            <hr className="my-1 border-slate-200" />
            <button type="button" onClick={handleDeleteAccount} className={dangerItemClass}>
              Usuń konto
            </button>
          </div>
        )}
      </div>

      <ResetPasswordModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      />

      <DeleteAccountModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
}
