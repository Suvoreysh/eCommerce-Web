import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoInformationCircleOutline } from "react-icons/io5";
import {
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiSettings,
  FiMapPin,
  FiLogOut,
  FiHeadphones,
} from "react-icons/fi";
import "./Cart.css";

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

const initialItems = [
  {
    id: 1,
    name: "iPhone 17 Pro",
    variant: "(12,156)",
    color: "Cosmic Orange",
    price: 399,
    mrp: 499,
    qty: 1,
    stock: 5,
    outOfStock: false,
    image:
      "https://www.aptronixindia.com/cdn/shop/files/iPhone_17_ProMax_Orange_Grid.jpg?v=1762585145&width=1946",
  },
  {
    id: 2,
    name: "iPhone 17 Pro",
    variant: "(12,156)",
    color: "Cosmic Orange",
    price: 399,
    mrp: 499,
    qty: 1,
    stock: 5,
    outOfStock: false,
    image:
      "https://www.aptronixindia.com/cdn/shop/files/iPhone_17_ProMax_Orange_Grid.jpg?v=1762585145&width=1946",
  },
  {
    id: 3,
    name: "iPhone 17 Pro",
    variant: "(12,156)",
    color: "Cosmic Orange",
    price: 399,
    mrp: 499,
    qty: 1,
    stock: 0,
    outOfStock: true,
    image:
      "https://www.aptronixindia.com/cdn/shop/files/iPhone_17_ProMax_Orange_Grid.jpg?v=1762585145&width=1946",
  },
];

const sidebarNav = [
  { to: "/orders", icon: <FiShoppingBag />, label: "My Orders", active: false },
  { to: "/wishlist", icon: <FiHeart />, label: "Wishlist", active: false },
  {
    to: "/change-password",
    icon: <FiLock />,
    label: "Change Password",
    active: false,
  },
  {
    to: "/settings",
    icon: <FiSettings />,
    label: "Account Settings",
    active: false,
  },
  { to: "/address", icon: <FiMapPin />, label: "Address Book", active: false },
  { to: "/logout", icon: <FiLogOut />, label: "Logout", active: false },
];

