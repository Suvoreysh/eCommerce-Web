import { useState, useEffect } from "react";
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
import { cartApi } from "../../api/cartApi";
import { useCartCount } from "../../context/CartCountContext";
import "./Cart.css";

const IMAGE_BASE =
  "https://spaknit.com/spaknit/public/uploads/images/variants/";

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

function resolveImage(image) {
  if (!image) return "";
  return image.startsWith("http") ? image : `${IMAGE_BASE}${image}`;
}

export default function CartList() {
  const navigate = useNavigate();
  const { refreshCartCount } = useCartCount();
  const [items, setItems] = useState([]);
  const [cartMeta, setCartMeta] = useState({
    totalItems: 0,
    subtotal: 0,
    gst: 0,
    discount: 0,
    payable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await cartApi.getCart();
        const data = response?.data;

        if (!isMounted) return;

        setItems(Array.isArray(data?.items) ? data.items : []);
        setCartMeta({
          totalItems: Number(data?.total_items ?? 0),
          subtotal: Number(data?.subtotal ?? 0),
          gst: Number(data?.gst ?? 0),
          discount: Number(data?.discount ?? 0),
          payable: Number(data?.payable ?? 0),
        });
        refreshCartCount();
      } catch (err) {
        if (!isMounted) return;

        console.error("Get cart failed:", err);
        setError(err.message || "Unable to load cart.");
        setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCart();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, quantity: Math.max(1, it.quantity + delta) }
          : it,
      ),
    );
    // TODO: call the cart update-quantity endpoint here once the backend
    // exposes one, then refreshCartCount() after it resolves.
    refreshCartCount();
  };

  const removeItem = async (id) => {
    try {
      await cartApi.removeItem(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      refreshCartCount();
    } catch (err) {
      console.error("Remove item failed:", err);
      setError(err.message || "Unable to remove item.");
    }
  };

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

      <p className="cart-title">My Cart ({cartMeta.totalItems})</p>

      {loading && (
        <p style={{ textAlign: "center", padding: "24px 0" }}>
          Loading cart...
        </p>
      )}
      {!loading && error && (
        <p style={{ textAlign: "center", padding: "24px 0", color: "red" }}>
          {error}
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <p style={{ textAlign: "center", padding: "24px 0" }}>
          Your cart is empty.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          {/* ---------- Mobile view ---------- */}
          <div className="mobile-list">
            {items.map((it) => (
              <div key={it.id} className="item-card">
                <div className="item-thumb">
                  <img src={resolveImage(it.image)} alt={it.name} />
                </div>
                <div className="item-info">
                  <div className="item-top">
                    <p className="item-name">{it.name}</p>
                    <button className="heart-btn" aria-label="Save for later">
                      ♡
                    </button>
                  </div>
                  <div className="price-row">
                    ₹ {it.price} <span className="mrp">{it.old_price}</span>
                  </div>
                  {it.sku && (
                    <div className="color-row">
                      SKU: <b>{it.sku}</b>
                    </div>
                  )}
                  <div className="qty-row">
                    <span>Qty.</span>
                    <div className="stepper">
                      <button
                        onClick={() => updateQty(it.id, -1)}
                        disabled={it.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{it.quantity}</span>
                      <button onClick={() => updateQty(it.id, 1)}>+</button>
                    </div>
                    <span className="stock-text">
                      Line total: ₹ {it.line_total}
                    </span>
                  </div>
                  <div className="card-footer">
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(it.id)}
                    >
                      Remove 🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="summary-card mobile-summary">
              <h2>Order Summary</h2>
              <div className="summary-line">
                <span>Subtotal ({cartMeta.totalItems} items)</span>
                <span>₹ {cartMeta.subtotal}</span>
              </div>
              <div className="summary-line discount">
                <span>Discount</span>
                <span>− ₹ {cartMeta.discount}</span>
              </div>
              <div className="summary-line">
                <span>GST</span>
                <span>₹ {cartMeta.gst}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span>Payable</span>
                <span>₹ {cartMeta.payable}</span>
              </div>
            </div>
          </div>

          <div className="checkout-bar">
            <button className="cart-continue-btn" onClick={goToCheckout}>
              Check Out
            </button>
          </div>

          {/* ---------- Desktop view — sidebar layout (matches My Orders) ---------- */}
          <div className="cd-desktop">
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

            <div className="od-main">
              <div className="od-main-header">
                <h1>My Cart</h1>
                <button className="od-info-btn">
                  <IoInformationCircleOutline />
                  How checkout works?
                </button>
              </div>

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
                    <div key={it.id} className="desktop-row">
                      <div className="desktop-thumb">
                        <img src={resolveImage(it.image)} alt={it.name} />
                      </div>

                      <div className="desktop-name-block">
                        <p className="item-name">{it.name}</p>
                        {it.sku && (
                          <div className="color-row">
                            SKU: <b>{it.sku}</b>
                          </div>
                        )}
                        <button
                          className="desktop-remove"
                          onClick={() => removeItem(it.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="desktop-price">
                        <div className="price-row">
                          ₹ {it.price}{" "}
                          <span className="mrp">{it.old_price}</span>
                        </div>
                      </div>

                      <div className="desktop-qty-cell">
                        <div className="stepper">
                          <button
                            onClick={() => updateQty(it.id, -1)}
                            disabled={it.quantity <= 1}
                          >
                            −
                          </button>
                          <span>{it.quantity}</span>
                          <button onClick={() => updateQty(it.id, 1)}>+</button>
                        </div>
                      </div>

                      <div className="desktop-line-total">
                        ₹ {it.line_total}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-card desktop-only-summary">
                  <h2>Order Summary</h2>
                  <div className="summary-line">
                    <span>Subtotal ({cartMeta.totalItems} items)</span>
                    <span>₹ {cartMeta.subtotal}</span>
                  </div>
                  <div className="summary-line discount">
                    <span>Discount</span>
                    <span>− ₹ {cartMeta.discount}</span>
                  </div>
                  <div className="summary-line">
                    <span>GST</span>
                    <span>₹ {cartMeta.gst}</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-total">
                    <span>Payable</span>
                    <span>₹ {cartMeta.payable}</span>
                  </div>
                  <button
                    className="desktop-checkout-btn"
                    onClick={goToCheckout}
                  >
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
