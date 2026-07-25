import { useNavigate } from "react-router-dom";
import "./CategoryProductGrid.css";
import { FiHeart, FiBox, FiShield } from "react-icons/fi";

export default function CategoryProductGrid({ title, products = [] }) {
  const navigate = useNavigate();

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    console.log("Added to cart:", product);
  };

  return (
    <section className="category-grid-section">
      <div className="category-grid-header">
        <h2>{title}</h2>

        <a href={`/category/${title.toLowerCase()}`} className="see-more-link">
          See More <span>&raquo;</span>
        </a>
      </div>

      {products.length === 0 ? (
        <div className="category-empty">No products found.</div>
      ) : (
        <div className="category-grid">
          {products.map((product) => (
            <article
              className="category-card"
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <button
                type="button"
                className="category-wishlist-btn"
                aria-label={`Add ${product.name} to wishlist`}
                onClick={(event) => {
                  event.stopPropagation();
                  console.log("Added to wishlist:", product);
                }}
              >
                <FiHeart />
              </button>

              <div className="category-card-img">
                <img src={product.image} alt={product.name} />
              </div>

              <p className="category-name">{product.name}</p>

              <p className="category-price">
                <span className="price-current">₹ {product.price}</span>

                <span className="price-original">
                  ₹ {product.originalPrice}
                </span>
              </p>

              <div className="category-tags">
                <span>
                  <FiBox />
                  {product.tag1 || "Premium Product"}
                </span>

                <span>
                  <FiShield />
                  {product.tag2 || "Quality Assured"}
                </span>
              </div>

              <button
                type="button"
                className="category-cta-btn"
                onClick={(event) => handleAddToCart(event, product)}
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