export default function CartList() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id && !it.outOfStock
          ? { ...it, qty: Math.max(1, Math.min(it.stock, it.qty + delta)) }
          : it,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const activeItems = items.filter((it) => !it.outOfStock);
  const subtotal = activeItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const mrpTotal = activeItems.reduce((sum, it) => sum + it.mrp * it.qty, 0);
  const discount = mrpTotal - subtotal;
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const total = subtotal + deliveryFee;

  const goToCheckout = () => {
    navigate("/cart/details");
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <button
          className="back-btn"
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          {backIcon}
        </button>
        <h1>Cart</h1>
      </header>

      <p className="cart-title">My Cart ({items.length})</p>

      {/* ---------- Mobile view ---------- */}
      <div className="mobile-list">
        {items.map((it) => (
          <div
            key={it.id}
            className={`item-card ${it.outOfStock ? "disabled" : ""}`}
          >
            <div className="item-thumb">
              <img src={it.image} alt={it.name} />
            </div>
            <div className="item-info">
              <div className="item-top">
                <p className="item-name">
                  {it.name} {it.variant}
                </p>
                <button className="heart-btn" aria-label="Save for later">
                  ♡
                </button>
              </div>
              <div className="price-row">
                ₹ {it.price} <span className="mrp">{it.mrp}</span>
              </div>
              <div className="color-row">
                Color: <b>{it.color}</b>
              </div>
              <div className="qty-row">
                <span>Qty.</span>
                <div className="stepper">
                  <button
                    onClick={() => updateQty(it.id, -1)}
                    disabled={it.outOfStock || it.qty <= 1}
                  >
                    −
                  </button>
                  <span>{it.qty}</span>
                  <button
                    onClick={() => updateQty(it.id, 1)}
                    disabled={it.outOfStock || it.qty >= it.stock}
                  >
                    +
                  </button>
                </div>
                {it.outOfStock ? (
                  <span className="stock-text out">Out Of Stock.</span>
                ) : (
                  <span className="stock-text">{it.stock} in stock.</span>
                )}
              </div>
              <div className="card-footer">
                <button
                  className="remove-btn"
                  disabled={it.outOfStock}
                  onClick={() => removeItem(it.id)}
                >
                  Remove 🗑
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Order Summary — mobile */}
        {items.length > 0 && (
          <div className="summary-card mobile-summary">
            <h2>Order Summary</h2>
            <div className="summary-line">
              <span>Subtotal ({activeItems.length} items)</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="summary-line discount">
              <span>Discount</span>
              <span>− ₹ {discount}</span>
            </div>
            <div className="summary-line">
              <span>Delivery fee</span>
              <span>₹ {deliveryFee}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
          </div>
        )}
      </div>

      <div className="checkout-bar">
        {/* <button className="cart-total-btn">Total = ₹ {total}</button> */}
        <button
          className="cart-continue-btn"
          disabled={activeItems.length === 0}
          onClick={goToCheckout}
        >
          Check Out
        </button>
      </div>

      {/* ---------- Desktop view — sidebar layout (matches My Orders) ---------- */}
      <div className="cd-desktop">
        {/* ── Left sidebar ── */}
        <aside className="od-sidebar">
          <div className="od-avatar" />
          <h2 className="od-name">Jhon Rao</h2>
          <p className="od-phone">+91 6254897524</p>

          <nav className="od-nav">
            {sidebarNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`od-nav-item${item.active ? " od-nav-item--active" : ""}`}
              >
                <span className="od-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="od-help">
            <FiHeadphones className="od-help-icon" />
            <div>
              <p className="od-help-title">Need Help?</p>
              <p className="od-help-sub">24/7 Customer Support</p>
              <p className="od-help-email">support@shopkart.com</p>
            </div>
          </div>
        </aside>

        {/* ── Right content panel ── */}
        <div className="od-main">
          <div className="od-main-header">
            <h1>My Cart</h1>
            <button className="od-info-btn">
              <IoInformationCircleOutline />
              How checkout works?
            </button>
          </div>

          {items.length === 0 ? (
            <div className="empty-desktop">Your cart is empty.</div>
          ) : (
            <div className="desktop-grid">
              <div className="desktop-items">
                <div className="desktop-items-head">
                  <span></span>
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span></span>
                </div>

                {items.map((it) => (
                  <div
                    key={it.id}
                    className={`desktop-row ${it.outOfStock ? "disabled" : ""}`}
                  >
                    <div className="desktop-thumb">
                      <img src={it.image} alt={it.name} />
                    </div>

                    <div className="desktop-name-block">
                      <p className="item-name">
                        {it.name} {it.variant}
                      </p>
                      <div className="color-row">
                        Color: <b>{it.color}</b>
                      </div>
                      <button
                        className="desktop-remove"
                        disabled={it.outOfStock}
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="desktop-price">
                      <div className="price-row">
                        ₹ {it.price} <span className="mrp">{it.mrp}</span>
                      </div>
                    </div>

                    <div className="desktop-qty-cell">
                      <div className="stepper">
                        <button
                          onClick={() => updateQty(it.id, -1)}
                          disabled={it.outOfStock || it.qty <= 1}
                        >
                          −
                        </button>
                        <span>{it.qty}</span>
                        <button
                          onClick={() => updateQty(it.id, 1)}
                          disabled={it.outOfStock || it.qty >= it.stock}
                        >
                          +
                        </button>
                      </div>
                      {it.outOfStock ? (
                        <span className="stock-text out">Out of stock</span>
                      ) : (
                        <span className="stock-text">{it.stock} in stock</span>
                      )}
                    </div>

                    <div className="desktop-line-total">
                      {it.outOfStock ? "—" : `₹ ${it.price * it.qty}`}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-card desktop-only-summary">
                <h2>Order Summary</h2>
                <div className="summary-line">
                  <span>Subtotal ({activeItems.length} items)</span>
                  <span>₹ {subtotal}</span>
                </div>
                <div className="summary-line discount">
                  <span>Discount</span>
                  <span>− ₹ {discount}</span>
                </div>
                <div className="summary-line">
                  <span>Delivery fee</span>
                  <span>₹ {deliveryFee}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>
                <button
                  className="desktop-checkout-btn"
                  disabled={activeItems.length === 0}
                  onClick={goToCheckout}
                >
                  Check Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
