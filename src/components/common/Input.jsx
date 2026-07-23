import "./Input.css";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon,
  rightIcon,
  onRightIconClick,
  ...rest
}) {
  return (
    <div className="input-group">
      <div className={`input-wrap ${error ? "input-wrap--error" : ""}`}>
        {icon && <span className="input-icon">{icon}</span>}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder || label}
          aria-label={label || placeholder}
          aria-invalid={!!error}
          className="input-field"
          {...rest}
        />

        {rightIcon && (
          <button
            type="button"
            className="input-right-icon"
            onClick={onRightIconClick}
            tabIndex={-1}
          >
            {rightIcon}
          </button>
        )}
      </div>

      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
