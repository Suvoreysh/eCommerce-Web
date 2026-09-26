import { FiBox, FiShield, FiShoppingBag } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import useVariantCart from "../../hooks/useVariantCart";
import LazyImage from "../common/LazyImage";
import WishlistButton from "../common/WishlistButton";
import { formatPriceRange } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import "./CategoryProductGrid.css";

export default function CategoryProductGrid({ title, products = [] }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { open: openVariants, modal: variantModal } = useVariantCart();

  return (
    <section className="category-grid-section">
      <div className="category-grid-header">
        <h2>{title}</h2>
      </div>

      {products.length === 0 ? (
        <div className="category-empty">
          <span className="category-empty-art">
            <FiShoppingBag className="category-empty-icon" />
          </span>
          <p className="category-empty-title">No products available</p>
          <p className="category-empty-subtext">
            {title} doesn't have any products yet — check back soon or browse
            another category.
          </p>
          <Link to="/products" className="category-empty-cta">
            Browse other categories
          </Link>
        </div>
      ) : (
        <div className="category-grid">
          {products.map((product) => (
            <article
              className="category-card"
              key={product.id}
              onClick={() => navigate(`/productdetails/${product.id}`)}
            >
              <WishlistButton
                productId={product.id}
                className="category-wishlist-btn"
                activeClassName="category-wishlist-btn-active"
              />

              <div className="category-card-img">
                <LazyImage src={product.image} alt={product.name} />
              </div>

              <p className="category-name">{product.name}</p>

              {user ? (
                <p className="category-price">
                  <span className="price-current">
                    {formatPriceRange(product.priceMin, product.priceMax)}
                  </span>
                </p>
              ) : (
                <p className="category-price">
                  <span
                    className="price-login-prompt"
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
                  </span>
                </p>
              )}

              <div className="category-tags">
                <span>
                  <FiBox />
                  {product.categoryName || "Premium Product"}
                </span>
                <span>
                  <FiShield />
                  {product.subcategoryName || "Quality Assured"}
                </span>
              </div>

              <button
                type="button"
                className="category-cta-btn"
                onClick={(event) => openVariants(event, product)}
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      )}

      {variantModal}
    </section>
  );
}
