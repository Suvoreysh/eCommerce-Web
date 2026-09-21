import { useNavigate } from "react-router-dom";
import "./BackHomeButton.css";

const backIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export default function BackHomeButton({ className = "" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={`back-home-btn ${className}`.trim()}
      aria-label="Back to home"
      onClick={() => navigate("/home")}
    >
      {backIcon}
    </button>
  );
}
