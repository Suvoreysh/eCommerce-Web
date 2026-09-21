import { useMemo, useState } from "react";
import { FiLock, FiShield, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import Seo from "../../components/common/Seo";
import { authApi } from "../../api/authApi";
import AccountSidebar from "../../components/profile/AccountSidebar";
import BackHomeButton from "../../components/profile/BackHomeButton";
import "../Cart/Cart.css";
import "./ChangePassword.css";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const RULES = [
  { key: "length", label: "At least 6 characters", test: (v) => v.length >= 6 },
  { key: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "number", label: "One number", test: (v) => /\d/.test(v) },
  {
    key: "match",
    label: "Matches confirmation",
    test: (v, all) => v && v === all.confirmPassword,
  },
];

// Turns the API's { success:false, errors: { field: ["msg", ...] } } shape
// into a single readable string. Falls back gracefully for any other
// error shape (network error, generic message, etc).
function extractErrorMessage(err, fallback) {
  const fieldErrors = err?.errors;

  if (fieldErrors && typeof fieldErrors === "object") {
    const firstMessage = Object.values(fieldErrors)
      .flat()
      .find((msg) => typeof msg === "string");

    if (firstMessage) return firstMessage;
  }

  if (err?.message && !/^Request failed/i.test(err.message)) {
    return err.message;
  }

  return fallback;
}

export default function ChangePassword() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setError("");
    setSuccess("");
  };

  const toggleVisible = (field) => {
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const checklist = useMemo(
    () =>
      RULES.map((rule) => ({
        ...rule,
        met: rule.test(form.newPassword, form),
      })),
    [form],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password don't match.");
      return;
    }

    if (form.newPassword === form.currentPassword) {
      setError("The new password and current password must be different.");
      return;
    }

    try {
      setSubmitting(true);
      await authApi.changePassword({
        current_password: form.currentPassword,
        new_password: form.newPassword,
        new_password_confirmation: form.confirmPassword,
      });
      setSuccess("Password updated successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(extractErrorMessage(err, "Unable to change password."));
    } finally {
      setSubmitting(false);
    }
  };

  const passwordField = (
    field,
    label,
    placeholder,
    autoComplete,
    extraClass = "",
  ) => (
    <label className={`change-password-field ${extraClass}`}>
      <span>{label}</span>
      <div className="cp-input-wrap">
        <input
          type={visible[field] ? "text" : "password"}
          value={form[field]}
          onChange={handleChange(field)}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="cp-eye-toggle"
          onClick={() => toggleVisible(field)}
          tabIndex={-1}
          aria-label={visible[field] ? "Hide password" : "Show password"}
        >
          {visible[field] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </label>
  );

  const formCard = (
    <form className="change-password-card" onSubmit={handleSubmit}>
      <div className="change-password-icon">
        <FiLock />
      </div>

      <h2>Change Password</h2>
      <p className="change-password-sub">
        Choose a strong password you don't use elsewhere.
      </p>

      <div className="cp-form-grid">
        {passwordField(
          "currentPassword",
          "Current Password",
          "Enter current password",
          "current-password",
          "cp-field--full",
        )}

        {passwordField(
          "newPassword",
          "New Password",
          "Enter new password",
          "new-password",
        )}

        {passwordField(
          "confirmPassword",
          "Confirm New Password",
          "Re-enter new password",
          "new-password",
        )}
      </div>

      {error && <p className="change-password-error">{error}</p>}
      {success && <p className="change-password-success">{success}</p>}

      <button
        type="submit"
        className="change-password-submit"
        disabled={submitting}
      >
        {submitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );

  const tipsPanel = (
    <aside className="cp-tips-panel">
      <div className="cp-tips-icon">
        <FiShield />
      </div>

      <h3>Password strength</h3>
      <p>Your new password should meet these guidelines:</p>

      <ul className="cp-tips-list">
        {checklist.map((rule) => (
          <li key={rule.key} className={rule.met ? "cp-tip--met" : ""}>
            <span className="cp-tip-check">
              <FiCheck />
            </span>
            {rule.label}
          </li>
        ))}
      </ul>

      <div className="cp-tips-note">
        <p>
          Avoid reusing passwords from other sites, and never share your
          password with anyone — our support team will never ask for it.
        </p>
      </div>
    </aside>
  );

  return (
    <div className="cart-page">
      <Seo title="Change Password" />

      {/* ---------- Mobile header (same pattern as Cart/Wishlist) ---------- */}
      <header className="cart-header">
        <BackHomeButton className="back-btn" />
        <h1>Change Password</h1>
      </header>

      {/* ---------- Mobile body ---------- */}
      <div className="mobile-list change-password-mobile">{formCard}</div>

      {/* ---------- Desktop layout ---------- */}
      <div className="cd-desktop">
        <AccountSidebar />

        <div className="od-main">
          <div className="od-main-header">
            <div className="od-main-title">
              <BackHomeButton className="od-desktop-back-btn" />
              <h1>Change Password</h1>
            </div>
          </div>

          <div className="cp-desktop-layout">
            {formCard}
            {tipsPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
