import { useState } from "react";
import { FiLock } from "react-icons/fi";
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

export default function ChangePassword() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setError("");
    setSuccess("");
  };

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
      setError(err.message || "Unable to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  const formCard = (
    <form className="change-password-card" onSubmit={handleSubmit}>
      <div className="change-password-icon">
        <FiLock />
      </div>

      <h2>Change Password</h2>
      <p className="change-password-sub">
        Choose a strong password you don't use elsewhere.
      </p>

      <label className="change-password-field">
        <span>Current Password</span>
        <input
          type="password"
          value={form.currentPassword}
          onChange={handleChange("currentPassword")}
          autoComplete="current-password"
          placeholder="Enter current password"
        />
      </label>

      <label className="change-password-field">
        <span>New Password</span>
        <input
          type="password"
          value={form.newPassword}
          onChange={handleChange("newPassword")}
          autoComplete="new-password"
          placeholder="Enter new password"
        />
      </label>

      <label className="change-password-field">
        <span>Confirm New Password</span>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          autoComplete="new-password"
          placeholder="Re-enter new password"
        />
      </label>

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

          {formCard}
        </div>
      </div>
    </div>
  );
}
