import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

const steps = [
  { num: 1, label: "Personal Details" },
  { num: 2, label: "Delivery Address" },
  { num: 3, label: "Payment" },
];

const mobileSteps = [
  { num: 1, label: "User Detail" },
  { num: 2, label: "Delivery" },
  { num: 3, label: "Payment" },
];

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

function MobileStepper({ current }) {
  return (
    <div className="mstepper-track">
      {mobileSteps.map((s, i) => (
        <div key={s.num} className="mstep-group">
          <div className="mstep">
            <div
              className={`mstep-dot ${
                s.num < current ? "done" : s.num === current ? "active" : ""
              }`}
            />
            <span
              className={`mstep-label ${s.num === current ? "active" : ""}`}
            >
              {s.label}
            </span>
          </div>

          {i < mobileSteps.length - 1 && (
            <div
              className={`mstep-connector ${s.num <= current ? "done" : ""}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { personal, address } = location.state || {};

  const [couponApplied, setCouponApplied] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = 200;
  const discount = couponApplied ? 20 : 0;
  const total = subtotal - discount;

  const handlePlaceOrder = () => {
    const orderId = `#${Math.floor(100000000 + Math.random() * 900000000)}`;
    navigate("/order-success", {
      state: { personal, address, paymentMethod, total, orderId },
    });
  };

  const bodyContent = (
    <>
      <p className="section-title">Offer &amp; Coupons</p>
      <div className="coupon-row" onClick={() => setCouponApplied((c) => !c)}>
        <span className="coupon-code">MKTPOS</span>
        <div style={{ display: "flex", alignItems: "center" }}>
          {couponApplied && (
            <span className="saved-badge">Saved ${discount.toFixed(1)}</span>
          )}
          <span className="chev">‹</span>
        </div>
      </div>

      <p className="section-title" style={{ marginTop: 22 }}>
        Payment Method
      </p>
      <div
        className={`pay-option ${paymentMethod === "cod" ? "selected" : ""}`}
        onClick={() => setPaymentMethod("cod")}
      >
        <span>Cash On Delivery</span>
        <div className={`radio-dot ${paymentMethod === "cod" ? "on" : ""}`} />
      </div>
      <div
        className={`pay-option ${paymentMethod === "online" ? "selected" : ""}`}
        onClick={() => setPaymentMethod("online")}
      >
        <span>Online Banking &amp; Cards</span>
        <div
          className={`radio-dot ${paymentMethod === "online" ? "on" : ""}`}
        />
      </div>

      <p className="section-title" style={{ marginTop: 22 }}>
        Order Details
      </p>
      <div className="order-row">
        <span>Sub Total (Include all Taxes)</span>
        <b>${subtotal.toFixed(2)}</b>
      </div>
      <div className="order-row discount">
        <span>Coupons Discount</span>
        <b>-${discount.toFixed(2)}</b>
      </div>
      <div className="order-divider" />
      <div className="order-total">
        <span>Total (Include all Taxes)</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="bottom-bar">
        <button className="total-btn">Total = ${total.toFixed(2)}</button>
        <button className="continue-btn" onClick={handlePlaceOrder}>
          Continue
        </button>
      </div>
    </>
  );

  return (
    <div className="checkout-page">
      {/* ---------- Mobile ---------- */}
      <div className="checkout-mobile">
        <div className="top-bar">
          <button
            className="icon-btn"
            onClick={() => navigate("/cart/delivery")}
          >
            {backIcon}
          </button>
          <h1>Cart</h1>
          <div className="info-circle">i</div>
        </div>

        <div className="stepper-wrap">
          <MobileStepper current={3} />
        </div>

        <div className="content">{bodyContent}</div>
      </div>

      {/* ---------- Desktop — sidebar layout ---------- */}
      <div className="cd-desktop">
        <aside className="od-sidebar">
          <div className="od-avatar" />
          <h2 className="od-name">Checkout</h2>
          <p className="od-phone">Step 3 of 3</p>

          <nav className="od-steps">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`od-step ${s.num === 3 ? "active" : "done"}`}
              >
                <span className="od-step-num">{s.num < 3 ? "✓" : s.num}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </nav>

          <div className="od-help">
            <span className="od-help-icon">🎧</span>
            <div>
              <p className="od-help-title">Need Help?</p>
              <p className="od-help-sub">24/7 Customer Support</p>
              <p className="od-help-email">support@shopkart.com</p>
            </div>
          </div>
        </aside>

        <div className="od-main">
          <div className="od-main-header">
            <h1>Payment</h1>
          </div>
          <div className="content">{bodyContent}</div>
        </div>
      </div>
    </div>
  );
}
