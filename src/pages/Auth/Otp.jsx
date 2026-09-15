import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FiCheck, FiCopy } from "react-icons/fi";

import Seo from "../../components/common/Seo";
import Button from "../../components/common/Button";
import { rules } from "../../utils/validation";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import "./Auth.css";

import logoSmall from "../../assets/images/logo-small.png";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 90;

function extractOtp(response) {
  return String(
    response?.otp ||
      response?.data?.otp ||
      response?.login_otp ||
      response?.data?.login_otp ||
      response?.signup_otp ||
      response?.data?.signup_otp ||
      response?.verification_otp ||
      response?.data?.verification_otp ||
      "",
  );
}

function extractToken(response) {
  return (
    response?.access_token ||
    response?.token ||
    response?.data?.access_token ||
    response?.data?.token ||
    null
  );
}

function extractUser(response, phone) {
  return (
    response?.user ||
    response?.data?.user || {
      phone_number: phone,
    }
  );
}

export default function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const inputRefs = useRef([]);

  const mode = location.state?.mode || "";
  const userId = location.state?.userId || "";
  const phone = location.state?.phone || "";
  const email = location.state?.email || "";

  const initialDevelopmentOtp = location.state?.developmentOtp || "";

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));

  const [developmentOtp, setDevelopmentOtp] = useState(
    String(initialDevelopmentOtp),
  );

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [copied, setCopied] = useState(false);

  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!mode) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    if (mode === "signup" && !userId) {
      navigate("/signup", {
        replace: true,
      });

      return;
    }

    if (mode === "login" && !phone) {
      navigate("/login-with-otp", {
        replace: true,
      });
    }
  }, [mode, userId, phone, navigate]);

  useEffect(() => {
    if (seconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSeconds((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [seconds]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);

    const remainingSeconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const fillOtpBoxes = (otpValue) => {
    const cleanedOtp = String(otpValue || "")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    const nextDigits = Array(OTP_LENGTH).fill("");

    cleanedOtp.split("").forEach((digit, index) => {
      nextDigits[index] = digit;
    });

    setDigits(nextDigits);
    setError("");
    setSuccessMessage("");

    const focusIndex = Math.min(cleanedOtp.length, OTP_LENGTH - 1);

    inputRefs.current[focusIndex]?.focus();
  };

  const handleDigitChange = (index, value) => {
    const cleanedValue = value.replace(/\D/g, "").slice(-1);

    const nextDigits = [...digits];
    nextDigits[index] = cleanedValue;

    setDigits(nextDigits);
    setError("");
    setSuccessMessage("");

    if (cleanedValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    fillOtpBoxes(pastedOtp);
  };

  const handleCopyOtp = async () => {
    if (!developmentOtp) return;

    try {
      await navigator.clipboard.writeText(developmentOtp);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError("Unable to copy OTP.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const otp = digits.join("");

    const otpError = rules.otp(otp, OTP_LENGTH);

    if (otpError) {
      setError(otpError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (mode === "signup") {
        const response = await authApi.verifySignupOtp({
          user_id: userId,
          otp,
        });

        if (response?.success === false) {
          throw new Error(response?.message || "Invalid OTP.");
        }

        navigate("/login", {
          replace: true,
          state: {
            message: "Account verified successfully. Please log in.",
          },
        });

        return;
      }

      if (mode === "login") {
        const response = await authApi.verifyLoginOtp({
          phone_number: phone,
          otp,
        });

        if (response?.success === false) {
          throw new Error(response?.message || "Invalid OTP.");
        }

        const accessToken = extractToken(response);

        const user = extractUser(response, phone);

        if (!accessToken) {
          throw new Error(
            "OTP verified, but the login token was not returned.",
          );
        }

        login(user, accessToken);

        navigate(location.state?.from?.pathname || "/home", {
          replace: true,
        });
      }
    } catch (requestError) {
      setError(requestError?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) {
      return;
    }

    if (!phone) {
      setError("Phone number is missing. Please go back and try again.");

      return;
    }

    setResending(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await authApi.resendOtp({
        phone_number: phone,
        purpose: mode === "signup" ? "signup_verification" : "login",
      });

      if (response?.success === false) {
        throw new Error(response?.message || "Unable to generate a new OTP.");
      }

      const newOtp = extractOtp(response);

      setDevelopmentOtp(newOtp);
      setDigits(Array(OTP_LENGTH).fill(""));

      setSeconds(RESEND_SECONDS);

      setSuccessMessage(response?.message || "New OTP generated successfully.");

      inputRefs.current[0]?.focus();
    } catch (requestError) {
      setError(requestError?.message || "Unable to generate a new OTP.");
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    if (mode === "signup") {
      navigate("/signup");
      return;
    }

    navigate("/login-with-otp");
  };

  const destinationText = phone || email;

  return (
    <main className="auth-page">
      <Seo
        title="Verify OTP"
        description="Verify your OTP to continue securely."
      />

      <div className="auth-container">
        <div className="auth-left">
          <img src={logoSmall} alt="Logo" className="auth-big-logo" />

          <div className="auth-pattern top-left" />
          <div className="auth-pattern bottom-left" />
        </div>

        <div className="auth-right">
          <div className="auth-card otp-card">
            <button
              className="auth-back-btn"
              onClick={handleBack}
              type="button"
              aria-label="Back"
            >
              <IoChevronBack />
            </button>

            <h1 className="auth-title">Verify Your OTP</h1>

            <p className="auth-subtitle">
              Enter the OTP generated for{" "}
              {destinationText && <strong>{destinationText}</strong>} to verify
              your identity.
            </p>

            {developmentOtp ? (
              <div className="development-otp-card">
                <div className="development-otp-heading">
                  <span className="development-otp-label">
                    Your testing OTP
                  </span>

                  <span className="development-badge">Development</span>
                </div>

                <div className="development-otp-content">
                  <button
                    type="button"
                    className="development-otp-number"
                    onClick={() => fillOtpBoxes(developmentOtp)}
                    title="Click to fill OTP"
                  >
                    {developmentOtp}
                  </button>

                  <button
                    type="button"
                    className="development-copy-button"
                    onClick={handleCopyOtp}
                    aria-label="Copy OTP"
                  >
                    {copied ? (
                      <>
                        <FiCheck />
                        Copied
                      </>
                    ) : (
                      <>
                        <FiCopy />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="development-otp-help">
                  Click the OTP number to fill the verification boxes
                  automatically.
                </p>
              </div>
            ) : (
              <div className="development-otp-card development-otp-empty">
                <span className="development-otp-label">
                  Testing OTP was not returned by the API.
                </span>

                <p className="development-otp-help">
                  Your backend must include the generated OTP in the API
                  response during development.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="otp-row" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-box"
                    value={digit}
                    onChange={(event) =>
                      handleDigitChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              <p className="otp-timer">({formatTime(seconds)})</p>

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              {successMessage && (
                <p className="auth-success" role="status">
                  {successMessage}
                </p>
              )}

              <div className="otp-buttons">
                <Button type="submit" fullWidth loading={loading}>
                  Continue
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={handleResend}
                  disabled={seconds > 0 || resending}
                >
                  {resending
                    ? "Generating..."
                    : seconds > 0
                      ? `Send Again (${formatTime(seconds)})`
                      : "Send Again"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
