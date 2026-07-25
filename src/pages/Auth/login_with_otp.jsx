import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

import Seo from "../../components/common/Seo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { rules, validateForm } from "../../utils/validation";
import { authApi } from "../../api/authApi";

import "./Auth.css";

import logoSmall from "../../assets/images/logo-small.png";
import phoneIcon from "../../assets/icons/Icon-fill/phone.svg";
import facebookIcon from "../../assets/icons/facebook.png";
import googleIcon from "../../assets/icons/google.png";
import appleIcon from "../../assets/icons/apple.png";

const schema = {
  phone: [
    (value) => rules.required(value, "Phone number"),

    (value) => {
      const phone = String(value || "").trim();

      if (!/^[6-9]\d{9}$/.test(phone)) {
        return "Enter a valid 10-digit phone number";
      }

      return "";
    },
  ],
};

function extractOtp(response) {
  return String(
    response?.otp ||
      response?.data?.otp ||
      response?.login_otp ||
      response?.data?.login_otp ||
      response?.verification_otp ||
      response?.data?.verification_otp ||
      "",
  );
}

export default function LoginWithOtp() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));

    setApiError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { isValid, errors: validationErrors } = validateForm(values, schema);

    setErrors(validationErrors);

    if (!isValid) return;

    setLoading(true);
    setApiError("");

    try {
      const phone = values.phone.trim();

      const response = await authApi.requestLoginOtp({
        phone_number: phone,
      });

      if (response?.success === false) {
        throw new Error(response?.message || "Unable to generate OTP.");
      }

      const developmentOtp = extractOtp(response);

      navigate("/otp", {
        state: {
          mode: "login",
          phone,
          developmentOtp,
        },
      });
    } catch (error) {
      if (error?.errors && typeof error.errors === "object") {
        const phoneError = error.errors.phone_number || error.errors.phone;

        if (phoneError) {
          setErrors({
            phone: Array.isArray(phoneError) ? phoneError[0] : phoneError,
          });
        }
      }

      setApiError(
        error?.message || "Unable to generate OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <Seo
        title="Login with OTP"
        description="Login securely using your mobile number."
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

            <h1 className="auth-title">Login with OTP</h1>

            <p className="auth-subtitle">
              Enter your registered mobile number. We will generate an OTP to
              securely access your account.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Mobile Number"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={values.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="Enter mobile number"
                icon={<img src={phoneIcon} alt="" height="1em" />}
              />

              {apiError && (
                <p className="auth-error" role="alert">
                  {apiError}
                </p>
              )}

              <Button type="submit" fullWidth loading={loading}>
                Generate OTP
              </Button>
            </form>

            <p className="auth-switch">
              Login using password?{" "}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </p>

            <div className="auth-divider" />

            <div className="auth-divider-text">Or Continue With Account</div>

            <div className="auth-social">
              <button
                className="auth-social-btn"
                type="button"
                aria-label="Facebook"
              >
                <img
                  src={facebookIcon}
                  alt="Facebook"
                  className="auth-social-icon"
                />
              </button>

              <button
                className="auth-social-btn"
                type="button"
                aria-label="Google"
              >
                <img
                  src={googleIcon}
                  alt="Google"
                  className="auth-social-icon"
                />
              </button>

              <button
                className="auth-social-btn"
                type="button"
                aria-label="Apple"
              >
                <img src={appleIcon} alt="Apple" className="auth-social-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
