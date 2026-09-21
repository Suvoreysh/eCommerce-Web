import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCrosshair, FiHome, FiMapPin } from "react-icons/fi";

import Seo from "../../components/common/Seo";
import AccountSidebar from "../../components/profile/AccountSidebar";
import BackHomeButton from "../../components/profile/BackHomeButton";
import { addressApi } from "../../api/addressApi";
import { detectCurrentAddress } from "../../utils/geolocation";
import "../Cart/Cart.css";
import "./AddressBook.css";
import "./AddressForm.css";

const ADDRESS_TYPES = ["home", "office", "other"];

const emptyForm = {
  address_type: "home",
  full_name: "",
  phone_number: "",
  house_name: "",
  street_name: "",
  full_address: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "IN",
  latitude: "",
  longitude: "",
  is_default: false,
};

export default function AddressForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [locationNote, setLocationNote] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        setLoading(true);
        const res = await addressApi.getById(id);
        const data = res?.data || res || {};
        setForm((prev) => ({ ...prev, ...data }));
      } catch (err) {
        setError(err.message || "Unable to load this address.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUseCurrentLocation = async () => {
    setError("");
    setLocationNote("");

    try {
      setLocating(true);
      const detected = await detectCurrentAddress();

      setForm((prev) => ({
        ...prev,
        full_address: detected.fullAddress || prev.full_address,
        house_name: detected.houseName || prev.house_name,
        street_name: detected.streetName || prev.street_name,
        landmark: detected.landmark || prev.landmark,
        city: detected.city || prev.city,
        state: detected.state || prev.state,
        pincode: detected.pincode || prev.pincode,
        country: detected.country || prev.country,
        latitude: detected.latitude,
        longitude: detected.longitude,
      }));

      setLocationNote(
        "Location detected — please double-check the details below.",
      );
    } catch (err) {
      setError(err.message || "Unable to detect your current location.");
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.full_name || !form.phone_number || !form.full_address) {
      setError("Please fill in name, phone number and address.");
      return;
    }

    const payload = {
      ...form,
      is_default: form.is_default ? "1" : "0",
      status: "active",
    };

    try {
      setSubmitting(true);

      if (isEdit) {
        await addressApi.update(id, payload);
      } else {
        await addressApi.create(payload);
      }

      navigate("/address", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to save this address.");
    } finally {
      setSubmitting(false);
    }
  };

  const title = isEdit ? "Edit Address" : "Add New Address";

  const previewLine1 = [form.house_name, form.street_name, form.full_address]
    .filter(Boolean)
    .join(", ");
  const previewLine2 = [form.landmark].filter(Boolean).join(", ");
  const previewLine3 = [form.city, form.state, form.pincode, form.country]
    .filter(Boolean)
    .join(", ");

  const hasPreviewContent = useMemo(
    () =>
      Boolean(
        form.full_name ||
          form.phone_number ||
          previewLine1 ||
          previewLine3,
      ),
    [form.full_name, form.phone_number, previewLine1, previewLine3],
  );

  const formCard = (
    <form className="addr-form-card" onSubmit={handleSubmit}>
      <div className="addr-form-head">
        <div className="addr-form-head-icon">
          <FiHome />
        </div>

        <div>
          <h2>{title}</h2>
          <p>
            Fill in the details below, or use your current location to
            auto-fill the address.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="addr-locate-btn"
        onClick={handleUseCurrentLocation}
        disabled={locating}
      >
        <FiCrosshair />
        {locating ? "Detecting your location…" : "Use current location"}
      </button>

      {locationNote && <p className="addr-locate-note">{locationNote}</p>}

      <div className="addr-form-type-group">
        {ADDRESS_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`addr-type-chip${
              form.address_type === type ? " addr-type-chip--active" : ""
            }`}
            onClick={() =>
              setForm((prev) => ({ ...prev, address_type: type }))
            }
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="addr-form-grid">
        <label className="addr-field">
          <span>Full Name</span>
          <input
            type="text"
            value={form.full_name}
            onChange={handleChange("full_name")}
            placeholder="Enter full name"
          />
        </label>

        <label className="addr-field">
          <span>Phone Number</span>
          <input
            type="tel"
            value={form.phone_number}
            onChange={handleChange("phone_number")}
            placeholder="Enter phone number"
          />
        </label>

        <label className="addr-field">
          <span>House / Flat No.</span>
          <input
            type="text"
            value={form.house_name}
            onChange={handleChange("house_name")}
            placeholder="House / Flat name"
          />
        </label>

        <label className="addr-field">
          <span>Street</span>
          <input
            type="text"
            value={form.street_name}
            onChange={handleChange("street_name")}
            placeholder="Street name"
          />
        </label>

        <label className="addr-field addr-field--full">
          <span>Full Address</span>
          <input
            type="text"
            value={form.full_address}
            onChange={handleChange("full_address")}
            placeholder="Full address"
          />
        </label>

        <label className="addr-field">
          <span>Landmark</span>
          <input
            type="text"
            value={form.landmark}
            onChange={handleChange("landmark")}
            placeholder="Nearby landmark (optional)"
          />
        </label>

        <label className="addr-field">
          <span>City</span>
          <input
            type="text"
            value={form.city}
            onChange={handleChange("city")}
            placeholder="City"
          />
        </label>

        <label className="addr-field">
          <span>State</span>
          <input
            type="text"
            value={form.state}
            onChange={handleChange("state")}
            placeholder="State"
          />
        </label>

        <label className="addr-field">
          <span>Pincode</span>
          <input
            type="text"
            value={form.pincode}
            onChange={handleChange("pincode")}
            placeholder="Pincode"
          />
        </label>

        <label className="addr-field">
          <span>Country</span>
          <input
            type="text"
            value={form.country}
            onChange={handleChange("country")}
            placeholder="Country"
          />
        </label>
      </div>

      <label className="addr-form-checkbox">
        <input
          type="checkbox"
          checked={Boolean(form.is_default)}
          onChange={handleChange("is_default")}
        />
        <span>Set as default address</span>
      </label>

      {error && <p className="addr-form-error">{error}</p>}

      <button
        type="submit"
        className="addr-form-submit"
        disabled={submitting || loading}
      >
        {submitting ? "Saving…" : "Save Address"}
      </button>
    </form>
  );

  const previewPanel = (
    <aside className="addr-preview-panel">
      <div className="addr-preview-icon">
        <FiMapPin />
      </div>

      <h3>Address Preview</h3>
      <p>This is how your address will look once saved.</p>

      {hasPreviewContent ? (
        <div className="addr-preview-card">
          <span className="addr-preview-type">
            {form.address_type
              ? form.address_type.charAt(0).toUpperCase() +
                form.address_type.slice(1)
              : "Address"}
          </span>

          <strong>{form.full_name || "Full name"}</strong>
          <span className="addr-preview-phone">
            {form.phone_number || "Phone number"}
          </span>

          <p>
            {previewLine1 || "House / street / full address"}
            {previewLine2 && (
              <>
                <br />
                {previewLine2}
              </>
            )}
            <br />
            {previewLine3 || "City, state, pincode, country"}
          </p>
        </div>
      ) : (
        <div className="addr-preview-empty">
          Start filling in the form to see a live preview here.
        </div>
      )}

      <div className="addr-preview-note">
        <p>
          Double-check the pincode and phone number — they're used for
          delivery updates and can't be edited after checkout begins.
        </p>
      </div>
    </aside>
  );

  return (
    <div className="cart-page">
      <Seo title={title} description="Add or edit a delivery address." />

      {/* ---------- Mobile header ---------- */}
      <header className="cart-header">
        <BackHomeButton className="back-btn" />
        <h1>{title}</h1>
      </header>

      {/* ---------- Mobile body ---------- */}
      <div className="mobile-list addr-form-mobile">
        {loading ? <p className="addr-empty">Loading…</p> : formCard}
      </div>

      {/* ---------- Desktop layout ---------- */}
      <div className="cd-desktop">
        <AccountSidebar />

        <div className="od-main">
          <div className="od-main-header">
            <div className="od-main-title">
              <BackHomeButton className="od-desktop-back-btn" />
              <h1>{title}</h1>
            </div>
          </div>

          {loading ? (
            <p className="addr-empty">Loading…</p>
          ) : (
            <div className="addr-form-layout">
              {formCard}
              {previewPanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
