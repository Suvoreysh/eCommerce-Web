import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const productImg =
  "https://images.unsplash.com/photo-1592286927505-1def25115481?q=80&w=300&auto=format&fit=crop";
const fallbackImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='14' fill='%23f0f1f3'/></svg>";

const cartItems = [
  { id: 1, name: "Iphone 17pro", image: productImg },
  { id: 2, name: "Iphone 17pro", image: productImg },
  { id: 3, name: "Iphone 17pro", image: productImg },
];

const steps = [
  { num: 1, label: "Personal Details" },
  { num: 2, label: "Delivery Address" },
  { num: 3, label: "Payment" },
];

const mobileSteps = [
  { num: 1, label: "User Detail" },
  { num: 2, label: "Delivery" },
  { num: 3, label: "Payment" },
];

const personIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const backIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function MobileStepper({ current }) {
  return (
    <div className="mstepper-track">
      {mobileSteps.map((s, i) => (
        <div key={s.num} className="mstep-group">
          <div className="mstep">
            <div
              className={`mstep-dot ${
                s.num < current ? "done" : s.num === current ? "active" : ""
              }`}
            />
            <span
              className={`mstep-label ${s.num === current ? "active" : ""}`}
            >
              {s.label}
            </span>
          </div>

          {i < mobileSteps.length - 1 && (
            <div
              className={`mstep-connector ${s.num <= current ? "done" : ""}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------- Validation ----------
const NAME_TYPE_RE = /^[A-Za-z\s]*$/; // characters allowed while typing
const NAME_VALID_RE = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/; // full-value validity
const DIGIT_TYPE_RE = /^[0-9]*$/;
const PHONE_VALID_RE = /^[0-9]{10}$/;
const EMAIL_VALID_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const validators = {
  fullName: (v) => {
    if (!v.trim()) return "Full name is required";
    if (!NAME_VALID_RE.test(v.trim()))
      return "Only letters and spaces are allowed";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email is required";
    if (!EMAIL_VALID_RE.test(v.trim())) return "Enter a valid email address";
    return "";
  },
  phone: (v) => {
    if (!v) return "Phone number is required";
    if (!PHONE_VALID_RE.test(v)) return "Enter a valid 10-digit phone number";
    return "";
  },
  country: (v) => {
    if (!v.trim()) return "Country is required";
    if (!NAME_VALID_RE.test(v.trim()))
      return "Only letters and spaces are allowed";
    return "";
  },
};

export default function UserDetail() {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Block invalid keystrokes at the source, then run full validation.
  const update = (key) => (e) => {
    let value = e.target.value;

    if (key === "fullName" || key === "country") {
      if (!NAME_TYPE_RE.test(value)) return; // reject digits/symbols entirely
    }
    if (key === "phone") {
      if (!DIGIT_TYPE_RE.test(value)) return; // reject non-digits entirely
      value = value.slice(0, 10);
    }

    setPersonal((p) => ({ ...p, [key]: value }));
    if (touched[key]) {
      setErrors((er) => ({ ...er, [key]: validators[key](value) }));
    }
  };

  const handleBlur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((er) => ({ ...er, [key]: validators[key](personal[key]) }));
  };

  const runAllValidation = () => {
    const nextErrors = {};
    Object.keys(validators).forEach((key) => {
      nextErrors[key] = validators[key](personal[key]);
    });
    setErrors(nextErrors);
    setTouched({ fullName: true, email: true, phone: true, country: true });
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const canContinue =
    personal.fullName &&
    personal.email &&
    personal.phone &&
    personal.country &&
    Object.keys(validators).every((key) => !validators[key](personal[key]));

  const handleContinue = () => {
    if (!runAllValidation()) return;
    navigate("/cart/delivery", { state: { personal } });
  };

  const formContent = (
    <div className="content">
      <div className="card">
        <div className="items-card-head">
          <span>{cartItems.length} Total Items</span>
          <button className="edit-pill" onClick={() => navigate("/cart")}>
            Edit
          </button>
        </div>
        <div className="thumb-row">
          {cartItems.map((it) => (
            <img
              key={it.id}
              src={it.image}
              alt={it.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImg;
              }}
            />
          ))}
        </div>
        <p className="saved-text">You saved ₹ 297!</p>
        <div className="price-line">
          ₹ 1,197 <span className="strike">₹ 1,497</span>
        </div>
      </div>

      <div className="field-label">
        {personIcon}
        Personal Details
      </div>

      <input
        placeholder="Full Name"
        value={personal.fullName}
        onChange={update("fullName")}
        onBlur={handleBlur("fullName")}
        className={touched.fullName && errors.fullName ? "input-error" : ""}
      />
      {touched.fullName && errors.fullName && (
        <p className="error-text">{errors.fullName}</p>
      )}

      <input
        placeholder="Email Address"
        type="email"
        value={personal.email}
        onChange={update("email")}
        onBlur={handleBlur("email")}
        className={touched.email && errors.email ? "input-error" : ""}
      />
      {touched.email && errors.email && (
        <p className="error-text">{errors.email}</p>
      )}

      <div
        className={`phone-row ${
          touched.phone && errors.phone ? "input-error" : ""
        }`}
      >
        <span className="cc-badge">IN ▾</span>
        <input
          placeholder="Phone Number"
          value={personal.phone}
          onChange={update("phone")}
          onBlur={handleBlur("phone")}
          inputMode="numeric"
          maxLength={10}
        />
        <span className="qmark">?</span>
      </div>
      {touched.phone && errors.phone && (
        <p className="error-text">{errors.phone}</p>
      )}

      <input
        placeholder="Country Name"
        value={personal.country}
        onChange={update("country")}
        onBlur={handleBlur("country")}
        className={touched.country && errors.country ? "input-error" : ""}
      />
      {touched.country && errors.country && (
        <p className="error-text">{errors.country}</p>
      )}

      <button
        className="full-continue-btn"
        disabled={!canContinue}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );

  return (
    <div className="checkout-page">
      {/* ---------- Mobile ---------- */}
      <div className="checkout-mobile">
        <div className="top-bar">
          <button className="icon-btn" onClick={() => navigate("/cart")}>
            {backIcon}
          </button>
          <h1>Cart</h1>
          <div className="info-circle">i</div>
        </div>
        <div className="stepper-wrap">
          <MobileStepper current={1} />
        </div>
        {formContent}
      </div>

      {/* ---------- Desktop — sidebar layout ---------- */}
      <div className="cd-desktop">
        <aside className="od-sidebar">
          <div className="od-avatar" />
          <h2 className="od-name">Checkout</h2>
          <p className="od-phone">Step 1 of 3</p>

          <nav className="od-steps">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`od-step ${s.num === 1 ? "active" : ""}`}
              >
                <span className="od-step-num">{s.num}</span>
                <span>{s.label}</span>
              </div>
            ))}
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

        <div className="od-main">
          <div className="od-main-header">
            <h1>Personal Details</h1>
          </div>
          {formContent}
        </div>
      </div>
    </div>
  );
}
