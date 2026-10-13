import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartCount } from "../../context/CartCountContext";
import { useCheckout } from "../../context/CheckoutContext";
import { paymentLabel } from "../../utils/format";
import CheckoutSidebar from "./CheckoutSidebar";
import "./Checkout.css";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCartCount } = useCartCount();
  const { reset } = useCheckout();

  const orderId = location.state?.orderId || "#000000000";
  const email =
    location.state?.personal?.email || location.state?.personal?.email_id;
  const paymentType = location.state?.paymentType;
  const address = location.state?.address;

  useEffect(() => {
    refreshCartCount();
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const successBody = (
    <>
      <div className="success-card">
        <div className="check-circle">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>Order Successful!</h2>
        <p>
          Thank you for choosing us. Your invoice has been successfully sent to
          Email {email ? email.replace(/(?<=.).(?=.*@)/g, "x") : "xxxxxxx"}
        </p>
        <div className="success-meta">
          <span>Order {orderId}</span>
          {paymentType && (
            <>
              <span>•</span>
              <span>{paymentLabel(paymentType.name)}</span>
            </>
          )}
        </div>
        {address && (
          <p style={{ color: "#6b6b6b", fontSize: 13, lineHeight: 1.5 }}>
            Delivering to {address.full_name} —{" "}
            {[address.city, address.state, address.pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
      </div>

      <div className="success-actions">
        <button className="invoice-btn" onClick={() => navigate("/orders")}>
          See Invoice 📄
        </button>
        <button
          className="order-details-btn"
          onClick={() => navigate("/orders")}
        >
          See Order Details 🕓
        </button>
      </div>
    </>
  );

  return (
    <div className="checkout-page">
      {/* Mobile */}
      <div className="checkout-mobile">
        <div className="success-wrap">{successBody}</div>
      </div>

      {/* Desktop */}
      <div className="cd-desktop">
        <CheckoutSidebar current={4} />
        <div className="od-main">
          <div className="od-main-header od-main-header--sticky">
            <h1>Order Confirmed</h1>
          </div>
          <div className="success-wrap">{successBody}</div>
        </div>
      </div>
    </div>
  );
}
