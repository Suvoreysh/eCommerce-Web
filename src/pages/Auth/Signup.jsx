import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../../components/common/Seo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { rules, validateForm } from "../../utils/validation";
import { authApi } from "../../api/authApi";
import "./Auth.css";
import BaselinePersonIcon from "@iconify-react/ic/baseline-person";
import BaselineEmailIcon from "@iconify-react/ic/baseline-email";
import BaselineLockIcon from "@iconify-react/ic/baseline-lock";
import BaselineVisibilityIcon from "@iconify-react/ic/baseline-visibility";
import BaselineVisibilityOffIcon from "@iconify-react/ic/baseline-visibility-off";
import { RiLock2Fill } from "react-icons/ri";
import logoSmall from "../../assets/images/logo-small.png";
import facebookIcon from "../../assets/icons/facebook.png";
import googleIcon from "../../assets/icons/google.png";
import appleIcon from "../../assets/icons/apple.png";
import emailIcon from "../../assets/icons/Icon-fill/email.svg";
import passwordIcon from "../../assets/icons/Icon-fill/password.svg";
import nameIcon from "../../assets/icons/Icon-fill/email.svg";

import { IoChevronBack } from "react-icons/io5";
const schema = {
  name: [(v) => rules.required(v, "Name")],
  email: [(v) => rules.required(v, "Email"), rules.email],
  password: [(v) => rules.required(v, "Password"), rules.password],
  confirmPassword: [
    (v) => rules.required(v, "Confirm password"),
    (v, all) => rules.confirmPassword(v, all.password),
  ],
};

export default function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: newErrors } = validateForm(values, schema);
    setErrors(newErrors);
    if (!isValid) return;

    setApiError("");
    setLoading(true);
    try {
      // await authApi.signup(values);
      navigate("/otp", { state: { email: values.email } });
    } catch (err) {
      setApiError(err.message || "Sign up failed. Please try again.");
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
        {/* LEFT */}

        <div className="auth-left">
          <img src={logoSmall} alt="" className="auth-big-logo" />

          <div className="auth-pattern top-left"></div>
          <div className="auth-pattern bottom-left"></div>
        </div>

        {/* RIGHT */}

        <div className="auth-right">
          <div className="auth-card">
            <button
              className="auth-back-btn"
              onClick={() => navigate("/login")}
              type="button"
              aria-label="Back"
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
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                icon={<img src={nameIcon} alt="Name" height="1em" />}
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                icon={<img src={emailIcon} alt="Email" height="1em" />}
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                icon={<img src={passwordIcon} alt="Password" height="1em" />}
                rightIcon={
                  showPassword ? (
                    <BaselineVisibilityOffIcon height="1.2em" />
                  ) : (
                    <BaselineVisibilityIcon height="1.2em" />
                  )
                }
                onRightIconClick={() => setShowPassword(!showPassword)}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={<img src={passwordIcon} alt="Confirm Password" height="1em" />}
                rightIcon={
                  showConfirm ? (
                    <BaselineVisibilityOffIcon height="1.2em" />
                  ) : (
                    <BaselineVisibilityIcon height="1.2em" />
                  )
                }
                onRightIconClick={() => setShowConfirm(!showConfirm)}
              />

              {apiError && <p className="auth-error">{apiError}</p>}

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

            <div className="auth-divider"></div>
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
