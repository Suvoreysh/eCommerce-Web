import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { cartApi } from "../../api/cartApi";
import LazyImage from "../../components/common/LazyImage";
import { resolveImageUrl } from "../../utils/image";
import { useCartCount } from "../../context/CartCountContext";
import AccountSidebar from "../../components/profile/AccountSidebar";
import BackHomeButton from "../../components/profile/BackHomeButton";
import "./Cart.css";
import "./CartEmpty.css";

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

function computeSummary(items) {
  let subtotal = 0;
  let gst = 0;

  for (const it of items) {
    const qty = it.quantity;
    subtotal += (Number(it.price) || 0) * qty;
    if (it.gst_amount != null) gst += Number(it.gst_amount) * qty;
  }

  return {
    subtotal,
    gst,
    discount: 0,
    payable: Math.max(0, subtotal + gst),
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
  };
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
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await cartApi.getCart();
      const data = response?.data;
      const fetchedItems = Array.isArray(data?.items) ? data.items : [];
      setItems(fetchedItems);
      setCartMeta({
        totalItems: Number(data?.total_items ?? 0),
        subtotal: Number(data?.subtotal ?? 0),
        gst: Number(data?.gst ?? 0),
        discount: Number(data?.discount ?? 0),
        payable: Number(data?.payable ?? 0),
      });
      refreshCartCount();
    } catch (err) {
      console.error("Get cart failed:", err);
      setError(err.message || "Unable to load cart.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [refreshCartCount]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fully remove item — no re-add
  const removeItem = useCallback(
    async (it) => {
      if (updatingId === it.id) return;
      setUpdatingId(it.id);

      // Optimistic: remove from list
      setItems((prev) => {
        const next = prev.filter((x) => x.id !== it.id);
        setCartMeta(computeSummary(next));
        return next;
      });

      try {
        await cartApi.deleteItem(it.id);
        refreshCartCount();
      } catch (err) {
        console.error("Remove failed:", err);
        fetchCart();
      } finally {
        setUpdatingId(null);
      }
    },
    [updatingId, refreshCartCount, fetchCart],
  );

  // Decrease quantity:
  //   newQty <= 0  → just delete, no re-add
  //   newQty >= 1  → DELETE first, then re-ADD with newQty
  const decreaseQty = useCallback(
    async (it) => {
      if (updatingId === it.id) return;

      const newQty = it.quantity - 1;

      setUpdatingId(it.id);

      // Optimistic UI
      if (newQty <= 0) {
        setItems((prev) => {
          const next = prev.filter((x) => x.id !== it.id);
          setCartMeta(computeSummary(next));
          return next;
        });
      } else {
        setItems((prev) => {
          const next = prev.map((x) =>
            x.id === it.id ? { ...x, quantity: newQty } : x,
          );
          setCartMeta(computeSummary(next));
          return next;
        });
      }

      try {
        // Step 1: always delete the current cart entry
        await cartApi.deleteItem(it.id);

        // Step 2: if newQty >= 1, re-add with the reduced quantity
        if (newQty >= 1) {
          await cartApi.addItem(it.product_variant_id, newQty);
        }

        refreshCartCount();
      } catch (err) {
        console.error("Decrease qty failed:", err);
        fetchCart();
      } finally {
        setUpdatingId(null);
      }
    },
    [updatingId, refreshCartCount, fetchCart],
  );

  // Increase quantity:
  //   DELETE first, then re-ADD with newQty
  const increaseQty = useCallback(
    async (it) => {
      if (updatingId === it.id) return;

      const newQty = it.quantity + 1;

      setUpdatingId(it.id);

      // Optimistic UI
      setItems((prev) => {
        const next = prev.map((x) =>
          x.id === it.id ? { ...x, quantity: newQty } : x,
        );
        setCartMeta(computeSummary(next));
        return next;
      });

      try {
        // Step 1: delete existing entry
        await cartApi.deleteItem(it.id);

        // Step 2: re-add with increased quantity
        await cartApi.addItem(it.product_variant_id, newQty);

        // Refresh to get new cart item id from server (id changes after delete+add)
        refreshCartCount();
        fetchCart();
      } catch (err) {
        console.error("Increase qty failed:", err);
        fetchCart();
      } finally {
        setUpdatingId(null);
      }
    },
    [updatingId, refreshCartCount, fetchCart],
  );

  const goToCheckout = () => navigate("/cart/details");

  // ─── EMPTY STATE ──────────────────────────────────────────────────────────────
  const EmptyCart = () => (
    <div className="cart-empty-root">
      <div className="cart-empty-mobile">
        <div className="cart-empty-icon-wrap">
          <FiShoppingBag className="cart-empty-icon" />
        </div>
        <h2 className="cart-empty-title">Your cart is empty</h2>
        <p className="cart-empty-sub">
          Looks like you haven't added anything yet. Browse our products and
          find something you'll love.
        </p>
        <button
          type="button"
          className="cart-empty-cta"
          onClick={() => navigate("/products")}
        >
          Browse Products <FiArrowRight />
        </button>
      </div>

      <div className="cd-desktop cart-empty-desktop">
        <AccountSidebar />
        <div className="od-main cart-empty-desktop-main">
          <div className="od-main-header">
            <div className="od-main-title">
              <BackHomeButton className="od-desktop-back-btn" />
              <h1>My Cart</h1>
            </div>
          </div>
          <div className="cart-empty-desktop-body">
            <div className="cart-empty-illustration">
              <FiShoppingBag />
            </div>
            <h2>Your cart is empty</h2>
            <p>
              You haven't added any products yet. Start exploring and add items
              to your cart.
            </p>
            <button
              type="button"
              className="cart-empty-cta"
              onClick={() => navigate("/products")}
            >
              Browse Products <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── SUMMARY BLOCK ────────────────────────────────────────────────────────────
  const SummaryCard = ({ className, children }) => (
    <div className={`summary-card ${className}`}>
      <h2>Order Summary</h2>
      <div className="summary-line">
        <span>Subtotal ({cartMeta.totalItems} items)</span>
        <span>₹ {cartMeta.subtotal.toLocaleString("en-IN")}</span>
      </div>
      {cartMeta.gst > 0 && (
        <div className="summary-line">
          <span>GST</span>
          <span>₹ {cartMeta.gst.toLocaleString("en-IN")}</span>
        </div>
      )}
      <div className="summary-divider" />
      <div className="summary-total">
        <span>Payable</span>
        <span>₹ {cartMeta.payable.toLocaleString("en-IN")}</span>
      </div>
      {children}
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="cart-page">
      <header className="cart-header">
        <button
          className="back-btn"
          aria-label="Go back"
          onClick={() => navigate("/")}
        >
          {backIcon}
        </button>
        <h1>Cart</h1>
      </header>

      {loading && (
        <p style={{ textAlign: "center", padding: "24px 0" }}>Loading cart…</p>
      )}

      {!loading && error && (
        <p style={{ textAlign: "center", padding: "24px 0", color: "red" }}>
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && <EmptyCart />}

      {!loading && !error && items.length > 0 && (
        <>
          <p className="cart-title">My Cart ({cartMeta.totalItems})</p>

          {/* ── MOBILE ── */}
          <div className="mobile-list">
            {items.map((it) => (
              <div
                key={it.id}
                className={`item-card${updatingId === it.id ? " item-card--removing" : ""}`}
              >
                <div className="item-thumb">
                  <LazyImage src={resolveImageUrl(it.image)} alt={it.name} />
                </div>

                <div className="item-info">
                  <div className="item-top">
                    <p className="item-name">{it.name}</p>
                  </div>

                  <div className="price-row">
                    ₹ {it.price}
                    {it.old_price && (
                      <span className="mrp">₹ {it.old_price}</span>
                    )}
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
                        onClick={() => decreaseQty(it)}
                        disabled={updatingId === it.id}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{it.quantity}</span>
                      <button
                        onClick={() => increaseQty(it)}
                        disabled={updatingId === it.id}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="stock-text">
                      ₹{" "}
                      {(Number(it.price) * it.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="card-footer">
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(it)}
                      disabled={updatingId === it.id}
                    >
                      {updatingId === it.id ? "Removing…" : "Remove 🗑"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <SummaryCard className="mobile-summary" />
          </div>

          <div className="checkout-bar">
            <button className="cart-continue-btn" onClick={goToCheckout}>
              Check Out
            </button>
          </div>

          {/* ── DESKTOP ── */}
          <div className="cd-desktop">
            <AccountSidebar />

            <div className="od-main">
              <div className="od-main-header">
                <div className="od-main-title">
                  <BackHomeButton className="od-desktop-back-btn" />
                  <h1>My Cart</h1>
                </div>
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
                    <span>Total</span>
                  </div>

                  {items.map((it) => (
                    <div
                      key={it.id}
                      className={`desktop-row${updatingId === it.id ? " desktop-row--removing" : ""}`}
                    >
                      <div className="desktop-thumb">
                        <LazyImage
                          src={resolveImageUrl(it.image)}
                          alt={it.name}
                        />
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
                          onClick={() => removeItem(it)}
                          disabled={updatingId === it.id}
                        >
                          {updatingId === it.id ? "Removing…" : "Remove"}
                        </button>
                      </div>

                      <div className="desktop-price">
                        <div className="price-row">
                          ₹ {it.price}
                          {it.old_price && (
                            <span className="mrp">₹ {it.old_price}</span>
                          )}
                        </div>
                      </div>

                      <div className="desktop-qty-cell">
                        <div className="stepper">
                          <button
                            onClick={() => decreaseQty(it)}
                            disabled={updatingId === it.id}
                          >
                            −
                          </button>
                          <span>{it.quantity}</span>
                          <button
                            onClick={() => increaseQty(it)}
                            disabled={updatingId === it.id}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="desktop-line-total">
                        ₹{" "}
                        {(Number(it.price) * it.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <SummaryCard className="desktop-only-summary">
                  <button
                    className="desktop-checkout-btn"
                    onClick={goToCheckout}
                  >
                    Check Out
                  </button>
                </SummaryCard>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
