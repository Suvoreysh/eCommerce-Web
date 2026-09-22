import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FiMail } from "react-icons/fi";

import Seo from "../../components/common/Seo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { rules, validateForm } from "../../utils/validation";
import { firstErrorMessage } from "../../utils/format";
import { authApi } from "../../api/authApi";

import "./Auth.css";

import logoSmall from "../../assets/images/logo-small.png";
import emailIcon from "../../assets/icons/Icon-fill/email.svg";

const RESEND_COOLDOWN_SECONDS = 30;

const schema = {
  email: [(value) => rules.required(value, "Email"), rules.email],
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({
    email: location.state?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Set once the API accepts the request.
  const [sent, setSent] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setApiError("");
  };

  const requestReset = async () => {
    const email = values.email.trim();

    const response = await authApi.forgotPassword({ email_id: email });

    if (response?.success === false) {
      throw new Error(
        response?.message || "Unable to send reset instructions.",
      );
    }

    setSent({ email, message: response?.message || "" });
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const { isValid, errors: validationErrors } = validateForm(values, schema);

    setErrors(validationErrors);

    if (!isValid) return;

    setLoading(true);
    setApiError("");

    try {
      await requestReset();
    } catch (error) {
      const fieldError = error?.errors?.email_id || error?.errors?.email;

      if (fieldError) {
        setErrors({
          email: Array.isArray(fieldError) ? fieldError[0] : fieldError,
        });
      }

      setApiError(
        firstErrorMessage(
          error,
          "Unable to send reset instructions. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;

    setLoading(true);
    setApiError("");

    try {
      await requestReset();
    } catch (error) {
      setApiError(
        firstErrorMessage(error, "Unable to resend. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const useDifferentEmail = () => {
    setSent(null);
    setApiError("");
    setCooldown(0);
  };

  return (
    <main className="auth-page">
      <Seo
        title="Forgot password"
        description="Reset your account password."
      />

      <div className="auth-container">
        <div className="auth-left">
          <img src={logoSmall} alt="Logo" className="auth-big-logo" />

          <div className="auth-pattern top-left" />
          <div className="auth-pattern bottom-left" />
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <button
              className="auth-back-btn"
              type="button"
              aria-label="Back to login"
              onClick={() => navigate("/login")}
            >
              <IoChevronBack />
            </button>

            <img src={logoSmall} className="auth-logo" alt="Logo" />

            {sent ? (
              <div className="auth-success" role="status">
                <span className="auth-success__icon" aria-hidden="true">
                  <FiMail />
                </span>

                <h1 className="auth-title">Check your email</h1>

                <p className="auth-subtitle">
                  {sent.message ||
                    "If an account exists for this email, we've sent instructions to reset your password."}
                </p>

                <p className="auth-success__email">{sent.email}</p>

                {apiError && (
                  <p className="auth-error" role="alert">
                    {apiError}
                  </p>
                )}

                <Button
                  type="button"
                  fullWidth
                  onClick={() => navigate("/login", { replace: true })}
                >
                  Back to Log in
                </Button>

                <p className="auth-switch">
                  Didn't get it?{" "}
                  {cooldown > 0 ? (
                    <span className="auth-muted">Resend in {cooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      className="auth-link auth-link-btn"
                      onClick={handleResend}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Resend email"}
                    </button>
                  )}
                </p>

                <p className="auth-switch">
                  <button
                    type="button"
                    className="auth-link auth-link-btn"
                    onClick={useDifferentEmail}
                  >
                    Use a different email
                  </button>
                </p>
              </div>
            ) : (
              <>
                <h1 className="auth-title">Forgot Password</h1>

                <p className="auth-subtitle">
                  Enter the email address linked to your account and we'll send
                  you instructions to reset your password.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<img src={emailIcon} alt="" height="1em" />}
                  />

                  {apiError && (
                    <p className="auth-error" role="alert">
                      {apiError}
                    </p>
                  )}

                  <Button type="submit" fullWidth loading={loading}>
                    Send Reset Link
                  </Button>
                </form>

                <p className="auth-switch">
                  Remembered your password?
                  <Link to="/login" className="auth-link">
                    {" "}
                    Log in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
