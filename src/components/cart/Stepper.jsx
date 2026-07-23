import "./Stepper.css";

const STEPS = ["User Detail", "Delivery", "Payment"];

export default function Stepper({ current }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const isCurrent = idx === current;
        return (
          <div className="step-dot-wrap" key={label}>
            <div
              className={`step-dot ${done ? "done" : ""} ${isCurrent ? "current" : ""}`}
            />
            <div className={`step-line ${done ? "done" : ""}`} />
            <span
              className={`step-label ${done ? "done" : ""} ${isCurrent ? "current" : ""}`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
