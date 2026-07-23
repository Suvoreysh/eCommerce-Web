import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

const productImg =
  "https://images.unsplash.com/photo-1592286927505-1def25115481?q=80&w=300&auto=format&fit=crop";

const emptyDraft = {
  firstName: "",
  lastName: "",
  phone: "",
  type: "office",
  street: "",
  landmark: "",
  pin: "",
  state: "",
  city: "",
};

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

const fallbackImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='14' fill='%23f0f1f3'/></svg>";

const cartItems = [productImg, productImg, productImg];
const originalPrice = 1497;
const savedAmount = 297;
const currentPrice = originalPrice - savedAmount;

// ---------- Validation ----------
const NAME_TYPE_RE = /^[A-Za-z\s]*$/;
const NAME_VALID_RE = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const DIGIT_TYPE_RE = /^[0-9]*$/;
const PHONE_VALID_RE = /^[0-9]{10}$/;
const PIN_VALID_RE = /^[0-9]{6}$/;
const ADDRESS_TYPE_RE = /^[A-Za-z0-9\s,./#-]*$/;

const validators = {
  firstName: (v) => {
    if (!v.trim()) return "First name is required";
    if (!NAME_VALID_RE.test(v.trim()))
      return "Only letters and spaces are allowed";
    return "";
  },
  lastName: (v) => {
    if (v.trim() && !NAME_VALID_RE.test(v.trim()))
      return "Only letters and spaces are allowed";
    return "";
  },
  phone: (v) => {
    if (!v) return "Phone number is required";
    if (!PHONE_VALID_RE.test(v)) return "Enter a valid 10-digit phone number";
    return "";
  },
  street: (v) => {
    if (!v.trim()) return "Street address is required";
    return "";
  },
  landmark: () => "",
  pin: (v) => {
    if (!v) return "Postal pin is required";
    if (!PIN_VALID_RE.test(v)) return "Enter a valid 6-digit pin code";
    return "";
  },
  state: (v) => {
    if (!v.trim()) return "State is required";
    if (!NAME_VALID_RE.test(v.trim()))
      return "Only letters and spaces are allowed";
    return "";
  },
  city: (v) => {
    if (!v.trim()) return "City is required";
    if (!NAME_VALID_RE.test(v.trim()))
      return "Only letters and spaces are allowed";
    return "";
  },
};

export default function Delivery() {
  const navigate = useNavigate();
  const location = useLocation();

  const personal = location.state?.personal;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);

  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const total = 180;

  const update = (key) => (e) => {
    let value = e.target.value;

    if (
      key === "firstName" ||
      key === "lastName" ||
      key === "state" ||
      key === "city"
    ) {
      if (!NAME_TYPE_RE.test(value)) return;
    }
    if (key === "phone") {
      if (!DIGIT_TYPE_RE.test(value)) return;
      value = value.slice(0, 10);
    }
    if (key === "pin") {
      if (!DIGIT_TYPE_RE.test(value)) return;
      value = value.slice(0, 6);
    }
    if (key === "street" || key === "landmark") {
      if (!ADDRESS_TYPE_RE.test(value)) return;
    }

    setDraft((d) => ({ ...d, [key]: value }));
    if (touched[key]) {
      setErrors((er) => ({ ...er, [key]: validators[key](value) }));
    }
  };

  const handleBlur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((er) => ({ ...er, [key]: validators[key](draft[key]) }));
  };

  const fieldError = (key) => touched[key] && errors[key];

  const runAllValidation = () => {
    const nextErrors = {};
    Object.keys(validators).forEach((key) => {
      nextErrors[key] = validators[key](draft[key]);
    });
    setErrors(nextErrors);
    setTouched({
      firstName: true,
      lastName: true,
      phone: true,
      street: true,
      landmark: true,
      pin: true,
      state: true,
      city: true,
    });
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const canSave =
    draft.firstName &&
    draft.phone &&
    draft.street &&
    draft.pin &&
    draft.state &&
    draft.city &&
    Object.keys(validators).every((key) => !validators[key](draft[key]));

  const saveAddress = () => {
    if (!runAllValidation()) return;

    const newAddr = {
      id: Date.now(),
      name: `${draft.firstName} ${draft.lastName}`.trim() || "Rahul Sharma",

      line1: draft.street || "Flat 5B, Shanti Residency,",

      line2: "24 MG Road, Indiranagar, Karnataka,",

      line3: `Bengaluru-${draft.pin || "560038"}`,

      phone: draft.phone || "+91 98765 43210",
    };

    setAddresses((prev) => [...prev, newAddr]);

    setSelectedAddressId(newAddr.id);

    setShowAddressForm(false);

    setDraft(emptyDraft);
  };

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));

    if (selectedAddressId === id) {
      setSelectedAddressId(null);
    }
  };

  const handleContinue = () => {
    const address = addresses.find((a) => a.id === selectedAddressId);

    navigate("/cart/payment", {
      state: {
        personal,
        address,
      },
    });
  };

  const itemsSummaryCard = (
    <div className="card">
      <div className="items-card-head">
        <span>{cartItems.length} Total Items</span>
        <button className="edit-pill" onClick={() => navigate("/cart/details")}>
          Edit
        </button>
      </div>

      <div className="thumb-row">
        {cartItems.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Iphone 17pro"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImg;
            }}
          />
        ))}
      </div>

      <p className="saved-text">You saved ₹ {savedAmount}!</p>

      <p className="price-line">
        ₹ {currentPrice.toLocaleString("en-IN")}
        <span className="strike">
          ₹ {originalPrice.toLocaleString("en-IN")}
        </span>
      </p>
    </div>
  );

  const sectionIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22C12 22 4 17.5 4 11V5L12 2L20 5V11C20 17.5 12 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const bodyContent =
    showAddressForm || addresses.length === 0 ? (
      <>
        {itemsSummaryCard}

        <div className="field-label">
          {sectionIcon}
          Address Details
        </div>

        <input
          placeholder="First Name"
          value={draft.firstName}
          onChange={update("firstName")}
          onBlur={handleBlur("firstName")}
          className={fieldError("firstName") ? "input-error" : ""}
        />
        {fieldError("firstName") && (
          <p className="error-text">{errors.firstName}</p>
        )}

        <input
          placeholder="Last Name"
          value={draft.lastName}
          onChange={update("lastName")}
          onBlur={handleBlur("lastName")}
          className={fieldError("lastName") ? "input-error" : ""}
        />
        {fieldError("lastName") && (
          <p className="error-text">{errors.lastName}</p>
        )}

        <div
          className={`phone-row ${fieldError("phone") ? "input-error" : ""}`}
        >
          <span className="cc-badge">IN ▾</span>

          <input
            placeholder="Phone Number"
            value={draft.phone}
            onChange={update("phone")}
            onBlur={handleBlur("phone")}
            inputMode="numeric"
            maxLength={10}
          />

          <span className="qmark">?</span>
        </div>
        {fieldError("phone") && <p className="error-text">{errors.phone}</p>}

        <div className="radio-row">
          <div
            className="radio-item"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                type: "home",
              }))
            }
          >
            <div className={`radio-dot ${draft.type === "home" ? "on" : ""}`} />
            Home
          </div>

          <div
            className="radio-item"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                type: "office",
              }))
            }
          >
            <div
              className={`radio-dot ${draft.type === "office" ? "on" : ""}`}
            />
            Office
          </div>
        </div>

        <input
          placeholder="Street Address"
          value={draft.street}
          onChange={update("street")}
          onBlur={handleBlur("street")}
          className={fieldError("street") ? "input-error" : ""}
        />
        {fieldError("street") && <p className="error-text">{errors.street}</p>}

        <input
          placeholder="Land Mark"
          value={draft.landmark}
          onChange={update("landmark")}
          onBlur={handleBlur("landmark")}
        />

        <input
          placeholder="Postal Pin"
          value={draft.pin}
          onChange={update("pin")}
          onBlur={handleBlur("pin")}
          inputMode="numeric"
          maxLength={6}
          className={fieldError("pin") ? "input-error" : ""}
        />
        {fieldError("pin") && <p className="error-text">{errors.pin}</p>}

        <input
          placeholder="State"
          value={draft.state}
          onChange={update("state")}
          onBlur={handleBlur("state")}
          className={fieldError("state") ? "input-error" : ""}
        />
        {fieldError("state") && <p className="error-text">{errors.state}</p>}

        <input
          placeholder="City"
          value={draft.city}
          onChange={update("city")}
          onBlur={handleBlur("city")}
          className={fieldError("city") ? "input-error" : ""}
        />
        {fieldError("city") && <p className="error-text">{errors.city}</p>}

        <button
          className="full-continue-btn"
          disabled={!canSave}
          onClick={saveAddress}
        >
          Save Address
        </button>

        {addresses.length > 0 && (
          <button
            className="continue-btn"
            style={{
              width: "100%",
              marginTop: 12,
              padding: 16,
            }}
            onClick={() => setShowAddressForm(false)}
          >
            Cancel
          </button>
        )}
      </>
    ) : (
      <>
        {itemsSummaryCard}

        <div className="field-label">
          {sectionIcon}
          Address Details
        </div>

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`addr-card ${
              selectedAddressId === addr.id ? "selected" : ""
            }`}
            onClick={() => setSelectedAddressId(addr.id)}
          >
            <div className="addr-top">
              <div
                className={`radio-dot ${
                  selectedAddressId === addr.id ? "on" : ""
                }`}
              />
              <b>{addr.name}</b>
            </div>

            <p className="addr-lines">
              {addr.line1}
              <br />
              {addr.line2}
              <br />
              {addr.line3}
            </p>

            <p className="addr-phone">Phone No: {addr.phone}</p>

            <div className="addr-actions">
              <button
                className="remove-link"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAddress(addr.id);
                }}
              >
                REMOVE 🗑
              </button>

              <button
                className="edit-link"
                onClick={(e) => e.stopPropagation()}
              >
                EDIT
              </button>
            </div>
          </div>
        ))}

        <button
          className="add-new-btn"
          onClick={() => setShowAddressForm(true)}
        >
          Add New Address
        </button>

        <p className="expected-title">Expected Delivery</p>

        <div className="expected-row">
          <img src={productImg} alt="Iphone 17pro" />

          <div>
            <p className="expected-name">Iphone 17pro - (12,256)</p>

            <p className="expected-date">
              Delivery by: <b>20 Aug, 2026</b>
            </p>
          </div>
        </div>

        <div className="bottom-bar">
          <button className="total-btn">Total = ${total.toFixed(2)}</button>

          <button
            className="continue-btn"
            disabled={!selectedAddressId}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </>
    );

  return (
    <div className="checkout-page">
      {/* ---------------- Mobile ---------------- */}

      <div className="checkout-mobile">
        <div className="top-bar">
          <button
            className="icon-btn"
            onClick={() => navigate("/cart/details")}
          >
            {backIcon}
          </button>

          <h1>Cart</h1>

          <div className="info-circle">i</div>
        </div>

        <div className="stepper-wrap">
          <MobileStepper current={2} />
        </div>

        <div className="content">{bodyContent}</div>
      </div>

      {/* ---------------- Desktop ---------------- */}

      <div className="cd-desktop">
        <aside className="od-sidebar">
          <div className="od-avatar" />

          <h2 className="od-name">Checkout</h2>

          <p className="od-phone">Step 2 of 3</p>

          <nav className="od-steps">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`od-step
                  ${step.num === 2 ? "active" : step.num < 2 ? "done" : ""}`}
              >
                <span className="od-step-num">
                  {step.num < 2 ? "✓" : step.num}
                </span>

                <span>{step.label}</span>
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
            <h1>Delivery Address</h1>
          </div>

          <div className="content">{bodyContent}</div>
        </div>
      </div>
    </div>
  );
}
