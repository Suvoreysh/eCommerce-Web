
import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { opinionApi } from "../../api/opinionApi";
import "./FeedbackForm.css";

export default function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "",
        message: "",
      });
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      showToast("error", "Please enter your email.");
      return;
    }

    if (!message.trim()) {
      showToast("error", "Please enter your message.");
      return;
    }

    try {
      setLoading(true);

      await opinionApi.submit({
        email: email.trim(),
        message: message.trim(),
      });

      showToast("success", "Thank you! Your feedback has been submitted.");

      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Feedback submission error:", error);

      showToast(
        "error",
        error?.message || "Failed to submit feedback. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="feedback-section">
      {/* Toast */}
      {toast.show && (
        <div className={`feedback-toast ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="feedback-card">
        <div className="feedback-heading">
          <h2>Your Opinion Matters</h2>
          <p>tell us what you think</p>
        </div>

        <div className="input-box">
          <FiMail className="mail-icon" />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <textarea
          placeholder=""
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />

        <button
          className={`submit-btn ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="button-loader"></span>
              Sending...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </section>
  );
}
