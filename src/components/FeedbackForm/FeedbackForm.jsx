import { useState } from "react";
import { FiMail } from "react-icons/fi";
import "./FeedbackForm.css";

export default function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    console.log({ email, message });
  };

  return (
    <section className="feedback-section">
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
          />
        </div>

        <textarea
          placeholder=""
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </section>
  );
}
