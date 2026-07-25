import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BaselineVisibilityIcon from "@iconify-react/ic/baseline-visibility";
import BaselineVisibilityOffIcon from "@iconify-react/ic/baseline-visibility-off";
import { IoChevronBack } from "react-icons/io5";

import Seo from "../../components/common/Seo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { rules, validateForm } from "../../utils/validation";
import { authApi } from "../../api/authApi";

import "./Auth.css";

import logoSmall from "../../assets/images/logo-small.png";
import facebookIcon from "../../assets/icons/facebook.png";
import googleIcon from "../../assets/icons/google.png";
import appleIcon from "../../assets/icons/apple.png";

import emailIcon from "../../assets/icons/Icon-fill/email.svg";
import passwordIcon from "../../assets/icons/Icon-fill/password.svg";
import nameIcon from "../../assets/icons/Icon-fill/email.svg";
import phoneIcon from "../../assets/icons/Icon-fill/phone.svg";

const schema = {
  name: [(value) => rules.required(value, "Name")],

  email: [(value) => rules.required(value, "Email"), rules.email],

  phone: [
    (value) => rules.required(value, "Phone"),
    (value) => {
      const phone = String(value || "").trim();

      if (!/^[6-9]\d{9}$/.test(phone)) {
        return "Enter a valid 10-digit phone number";
      }

      return "";
    },
  ],

  password: [(value) => rules.required(value, "Password"), rules.password],

  confirmPassword: [
    (value) => rules.required(value, "Confirm password"),

    (value, allValues) => rules.confirmPassword(value, allValues.password),
  ],
};

function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || firstName;

  return {
    firstName,
    lastName,
  };
}

function extractUserId(response) {
  return (
    response?.user_id ||
    response?.data?.user_id ||
    response?.user?.id ||
    response?.data?.user?.id ||
    response?.id ||
    null
  );
}

function extractOtp(response) {
  return String(
    response?.otp ||
      response?.data?.otp ||
      response?.verification_otp ||
      response?.data?.verification_otp ||
      response?.signup_otp ||
      response?.data?.signup_otp ||
      "",
  );
}

export default function Signup() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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
      const { firstName, lastName } = splitName(values.name);

      const response = await authApi.signup({
        first_name: firstName,
        last_name: lastName,
        email_id: values.email.trim(),
        phone_number: values.phone.trim(),
        user_name: values.email.trim().split("@")[0],
        password: values.password,
        password_confirmation: values.confirmPassword,
      });

      if (response?.success === false) {
        throw new Error(
          response?.message || "Sign up failed. Please try again.",
        );
      }

      const userId = extractUserId(response);
      const developmentOtp = extractOtp(response);

      if (!userId) {
        throw new Error("Account created, but user ID was not returned.");
      }

      navigate("/otp", {
        state: {
          mode: "signup",
          userId,
          phone: values.phone.trim(),
          email: values.email.trim(),
          developmentOtp,
        },
      });
    } catch (error) {
      if (error?.errors && typeof error.errors === "object") {
        const fieldMap = {
          first_name: "name",
          last_name: "name",
          email_id: "email",
          email: "email",
          phone_number: "phone",
          phone: "phone",
          user_name: "email",
          password: "password",
          password_confirmation: "confirmPassword",
        };

        const mappedErrors = {};

        Object.entries(error.errors).forEach(([apiField, messages]) => {
          const fieldName = fieldMap[apiField] || apiField;

          mappedErrors[fieldName] = Array.isArray(messages)
            ? messages[0]
            : messages;
        });

        setErrors((previousErrors) => ({
          ...previousErrors,
          ...mappedErrors,
        }));

        setApiError(
          Object.values(mappedErrors)[0] ||
            error?.message ||
            "Sign up failed. Please try again.",
        );
      } else {
        setApiError(error?.message || "Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <Seo
        title="Create Account"
        description="Create a new account to start shopping."
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
              onClick={() => navigate("/login")}
              type="button"
              aria-label="Back to login"
            >
              <IoChevronBack />
            </button>

            <h1 className="auth-title">Create Account</h1>

            <p className="auth-subtitle">
              Create your account to access all features and enjoy a seamless
              shopping experience.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
                icon={<img src={nameIcon} alt="" height="1em" />}
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                icon={<img src={emailIcon} alt="" height="1em" />}
              />

              <Input
                label="Phone No"
                name="phone"
                type="tel"
                inputMode="numeric"
                value={values.phone}
                onChange={handleChange}
                error={errors.phone}
                autoComplete="tel"
                icon={<img src={phoneIcon} alt="" height="1em" />}
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
                icon={<img src={passwordIcon} alt="" height="1em" />}
                rightIcon={
                  showPassword ? (
                    <BaselineVisibilityOffIcon height="1.2em" />
                  ) : (
                    <BaselineVisibilityIcon height="1.2em" />
                  )
                }
                onRightIconClick={() => setShowPassword((current) => !current)}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
                icon={<img src={passwordIcon} alt="" height="1em" />}
                rightIcon={
                  showConfirmPassword ? (
                    <BaselineVisibilityOffIcon height="1.2em" />
                  ) : (
                    <BaselineVisibilityIcon height="1.2em" />
                  )
                }
                onRightIconClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
              />

              {apiError && (
                <p className="auth-error" role="alert">
                  {apiError}
                </p>
              )}

              <Button type="submit" fullWidth loading={loading}>
                Create Account
              </Button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
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
