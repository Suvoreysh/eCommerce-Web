import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Seo from "../../components/common/Seo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { rules, validateForm } from "../../utils/validation";
import { safeInternalPath } from "../../utils/format";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";
import BaselineEmailIcon from "@iconify-react/ic/baseline-email";
import BaselineLockIcon from "@iconify-react/ic/baseline-lock";
import emailIcon from "../../assets/icons/Icon-fill/email.svg";
import passwordIcon from "../../assets/icons/Icon-fill/password.svg";
import logoSmall from "../../assets/images/logo-small.png";
import facebookIcon from "../../assets/icons/facebook.png";
import googleIcon from "../../assets/icons/google.png";
import appleIcon from "../../assets/icons/apple.png";
const schema = {
  email: [(v) => rules.required(v, "Email"), rules.email],
  password: [(v) => rules.required(v, "Password")],
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Two ways a page can ask to be returned to after login:
  //  1. ProtectedRoute redirects here with router state: { from: location }
  //  2. Some action buttons (wishlist, add-to-cart prompts, etc.) link
  //     straight to `/login?returnTo=/some/path` with a query param.
  // Support both so every "please log in first" flow in the app lands back
  // where the person actually was.
  // URLSearchParams.get() already URL-decodes the value, so it must NOT be
  // decoded a second time (a "%" inside a search query would throw).
  // Only in-app paths are accepted, which rules out open redirects.
  const rawReturnTo = new URLSearchParams(location.search).get("returnTo");
  const queryReturnTo = rawReturnTo ? safeInternalPath(rawReturnTo, "") : "";
  const fromState = location.state?.from;

  const redirectTo = fromState
    ? `${fromState.pathname || "/home"}${fromState.search || ""}`
    : queryReturnTo || "/home";

  // Normalized so it can be threaded through to /login-with-otp -> /otp via
  // router state, regardless of which of the two forms brought us here.
  const [returnPath, returnSearch = ""] = queryReturnTo.split("?");
  const fromForNextStep =
    fromState ||
    (queryReturnTo
      ? { pathname: returnPath, search: returnSearch ? `?${returnSearch}` : "" }
      : undefined);

  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(false);
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
      const res = await authApi.login({
        login_id: values.email,
        login_password: values.password,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Login failed. Please try again.");
      }

      login(res?.user || { email: values.email }, res?.access_token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <Seo title="Log in" description="Log in to your account." />

      <div className="auth-container">
        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-pattern top-left"></div>

          <img src={logoSmall} className="auth-big-logo" alt="" />

          <div className="auth-pattern bottom-left"></div>
        </div>

        {/* RIGHT */}

        <div className="auth-right">
          <div className="auth-card">
            <img src={logoSmall} className="auth-logo" alt="Logo" />

            <h1 className="auth-title">Log in</h1>

            <p className="auth-subtitle">
              Enter your email and password securely access your account and
              manage your service.
            </p>

            <form onSubmit={handleSubmit} noValidate>
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
                type="password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                icon={<img src={passwordIcon} alt="Password" height="1em" />}
              />

              <div className="auth-row">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                  />
                  Remember
                </label>

                <Link
                  to="/forgot-password"
                  state={{ email: values.email }}
                  className="auth-link"
                >
                  Forgot Password
                </Link>
              </div>

              {apiError && <p className="auth-error">{apiError}</p>}

              <Button type="submit" fullWidth loading={loading}>
                Log in
              </Button>
              <Button
                type="button"
                className="otp-btn-login"
                fullWidth
                onClick={() =>
                  navigate("/login-with-otp", { state: { from: fromForNextStep } })
                }
              >
                Login with OTP
              </Button>
            </form>

            <p className="auth-switch">
              Don't have an account?
              <Link to="/signup" className="auth-link">
                {" "}
                Sign Up here
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
