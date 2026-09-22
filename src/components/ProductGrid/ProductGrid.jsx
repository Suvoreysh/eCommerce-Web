import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiHome, FiShield } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import { productApi } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";
import useVariantCart from "../../hooks/useVariantCart";
import WishlistButton from "../common/WishlistButton";
import "./ProductGrid.css";

const PRODUCT_SKELETON_COUNT = 6;

export default function ProductGrid() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { open: openVariants, modal: variantModal } = useVariantCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageStatus, setImageStatus] = useState({});

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
        setImageStatus({});
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

  const handleProductImageLoad = (id) => {
    setImageStatus((previous) => ({ ...previous, [id]: "loaded" }));
  };

  const handleProductImageError = (id) => {
    setImageStatus((previous) => ({ ...previous, [id]: "error" }));
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

  return (
    <section className="product-section">
      <div className="product-inner">
        <h2 className="product-heading">Product List</h2>

        {loading && (
          <div className="product-grid" aria-label="Loading products">
            {Array.from({ length: PRODUCT_SKELETON_COUNT }).map((_, index) => (
              <div
                className="product-card product-card-skeleton"
                key={`product-skeleton-${index}`}
                aria-hidden="true"
              >
                <div className="product-image-box product-skeleton-image">
                  <div className="product-skeleton-shimmer" />
                </div>
                <div className="product-skeleton-name">
                  <div className="product-skeleton-shimmer" />
                </div>
                <div className="product-skeleton-price">
                  <div className="product-skeleton-shimmer" />
                </div>
                <div className="product-skeleton-rating">
                  <div className="product-skeleton-shimmer" />
                </div>
                <div className="product-skeleton-features">
                  <div className="product-skeleton-feature">
                    <div className="product-skeleton-shimmer" />
                  </div>
                  <div className="product-skeleton-feature">
                    <div className="product-skeleton-shimmer" />
                  </div>
                </div>
                <div className="product-skeleton-button">
                  <div className="product-skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
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
            {products.map((product, index) => {
              const productKey =
                product.id ?? product.product_id ?? `product-${index}`;
              const productImage =
                product.image || product.product?.image || "";
              const status = imageStatus[productKey];
              const hasImage = Boolean(productImage);
              const rating = Number(
                product.average_rating ?? product.rating ?? 0,
              );

              const reviewCount = Number(product.rating_count ?? 0);

              return (
                <div
                  className="product-card"
                  key={productKey}
                  onClick={() => navigate(`/productdetails/${product.id}`)}
                >
                  <WishlistButton
                    productId={product.id}
                    className="wishlist-btn"
                    activeClassName="wishlist-btn-active"
                  />

                  <div
                    className={`product-image-box ${status === "loaded" ? "image-loaded" : ""}`}
                  >
                    {hasImage && status !== "loaded" && status !== "error" && (
                      <div
                        className="product-image-skeleton"
                        aria-hidden="true"
                      >
                        <div className="product-skeleton-shimmer" />
                      </div>
                    )}
                    {hasImage && status !== "error" && (
                      <img
                        src={productImage}
                        alt={product.name || "Product"}
                        className="product-image"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        onLoad={() => handleProductImageLoad(productKey)}
                        onError={() => handleProductImageError(productKey)}
                      />
                    )}
                  </div>

                  <h3 className="product-name" title={product.name}>
                    {product.name}
                  </h3>

                  {user ? (
                    <div className="price-row">
                      <span className="price">
                        ₹ {product.price_min} – ₹ {product.price_max}
                      </span>
                    </div>
                  ) : (
                    <div className="price-row">
                      <span
                        className="price price-login-prompt"
                        onClick={(event) => {
                          event.stopPropagation();
                          const returnTo = encodeURIComponent(
                            window.location.pathname + window.location.search,
                          );
                          navigate(`/login?returnTo=${returnTo}`);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        Login to see price
                      </span>
                    </div>
                  )}

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
                    onClick={(event) => openVariants(event, product)}
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

      {variantModal}
    </section>
  );
}
