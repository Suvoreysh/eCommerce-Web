import { useNavigate } from "react-router-dom";
import "./SaleProductGrid.css";
import useVariantCart from "../../hooks/useVariantCart";
import WishlistButton from "../common/WishlistButton";
import LazyImage from "../common/LazyImage";
import { useAuth } from "../../context/AuthContext";

export default function SaleProductGrid({ title, products = [], seeMoreHref = "/category" }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { open: openVariants, modal: variantModal } = useVariantCart();

  return (
    <section className="sale-grid-section">
      <div className="sale-grid-header">
        <h2>{title}</h2>
        <a href={seeMoreHref} className="see-more-link">
          See More <span>&raquo;</span>
        </a>
      </div>

      <div className="sale-grid">
        {products.map((p) => (
          <div
            className="sale-card"
            key={p.id}
            onClick={() => navigate(`/productdetails/${p.id}`)}
          >
            {p.onSale && <span className="sale-tag">sale</span>}

            <WishlistButton
              productId={p.id}
              className="sale-wishlist-btn"
              activeClassName="sale-wishlist-btn-active"
            />

            <div className="sale-card-img">
              <LazyImage src={p.image} alt={p.name} />
            </div>

            {user ? (
              <p className="sale-price">₹ {p.price}</p>
            ) : (
              <p
                className="sale-price price-login-prompt"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  const returnTo = encodeURIComponent(
                    window.location.pathname + window.location.search,
                  );
                  navigate(`/login?returnTo=${returnTo}`);
                }}
              >
                Login to see price
              </p>
            )}

            <p className="sale-name">{p.name}</p>
            <p className="sale-chip">{p.chip}</p>
            <p className="sale-desc">{p.desc}</p>

            <div className="sale-actions">
              <button
                type="button"
                className="sale-cta-btn"
                onClick={(event) => openVariants(event, p)}
              >
                {p.ctaLabel || "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {variantModal}
    </section>
  );
}
