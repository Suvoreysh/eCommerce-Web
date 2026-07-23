import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ title, showBack = true, rightIcon = "info" }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      {showBack ? (
        <button className="header-icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
          &#8592;
        </button>
      ) : (
        <span className="header-icon-btn header-icon-btn--placeholder" />
      )}
      <h1 className="header-title">{title}</h1>
      {rightIcon ? (
        <button className="header-icon-btn" aria-label="Info">
          &#9432;
        </button>
      ) : (
        <span className="header-icon-btn header-icon-btn--placeholder" />
      )}
    </header>
  );
}
