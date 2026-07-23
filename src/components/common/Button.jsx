import "./Button.css";

export default function Button({
  children,
  variant = "primary", // primary | outline | text
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? "btn--full" : ""}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
