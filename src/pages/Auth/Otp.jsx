import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seo from "../../components/common/Seo";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import { rules } from "../../utils/validation";
import { authApi } from "../../api/authApi";
import "./Auth.css";
import logoSmall from "../../assets/images/logo-small.png";
import { IoChevronBack } from "react-icons/io5";
const OTP_LENGTH = 4;
const RESEND_SECONDS = 90;

export default function Otp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (s) => `0${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    const err = rules.otp(otp, OTP_LENGTH);
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      // await authApi.verifyOtp({ email, otp });
      navigate("/login");
    } catch (err2) {
      setError(err2.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setSeconds(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    try {
      await authApi.resendOtp({ email });
    } catch (_) {
      /* surfaced via error state if needed */
    }
  };

  return (
    <main className="auth-page">
      <Seo
        title="Verify OTP"
        description="Verify the OTP sent to your email to secure your account."
      />

      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <img
            src={logoSmall}
            alt="OTP Illustration"
            className="auth-big-logo"
          />

          <div className="auth-pattern top-left"></div>
          <div className="auth-pattern bottom-left"></div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="auth-card otp-card">
            <button
              className="auth-back-btn"
              onClick={() => navigate("/signup")}
              type="button"
              aria-label="Back"
            >
              <IoChevronBack />
            </button>

            <h1 className="auth-title">Verify Your OTP</h1>

            <p className="auth-subtitle">
              Enter the OTP sent to your email to verify your identity and
              continue securely.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="otp-row">
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              <p className="otp-timer">({formatTime(seconds)})</p>

              {error && <p className="auth-error">{error}</p>}

              <div className="otp-buttons">
                <Button type="submit" fullWidth loading={loading}>
                  Continue
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={handleResend}
                  disabled={seconds > 0}
                >
                  Send Again
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
