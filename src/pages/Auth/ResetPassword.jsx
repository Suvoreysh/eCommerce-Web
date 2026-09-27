// ResetPassword.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../../api/config";
import "./ResetPassword.css";
import Logo from "../../assets/images/logo-small.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !token) setError("Invalid or expired reset link.");
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await apiRequest(ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        body: {
          email_id: email,
          token,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  return (
    <div className="rp-root">
      <div className="rp-outer-card">
        {/* Logo */}
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: "120px",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
        <div className="rp-divider" />

        {/* Body */}
        <div className="rp-body">
          {success ? (
            <div className="rp-success-wrap">
              <div className="rp-key-icon">✅</div>
              <h1 className="rp-heading">Password Updated!</h1>
              <p className="rp-desc">
                Your password has been reset successfully.
                <br />
                Redirecting you to login…
              </p>
            </div>
          ) : (
            <>
              <div className="rp-key-icon">🔑</div>
              <h1 className="rp-heading">Reset Your Password</h1>
              <p className="rp-desc">
                Enter your new password below. This reset link will expire in{" "}
                <strong>30 minutes</strong>.
              </p>

              {/* Info box */}
              <div className="rp-info-box">
                <h3 className="rp-info-title">Password Reset Requested</h3>
                <p className="rp-info-text">
                  {email ? (
                    <>
                      Resetting for <strong>{email}</strong>.{" "}
                    </>
                  ) : (
                    ""
                  )}
                  For your security, this link can only be used once.
                </p>
              </div>

              {error && <div className="rp-error">{error}</div>}

              <form className="rp-form" onSubmit={handleSubmit} noValidate>
                <div className="rp-field">
                  <label htmlFor="rp-new">New Password</label>
                  <div className="rp-input-wrap">
                    <input
                      id="rp-new"
                      type={showNew ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      disabled={!email || !token || loading}
                    />
                    <button
                      type="button"
                      className="rp-eye"
                      onClick={() => setShowNew((v) => !v)}
                      tabIndex={-1}
                      aria-label="Toggle visibility"
                    >
                      <EyeIcon open={showNew} />
                    </button>
                  </div>
                </div>

                <div className="rp-field">
                  <label htmlFor="rp-confirm">Confirm Password</label>
                  <div className="rp-input-wrap">
                    <input
                      id="rp-confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      disabled={!email || !token || loading}
                    />
                    <button
                      type="button"
                      className="rp-eye"
                      onClick={() => setShowConfirm((v) => !v)}
                      tabIndex={-1}
                      aria-label="Toggle visibility"
                    >
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="rp-submit"
                  disabled={loading || !email || !token}
                >
                  {loading ? <span className="rp-spinner" /> : "Reset Password"}
                </button>
              </form>

              <p className="rp-security-note">
                If you didn't request a password reset, you can safely ignore
                this. Never share your account credentials with anyone.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="rp-footer">
          <p className="rp-footer-main">
            Didn't request a password reset? No action is required. Your account
            remains secure.
          </p>
          <p className="rp-footer-copy">© 2026 Spaknit. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
