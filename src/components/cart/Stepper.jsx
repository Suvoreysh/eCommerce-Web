import "./Stepper.css";

const STEPS = ["User Detail", "Delivery", "Payment"];

export default function Stepper({ current = 2 }) {
  return (
    <div className="checkout-stepper">
      <div className="checkout-stepper-track">
        {STEPS.map((label, i) => {
          const step = i + 1;
          const active = step <= current;

          return (
            <div
              className={`checkout-step ${
                active ? "checkout-step--active" : ""
              }`}
              key={label}
            >
              <div className="checkout-step-dot">
                <span />
              </div>

              <span className="checkout-step-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
