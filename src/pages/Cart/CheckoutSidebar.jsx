// src/components/cart/CheckoutSidebar.jsx
// Shared sidebar for all 3 checkout steps.
// Shows real profile image, back button, step nav, help box.

import { useAuth } from "../../context/AuthContext";

const FALLBACK = "/images/profile.png";

const backArrow = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const personSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
    />
    <path
      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const steps = [
  { num: 1, label: "Personal Details" },
  { num: 2, label: "Delivery Address" },
  { num: 3, label: "Payment" },
];

export default function CheckoutSidebar({ current, onBack }) {
  const { user } = useAuth();

  const imgSrc = user?.image || null;

  const handleImgError = (e) => {
    e.currentTarget.style.display = "none";
    e.currentTarget.nextSibling.style.display = "flex";
  };

  const stepLabel = current === 4 ? "Complete" : `Step ${current} of 3`;

  return (
    <aside className="od-sidebar">
      {/* Back button */}
      {onBack && (
        <button
          className="co-sidebar-back"
          onClick={onBack}
          aria-label="Go back"
        >
          {backArrow}
        </button>
      )}

      {/* Profile image */}
      <div className="co-avatar-img">
        {imgSrc ? (
          <>
            <img
              src={imgSrc}
              alt={user?.name || "Profile"}
              onError={handleImgError}
            />
            {/* fallback svg shown via JS if img fails */}
            <span
              style={{
                display: "none",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {personSvg}
            </span>
          </>
        ) : (
          personSvg
        )}
      </div>

      <h2 className="od-name">{user?.name || "Checkout"}</h2>
      <p className="od-phone">{stepLabel}</p>

      <nav className="od-steps">
        {steps.map((s) => {
          const isDone = s.num < current || current === 4;
          const isActive = s.num === current;
          return (
            <div
              key={s.num}
              className={`od-step ${isActive ? "active" : isDone ? "done" : ""}`}
            >
              <span className="od-step-num">{isDone ? "✓" : s.num}</span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="od-help">
        <span className="od-help-icon">🎧</span>
        <div>
          <p className="od-help-title">Need Help?</p>
          <p className="od-help-sub">24/7 Customer Support</p>
          <p className="od-help-email">support@shopkart.com</p>
        </div>
      </div>
    </aside>
  );
}
