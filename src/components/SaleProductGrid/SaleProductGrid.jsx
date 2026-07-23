import { useNavigate } from "react-router-dom";
import "./SaleProductGrid.css";
import { FiHeart, FiShoppingCart } from "react-icons/fi";

export default function SaleProductGrid({ title, products = [] }) {
  const navigate = useNavigate();

  return (
    <section className="sale-grid-section">
      <div className="sale-grid-header">
        <h2>{title}</h2>
        <a href="/category" className="see-more-link">
          See More <span>&raquo;</span>
        </a>
      </div>

      <div className="sale-grid">
        {products.map((p) => (
          <div
            className="sale-card"
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
          >
            {p.onSale && <span className="sale-tag">sale</span>}

            <button
              type="button"
              className="sale-wishlist-btn"
              aria-label="Add to wishlist"
              onClick={(e) => e.stopPropagation()}
            >
              <FiHeart />
            </button>

            <div className="sale-card-img">
              <img src={p.image} alt={p.name} />
            </div>

            <p className="sale-price">Price: {p.price}</p>
            <p className="sale-name">{p.name}</p>
            <p className="sale-chip">{p.chip}</p>
            <p className="sale-desc">{p.desc}</p>

            <div className="sale-actions">
              <button
                type="button"
                className="sale-cta-btn"
                onClick={(e) => e.stopPropagation()}
              >
                {p.ctaLabel || "Add to Cart"}
              </button>
              <span className="sale-cart-icon">
                <FiShoppingCart />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
