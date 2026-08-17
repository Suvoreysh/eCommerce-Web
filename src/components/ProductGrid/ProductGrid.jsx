import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiHeart, FiHome, FiShield } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";

import { productApi } from "../../api/productApi";
import "./ProductGrid.css";

export default function ProductGrid() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await productApi.getAll();

        if (!isMounted) return;

        const productData = Array.isArray(response?.data) ? response.data : [];

        // Display a maximum of six products
        setProducts(productData.slice(0, 6));
      } catch (err) {
        if (!isMounted) return;

        console.error("Product API error:", err);

        setError(err.message || "Unable to load products.");
        setProducts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((previousWishlist) =>
      previousWishlist.includes(id)
        ? previousWishlist.filter((itemId) => itemId !== id)
        : [...previousWishlist, id],
    );
  };

  const renderStars = (rating) => {
    const ratingValue = Math.min(5, Math.max(0, Number(rating) || 0));

    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < Math.round(ratingValue) ? "star filled" : "star"}
      />
    ));
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    console.log("Add to cart:", product);
  };

  return (
    <section className="product-section">
      <div className="product-inner">
        <h2 className="product-heading">Product List</h2>

        {loading && (
          <p
            style={{
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            Loading products...
          </p>
        )}

        {!loading && error && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            No products available.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => {
              const rating = Number(
                product.average_rating ?? product.rating ?? 0,
              );

              const reviewCount = Number(product.rating_count ?? 0);

              return (
                <div
                  className="product-card"
                  key={product.id}
                  onClick={() => navigate(`/productdetails/${product.id}`)}
                >
                  <button
                    type="button"
                    className="wishlist-btn"
                    aria-label={
                      wishlist.includes(product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                  >
                    {wishlist.includes(product.id) ? (
                      <FaHeart className="heart-active" />
                    ) : (
                      <FiHeart />
                    )}
                  </button>

                  <div className="product-image-box">
                    <img
                      src={product.image || product.product?.image}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="product-name" title={product.name}>
                    {product.name}
                  </h3>

                  <div className="price-row">
                    <span className="price">₹ {product.price}</span>

                    {product.old_price && (
                      <span className="old-price">₹ {product.old_price}</span>
                    )}
                  </div>

                  <div className="rating-row">
                    <div className="stars">{renderStars(rating)}</div>

                    <span className="review">
                      {rating.toFixed(1)} | {reviewCount}
                    </span>
                  </div>

                  <div className="feature-row">
                    <div className="feature">
                      <FiHome />
                      <span>Product Name</span>
                    </div>

                    <div className="feature">
                      <FiShield />
                      <span>UV Protection</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="add-cart-btn"
                    onClick={(event) => handleAddToCart(event, product)}
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="view-all-btn"
          onClick={() => navigate("/products")}
        >
          View all products
        </button>
      </div>
    </section>
  );
}
