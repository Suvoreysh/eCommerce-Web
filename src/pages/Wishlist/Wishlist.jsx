import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import AccountSidebar from "../../components/profile/AccountSidebar";
import BackHomeButton from "../../components/profile/BackHomeButton";
import "../Cart/Cart.css";
import "./Wishlist.css";

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

  return (
    <div className="cart-page">
      <header className="cart-header">
        <BackHomeButton className="back-btn" />
        <h1>Wishlist</h1>
      </header>

      <p className="cart-title">My Wishlist ({items.length})</p>

      {loading && (
        <p style={{ textAlign: "center", padding: "24px 0" }}>
          Loading wishlist...
        </p>
      )}

      {!loading && items.length === 0 && (
        <div className="wishlist-empty">
          <p>Your wishlist is empty.</p>
          <button
            type="button"
            className="cart-continue-btn"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          {/* ---------- Mobile view ---------- */}
          <div className="mobile-list">
            {items.map((item) => (
              <div key={item.wishlist_id} className="item-card">
                <div
                  className="item-thumb"
                  onClick={() => navigate(`/productdetails/${item.product_id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={item.thumbnail || item.image}
                    alt={item.name}
                  />
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
                      <FiShoppingCart /> View & Add to Cart
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

          {/* ---------- Desktop view ---------- */}
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
