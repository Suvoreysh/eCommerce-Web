import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

const productImg =
  "https://images.unsplash.com/photo-1592286927505-1def25115481?q=80&w=300&auto=format&fit=crop";

const cartItems = [
  { id: 1, name: "Iphone 17pro", image: productImg },
  { id: 2, name: "Iphone 17pro", image: productImg },
  { id: 3, name: "Iphone 17pro", image: productImg },
];

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || "#000000000";
  const email = location.state?.personal?.email;

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
          <span>Est Arrival: Jun 23</span>
          <span>•</span>
          <span>Order {orderId}</span>
        </div>
        <div className="success-thumbs">
          {cartItems.map((it) => (
            <img key={it.id} src={it.image} alt={it.name} />
          ))}
        </div>
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
      {/* ---------- Mobile ---------- */}
      <div className="checkout-mobile">
        <div className="success-wrap">{successBody}</div>
      </div>

      {/* ---------- Desktop — sidebar layout ---------- */}
      <div className="cd-desktop">
        <aside className="od-sidebar">
          <div className="od-avatar" />
          <h2 className="od-name">Checkout</h2>
          <p className="od-phone">Complete</p>

          <nav className="od-steps">
            <div className="od-step done">
              <span className="od-step-num">✓</span>
              <span>Personal Details</span>
            </div>
            <div className="od-step done">
              <span className="od-step-num">✓</span>
              <span>Delivery Address</span>
            </div>
            <div className="od-step done">
              <span className="od-step-num">✓</span>
              <span>Payment</span>
            </div>
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
            <h1>Order Confirmed</h1>
          </div>
          <div className="success-wrap">{successBody}</div>
        </div>
      </div>
    </div>
  );
}
