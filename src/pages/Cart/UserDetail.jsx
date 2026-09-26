import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";
import { checkoutApi } from "../../api/checkoutApi";
import { useCheckout } from "../../context/CheckoutContext";
import { resolveImageUrl } from "../../utils/image";
import { firstErrorMessage, formatINR } from "../../utils/format";
import Stepper from "../../components/cart/Stepper";
import "./Checkout.css";

const fallbackImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='14' fill='%23f0f1f3'/></svg>";

const steps = [
  { num: 1, label: "Personal Details" },
  { num: 2, label: "Delivery Address" },
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

// ---------- Validation ----------
const EMAIL_VALID_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_VALID_RE = /^[0-9]{10}$/;

const validators = {
  fullName: (v) => (!v.trim() ? "Full name is required" : ""),
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
  country: (v) => (!v.trim() ? "Country is required" : ""),
};

export default function UserDetail() {
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useCheckout();

  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [cartMeta, setCartMeta] = useState({
    subtotal: 0,
    discount: 0,
    totalItems: 0,
  });
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoadingDetails(true);
        setLoadError("");
        const response = await checkoutApi.getUserDetails();
        if (!active) return;

        const data = response?.data || {};
        const prefilled = {
          fullName:
            data.full_name ||
            [data.first_name, data.last_name].filter(Boolean).join(" "),
          email: data.email_id || "",
          phone: data.phone_number || "",
          country: data.country || "India",
        };

        setPersonal(prefilled);
        setUserDetails(data);
      } catch (err) {
        if (!active) return;
        console.error("Get checkout user details failed:", err);
        setLoadError(firstErrorMessage(err, "Unable to load your details."));
      } finally {
        if (active) setLoadingDetails(false);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await cartApi.getCart();
        if (!active) return;

        const data = response?.data;
        setCartItems(Array.isArray(data?.items) ? data.items : []);
        setCartMeta({
          subtotal: Number(data?.subtotal ?? 0),
          discount: Number(data?.discount ?? 0),
          totalItems: Number(data?.total_items ?? 0),
        });
      } catch (err) {
        console.error("Get cart failed:", err);
      } finally {
        if (active) setCartLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const update = (key) => (e) => {
    const value = e.target.value;
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
    setUserDetails((previous) => ({ ...previous, ...personal }));
    navigate("/cart/delivery");
  };

  const payable = cartMeta.subtotal - cartMeta.discount;

  const formContent = (
    <div className="content">
      <div className="card">
        <div className="items-card-head">
          <span>{cartMeta.totalItems} Total Items</span>
          <button className="edit-pill" onClick={() => navigate("/cart")}>
            Edit
          </button>
        </div>

        {cartLoading ? (
          <p className="saved-text" style={{ color: "#6b6b6b" }}>
            Loading your cart…
          </p>
        ) : (
          <>
            <div className="thumb-row">
              {cartItems.map((it) => (
                <img
                  key={it.id}
                  src={resolveImageUrl(it.image)}
                  alt={it.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImg;
                  }}
                />
              ))}
            </div>
            {cartMeta.discount > 0 && (
              <p className="saved-text">
                You saved {formatINR(cartMeta.discount)}!
              </p>
            )}
            <div className="price-line">
              {formatINR(payable)}
              {cartMeta.discount > 0 && (
                <span className="strike">{formatINR(cartMeta.subtotal)}</span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="field-label">
        {personIcon}
        Personal Details
      </div>

      {loadError && <p className="error-text">{loadError}</p>}

      <input
        placeholder="Full Name"
        value={personal.fullName}
        onChange={update("fullName")}
        onBlur={handleBlur("fullName")}
        disabled={loadingDetails}
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
        disabled={loadingDetails}
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
          disabled={loadingDetails}
          inputMode="numeric"
          maxLength={10}
        />
      </div>
      {touched.phone && errors.phone && (
        <p className="error-text">{errors.phone}</p>
      )}

      <input
        placeholder="Country Name"
        value={personal.country}
        onChange={update("country")}
        onBlur={handleBlur("country")}
        disabled={loadingDetails}
        className={touched.country && errors.country ? "input-error" : ""}
      />
      {touched.country && errors.country && (
        <p className="error-text">{errors.country}</p>
      )}

      <button
        className="full-continue-btn"
        disabled={!canContinue || loadingDetails}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-mobile">
        <div className="top-bar">
          <button className="icon-btn" onClick={() => navigate("/cart")}>
            {backIcon}
          </button>
          <h1>Cart</h1>
          <div className="info-circle">i</div>
        </div>
        <div className="stepper-wrap">
          <Stepper current={1} />
        </div>
        {formContent}
      </div>

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
