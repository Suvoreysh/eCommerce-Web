import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addressApi } from "../../api/addressApi";
import { cartApi } from "../../api/cartApi";
import { checkoutApi } from "../../api/checkoutApi";
import { useCheckout } from "../../context/CheckoutContext";
import { resolveImageUrl } from "../../utils/image";
import { firstErrorMessage, formatINR } from "../../utils/format";
import Stepper from "../../components/cart/Stepper";
import "./Checkout.css";

const fallbackImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='14' fill='%23f0f1f3'/></svg>";

const emptyDraft = {
  address_type: "office",
  full_name: "",
  phone_number: "",
  house_name: "",
  street_name: "",
  full_address: "",
  landmark: "",
  pincode: "",
  state: "",
  city: "",
  country: "IN",
};

const steps = [
  { num: 1, label: "Personal Details" },
  { num: 2, label: "Delivery Address" },
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

// ---------- Validation ----------
const NAME_VALID_RE = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
const PHONE_VALID_RE = /^[0-9]{10}$/;
const PIN_VALID_RE = /^[0-9]{6}$/;

const validators = {
  full_name: (v) => {
    if (!v.trim()) return "Full name is required";
    if (!NAME_VALID_RE.test(v.trim())) return "Only letters and spaces are allowed";
    return "";
  },
  phone_number: (v) => {
    if (!v) return "Phone number is required";
    if (!PHONE_VALID_RE.test(v)) return "Enter a valid 10-digit phone number";
    return "";
  },
  full_address: (v) => (!v.trim() ? "Street address is required" : ""),
  pincode: (v) => {
    if (!v) return "Postal pin is required";
    if (!PIN_VALID_RE.test(v)) return "Enter a valid 6-digit pin code";
    return "";
  },
  state: (v) => (!v.trim() ? "State is required" : ""),
  city: (v) => (!v.trim() ? "City is required" : ""),
};

function addressLines(addr) {
  const line1 = [addr.house_name, addr.street_name, addr.full_address]
    .filter(Boolean)
    .join(", ");
  const line2 = [addr.landmark].filter(Boolean).join(", ");
  const line3 = [addr.city, addr.state, addr.pincode, addr.country]
    .filter(Boolean)
    .join(", ");
  return { line1, line2, line3 };
}

export default function Delivery() {
  const navigate = useNavigate();
  const { userDetails, address, setAddress } = useCheckout();

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(address?.id ?? null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [draft, setDraft] = useState({
    ...emptyDraft,
    full_name: userDetails?.fullName || userDetails?.full_name || "",
    phone_number: userDetails?.phone || userDetails?.phone_number || "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [continuing, setContinuing] = useState(false);
  const [continueError, setContinueError] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [cartMeta, setCartMeta] = useState({ subtotal: 0, discount: 0, totalItems: 0 });

  useEffect(() => {
    let active = true;

    const loadAddresses = async () => {
      try {
        setAddressesLoading(true);
        const response = await addressApi.list();
        if (!active) return;

        const list = Array.isArray(response?.data) ? response.data : [];
        setAddresses(list);

        const defaultAddr = list.find((a) => a.is_default) || list[0];
        if (defaultAddr && selectedAddressId === null) {
          setSelectedAddressId(defaultAddr.id);
        }
        setShowAddressForm(list.length === 0);
      } catch (err) {
        console.error("Get addresses failed:", err);
        setShowAddressForm(true);
      } finally {
        if (active) setAddressesLoading(false);
      }
    };

    loadAddresses();
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
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const update = (key) => (e) => {
    let value = e.target.value;
    if (key === "phone_number") value = value.replace(/\D/g, "").slice(0, 10);
    if (key === "pincode") value = value.replace(/\D/g, "").slice(0, 6);

    setDraft((d) => ({ ...d, [key]: value }));
    if (touched[key] && validators[key]) {
      setErrors((er) => ({ ...er, [key]: validators[key](value) }));
    }
  };

  const handleBlur = (key) => () => {
    if (!validators[key]) return;
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
    setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const canSave = Object.keys(validators).every(
    (key) => draft[key] && !validators[key](draft[key]),
  );

  const saveAddress = async () => {
    if (!runAllValidation()) return;

    setSaveError("");
    setSaving(true);

    try {
      const payload = { ...draft, status: "active" };
      const response = await addressApi.create(payload);
      const newId = response?.data?.id ?? response?.id;

      const savedAddress = { ...payload, id: newId };
      setAddresses((prev) => [...prev, savedAddress]);
      setSelectedAddressId(newId);
      setShowAddressForm(false);
      setDraft({ ...emptyDraft, full_name: draft.full_name, phone_number: draft.phone_number });
      setTouched({});
    } catch (err) {
      console.error("Create address failed:", err);
      setSaveError(firstErrorMessage(err, "Unable to save this address."));
    } finally {
      setSaving(false);
    }
  };

  const removeAddress = async (id) => {
    try {
      await addressApi.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      console.error("Remove address failed:", err);
      setSaveError(firstErrorMessage(err, "Unable to remove this address."));
    }
  };

  const handleContinue = async () => {
    const chosen = addresses.find((a) => a.id === selectedAddressId);
    if (!chosen) return;

    setContinuing(true);
    setContinueError("");

    try {
      // Non-fatal: place-order will still carry address_id explicitly.
      await checkoutApi.setDeliveryAddress(chosen.id);
    } catch (err) {
      console.error("Set delivery address failed:", err);
    }

    setAddress(chosen);
    setContinuing(false);
    navigate("/cart/payment");
  };

  const payable = cartMeta.subtotal - cartMeta.discount;

  const itemsSummaryCard = (
    <div className="card">
      <div className="items-card-head">
        <span>{cartMeta.totalItems} Total Items</span>
        <button className="edit-pill" onClick={() => navigate("/cart/details")}>
          Edit
        </button>
      </div>

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
        <p className="saved-text">You saved {formatINR(cartMeta.discount)}!</p>
      )}

      <p className="price-line">
        {formatINR(payable)}
        {cartMeta.discount > 0 && (
          <span className="strike">{formatINR(cartMeta.subtotal)}</span>
        )}
      </p>
    </div>
  );

  const bodyContent =
    showAddressForm || addresses.length === 0 ? (
      <>
        {itemsSummaryCard}

        <div className="field-label">
          {sectionIcon}
          Address Details
        </div>

        {saveError && <p className="error-text">{saveError}</p>}

        <input
          placeholder="Full Name"
          value={draft.full_name}
          onChange={update("full_name")}
          onBlur={handleBlur("full_name")}
          className={fieldError("full_name") ? "input-error" : ""}
        />
        {fieldError("full_name") && <p className="error-text">{errors.full_name}</p>}

        <div className={`phone-row ${fieldError("phone_number") ? "input-error" : ""}`}>
          <span className="cc-badge">IN ▾</span>
          <input
            placeholder="Phone Number"
            value={draft.phone_number}
            onChange={update("phone_number")}
            onBlur={handleBlur("phone_number")}
            inputMode="numeric"
            maxLength={10}
          />
        </div>
        {fieldError("phone_number") && (
          <p className="error-text">{errors.phone_number}</p>
        )}

        <div className="radio-row">
          <div
            className="radio-item"
            onClick={() => setDraft((d) => ({ ...d, address_type: "home" }))}
          >
            <div className={`radio-dot ${draft.address_type === "home" ? "on" : ""}`} />
            Home
          </div>
          <div
            className="radio-item"
            onClick={() => setDraft((d) => ({ ...d, address_type: "office" }))}
          >
            <div className={`radio-dot ${draft.address_type === "office" ? "on" : ""}`} />
            Office
          </div>
        </div>

        <input
          placeholder="House / Flat Name"
          value={draft.house_name}
          onChange={update("house_name")}
        />

        <input
          placeholder="Street Address"
          value={draft.full_address}
          onChange={update("full_address")}
          onBlur={handleBlur("full_address")}
          className={fieldError("full_address") ? "input-error" : ""}
        />
        {fieldError("full_address") && (
          <p className="error-text">{errors.full_address}</p>
        )}

        <input
          placeholder="Land Mark"
          value={draft.landmark}
          onChange={update("landmark")}
        />

        <input
          placeholder="Postal Pin"
          value={draft.pincode}
          onChange={update("pincode")}
          onBlur={handleBlur("pincode")}
          inputMode="numeric"
          maxLength={6}
          className={fieldError("pincode") ? "input-error" : ""}
        />
        {fieldError("pincode") && <p className="error-text">{errors.pincode}</p>}

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
          disabled={!canSave || saving}
          onClick={saveAddress}
        >
          {saving ? "Saving..." : "Save Address"}
        </button>

        {addresses.length > 0 && (
          <button
            className="continue-btn"
            style={{ width: "100%", marginTop: 12, padding: 16 }}
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

        {continueError && <p className="error-text">{continueError}</p>}

        {addresses.map((addr) => {
          const { line1, line2, line3 } = addressLines(addr);
          return (
            <div
              key={addr.id}
              className={`addr-card ${selectedAddressId === addr.id ? "selected" : ""}`}
              onClick={() => setSelectedAddressId(addr.id)}
            >
              <div className="addr-top">
                <div className={`radio-dot ${selectedAddressId === addr.id ? "on" : ""}`} />
                <b>{addr.full_name}</b>
              </div>

              <p className="addr-lines">
                {line1}
                {line1 && <br />}
                {line2}
                {line2 && <br />}
                {line3}
              </p>

              <p className="addr-phone">Phone No: {addr.phone_number}</p>

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
              </div>
            </div>
          );
        })}

        <button className="add-new-btn" onClick={() => setShowAddressForm(true)}>
          Add New Address
        </button>

        <div className="bottom-bar">
          <button className="total-btn">Total = {formatINR(payable)}</button>
          <button
            className="continue-btn"
            disabled={!selectedAddressId || continuing}
            onClick={handleContinue}
          >
            {continuing ? "Please wait..." : "Continue"}
          </button>
        </div>
      </>
    );

  return (
    <div className="checkout-page">
      <div className="checkout-mobile">
        <div className="top-bar">
          <button className="icon-btn" onClick={() => navigate("/cart/details")}>
            {backIcon}
          </button>
          <h1>Cart</h1>
          <div className="info-circle">i</div>
        </div>
        <div className="stepper-wrap">
          <Stepper current={2} />
        </div>
        <div className="content">{bodyContent}</div>
      </div>

      <div className="cd-desktop">
        <aside className="od-sidebar">
          <div className="od-avatar" />
          <h2 className="od-name">Checkout</h2>
          <p className="od-phone">Step 2 of 3</p>

          <nav className="od-steps">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`od-step ${step.num === 2 ? "active" : step.num < 2 ? "done" : ""}`}
              >
                <span className="od-step-num">{step.num < 2 ? "✓" : step.num}</span>
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
