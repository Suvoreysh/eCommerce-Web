import { useNavigate } from "react-router-dom";
import "./CategoryProductGrid.css";
import { FiHeart, FiBox, FiShield, FiPackage } from "react-icons/fi";

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
      </div>

      {products.length === 0 ? (
        <div className="category-empty">
          <FiPackage className="category-empty-icon" />
          <p className="category-empty-title">No products available</p>
          <p className="category-empty-subtext">
            {title} doesn't have any products yet — check back soon or browse
            another category.
          </p>
        </div>
      ) : (
        <div className="category-grid">
          {products.map((product) => (
            <article
              className="category-card"
              key={product.id}
              onClick={() => navigate(`/productdetails/${product.id}`)}
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
