import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiHeart, FiArrowRight } from "react-icons/fi";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import AccountSidebar from "../../components/profile/AccountSidebar";
import BackHomeButton from "../../components/profile/BackHomeButton";
import "../Cart/Cart.css";
import "./Wishlist.css";
import "./WishlistEmpty.css";

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, loading, removeItem, refresh } = useWishlist();

  useEffect(() => {
    if (!user) {
      const returnTo = encodeURIComponent("/wishlist");
      navigate(`/login?returnTo=${returnTo}`, { replace: true });
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  const priceLabel = (item) =>
    item.min_price === item.max_price
      ? `₹ ${item.min_price}`
      : `₹ ${item.min_price} – ₹ ${item.max_price}`;

  // ─── EMPTY STATE ───────────────────────────────────────────────────────────
  const EmptyWishlist = () => (
    <div className="wl-empty-root">
      {/* Mobile */}
      <div className="wl-empty-mobile">
        <div className="wl-empty-icon-wrap">
          <FiHeart className="wl-empty-icon" />
        </div>
        <h2 className="wl-empty-title">Nothing saved yet</h2>
        <p className="wl-empty-sub">
          Tap the heart on any product to save it here. Your wishlist is
          waiting!
        </p>
        <button
          type="button"
          className="wl-empty-cta"
          onClick={() => navigate("/products")}
        >
          Browse Products <FiArrowRight />
        </button>
      </div>

      {/* Desktop — sidebar stays visible */}
      <div className="cd-desktop wl-empty-desktop">
        <AccountSidebar />
        <div className="od-main wl-empty-desktop-main">
          <div className="od-main-header">
            <div className="od-main-title">
              <BackHomeButton className="od-desktop-back-btn" />
              <h1>My Wishlist</h1>
            </div>
          </div>
          <div className="wl-empty-desktop-body">
            <div className="wl-empty-illustration">
              <FiHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>
              Save products you love by tapping the heart icon. They'll all
              appear here for easy access.
            </p>
            <button
              type="button"
              className="wl-empty-cta"
              onClick={() => navigate("/products")}
            >
              Browse Products <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="cart-page">
      <header className="cart-header">
        <BackHomeButton className="back-btn" />
        <h1>Wishlist</h1>
      </header>

      {loading && (
        <p style={{ textAlign: "center", padding: "24px 0" }}>
          Loading wishlist…
        </p>
      )}

      {!loading && items.length === 0 && <EmptyWishlist />}

      {!loading && items.length > 0 && (
        <>
          <p className="cart-title">My Wishlist ({items.length})</p>

          {/* ── MOBILE ── */}
          <div className="mobile-list">
            {items.map((item) => (
              <div key={item.wishlist_id} className="item-card">
                <div
                  className="item-thumb"
                  onClick={() =>
                    navigate(`/productdetails/${item.product_id}`)
                  }
                  role="button"
                  tabIndex={0}
                >
                  <img src={item.thumbnail || item.image} alt={item.name} />
                </div>

                <div className="item-info">
                  <div className="item-top">
                    <p
                      className="item-name"
                      onClick={() =>
                        navigate(`/productdetails/${item.product_id}`)
                      }
                      role="button"
                      tabIndex={0}
                    >
                      {item.name}
                    </p>
                  </div>
                  <div className="price-row">{priceLabel(item)}</div>
                  <div className="card-footer">
                    <button
                      type="button"
                      className="wishlist-move-btn"
                      onClick={() =>
                        navigate(`/productdetails/${item.product_id}`)
                      }
                    >
                      <FiShoppingCart /> View &amp; Add to Cart
                    </button>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeItem(item.product_id)}
                    >
                      Remove <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP ── */}
          <div className="cd-desktop wishlist-desktop">
            <AccountSidebar />
            <div className="od-main">
              <div className="od-main-header">
                <div className="od-main-title">
                  <BackHomeButton className="od-desktop-back-btn" />
                  <h1>My Wishlist</h1>
                </div>
              </div>

              <div className="desktop-items wishlist-desktop-items">
                <div className="desktop-items-head">
                  <span></span>
                  <span>Product</span>
                  <span>Price</span>
                  <span></span>
                </div>

                {items.map((item) => (
                  <div key={item.wishlist_id} className="desktop-row">
                    <div
                      className="desktop-thumb"
                      onClick={() =>
                        navigate(`/productdetails/${item.product_id}`)
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.name}
                      />
                    </div>

                    <div className="desktop-name-block">
                      <p
                        className="item-name"
                        onClick={() =>
                          navigate(`/productdetails/${item.product_id}`)
                        }
                        role="button"
                        tabIndex={0}
                      >
                        {item.name}
                      </p>
                      <button
                        className="desktop-remove"
                        onClick={() => removeItem(item.product_id)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="desktop-price">
                      <div className="price-row">{priceLabel(item)}</div>
                    </div>

                    <button
                      type="button"
                      className="wishlist-move-btn wishlist-move-btn--desktop"
                      onClick={() =>
                        navigate(`/productdetails/${item.product_id}`)
                      }
                    >
                      <FiShoppingCart /> View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
