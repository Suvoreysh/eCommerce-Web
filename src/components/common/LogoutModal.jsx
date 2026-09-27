import { useEffect } from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import "./LogoutModal.css";

/**
 * Reusable logout confirmation modal.
 * Props:
 *   open      – boolean
 *   onCancel  – () => void
 *   onConfirm – () => void
 */
export default function LogoutModal({ open, onCancel, onConfirm }) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="logout-modal-overlay"
      onClick={onCancel}
    >
      <div
        className="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="logout-modal-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <FiX />
        </button>

        <div className="logout-modal-icon">
          <FiLogOut />
        </div>

        <div className="logout-modal-content">
          <h2 id="logout-modal-title">Are you sure?</h2>
          <p>Are you sure you want to logout from your account?</p>
        </div>

        <div className="logout-modal-actions">
          <button
            type="button"
            className="logout-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="logout-confirm-btn"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
