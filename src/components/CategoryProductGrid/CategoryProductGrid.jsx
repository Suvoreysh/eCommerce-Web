import { useNavigate } from "react-router-dom";
import "./CategoryProductGrid.css";
import { FiHeart, FiHome, FiShield } from "react-icons/fi";

export default function CategoryProductGrid({ title, products = [] }) {
  const navigate = useNavigate();

  return (
    <section className="category-grid-section">
      <div className="category-grid-header">
        <h2>{title}</h2>
        <a href="/category" className="see-more-link">
          See More <span>&raquo;</span>
        </a>
      </div>

      <div className="category-grid">
        {products.map((p) => (
          <div
            className="category-card"
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
          >
            <button
              type="button"
              className="category-wishlist-btn"
              aria-label="Add to wishlist"
              onClick={(e) => e.stopPropagation()}
            >
              <FiHeart />
            </button>

            <div className="category-card-img">
              <img src={p.image} alt={p.name} />
            </div>

            <p className="category-name">{p.name}</p>

            <p className="category-price">
              <span className="price-current">₹ {p.price}</span>
              <span className="price-original">{p.originalPrice}</span>
            </p>

            <div className="category-tags">
              <span>
                <FiHome /> {p.tag1 || "Product Name"}
              </span>
              <span>
                <FiShield /> UV Protection
              </span>
            </div>

            <button
              type="button"
              className="category-cta-btn"
              onClick={(e) => e.stopPropagation()}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
