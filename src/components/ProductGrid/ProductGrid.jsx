import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import { FiHeart, FiHome, FiShield, FiX } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";

import { productApi } from "../../api/productApi";
import { cartApi } from "../../api/cartApi";
import { useCartCount } from "../../context/CartCountContext";
import "./ProductGrid.css";
import "./VariantModal.css";

export function VariantModal({
  product,
  variants,
  loading,
  error,
  onClose,
  onConfirm,
  adding,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedId(variants[0]?.id ?? null);
    setQuantity(1);
  }, [product?.id, variants]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape" && !adding) onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [adding, onClose]);

  const selectedVariant = variants.find((variant) => variant.id === selectedId);

  const updateQuantity = (nextQuantity) => {
    const maximum = Number(selectedVariant?.stock_quantity) || 99;
    setQuantity(Math.min(maximum, Math.max(1, nextQuantity)));
  };

  return createPortal(
    <div
      className="variant-modal-overlay"
      onClick={() => !adding && onClose()}
      role="presentation"
    >
      <div
        className="variant-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="variant-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="variant-modal-header">
          <div>
            <h3 id="variant-modal-title">Select Variant</h3>
            <p>Choose an option and quantity</p>
          </div>
          <button
            type="button"
            className="variant-modal-close"
            onClick={onClose}
            disabled={adding}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {loading && (
          <p className="variant-modal-message">Loading variants...</p>
        )}
        {!loading && error && (
          <p className="variant-modal-message variant-modal-error">{error}</p>
        )}
        {!loading && !error && variants.length === 0 && (
          <p className="variant-modal-message">No variants available.</p>
        )}

        {!loading && !error && variants.length > 0 && (
          <>
            <div className="variant-modal-grid">
              {variants.map((variant) => (
                <button
                  type="button"
                  key={variant.id}
                  className={`variant-card ${selectedId === variant.id ? "variant-card-selected" : ""}`}
                  onClick={() => setSelectedId(variant.id)}
                >
                  <img
                    src={
                      variant.image || product?.image || product?.product?.image
                    }
                    alt={variant.name}
                    className="variant-card-image"
                  />
                  <p className="variant-card-price">
                    Price: ₹{Number(variant.price || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="variant-card-name" title={variant.name}>
                    {variant.name}
                  </p>
                  <span className="variant-card-label">
                    {variant.label ||
                      variant.storage ||
                      variant.sku ||
                      "Standard"}
                  </span>
                </button>
              ))}
            </div>

            <div className="variant-modal-footer">
              <div className="variant-quantity-group">
                <span className="variant-quantity-label">Quantity</span>
                <div className="variant-qty-stepper">
                  <button
                    type="button"
                    disabled={quantity <= 1 || adding}
                    onClick={() => updateQuantity(quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    disabled={adding}
                    onClick={() => updateQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="variant-modal-confirm"
                disabled={selectedId === null || adding}
                onClick={() => onConfirm(selectedId, quantity)}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default function ProductGrid() {
  const navigate = useNavigate();
  const { refreshCartCount } = useCartCount();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [variantModalProduct, setVariantModalProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantsError, setVariantsError] = useState("");
  const [adding, setAdding] = useState(false);

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

  const openVariantModal = async (event, product) => {
    event.stopPropagation();

    const productId =
      product.id ?? product.product_id ?? product.product?.id ?? null;

    setVariantModalProduct(product);
    setVariants([]);
    setVariantsError("");
    setVariantsLoading(true);

    try {
      if (productId === null) {
        throw new Error("Product ID is missing.");
      }

      const response = await productApi.getProductVariants(productId);
      const responseData = response?.data;
      const rawVariants = [
        responseData,
        responseData?.variants,
        responseData?.product_variants,
        responseData?.data,
        response?.variants,
      ].find(Array.isArray) ?? [];

      const normalizedVariants = rawVariants
        .map((variant) => ({
          ...variant,
          id:
            variant.id ??
            variant.variant_id ??
            variant.product_variant_id ??
            variant.product_id ??
            variant.product?.id ??
            null,
          name:
            variant.name ??
            variant.variant_name ??
            variant.product_name ??
            product.name,
          label:
            variant.label ??
            variant.storage ??
            variant.size ??
            variant.sku ??
            variant.attributes?.storage ??
            variant.attributes?.size,
          image:
            variant.image ??
            variant.image_url ??
            variant.product?.image ??
            product.image ??
            product.product?.image,
          price:
            variant.price ??
            variant.sale_price ??
            variant.regular_price ??
            product.price ??
            product.price_min ??
            product.price_max,
        }))
        .filter((variant) => variant.id !== null);

      // Products without variant rows use one Standard option so the user can
      // still choose quantity before adding the product.
      const variantData = normalizedVariants.length
        ? normalizedVariants
        : [
            {
              id: productId,
              name: product.name,
              label: "Standard",
              image: product.image || product.product?.image,
              price: product.price ?? product.price_min ?? product.price_max,
              stock_quantity: product.stock_quantity,
            },
          ];

      setVariants(variantData);
    } catch (err) {
      console.error("Get variants failed:", err);
      setVariantsError(err.message || "Unable to load variants.");
    } finally {
      setVariantsLoading(false);
    }
  };

  const addToCart = async (variantId, quantity) => {
    try {
      setAdding(true);
      await cartApi.addItem(variantId, quantity);
      setVariantModalProduct(null);
      refreshCartCount();
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert(err.message || "Unable to add item to cart.");
    } finally {
      setAdding(false);
    }
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
                    <span className="price">
                      ₹ {product.price_min} – ₹ {product.price_max}
                    </span>
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
                    disabled={adding && variantModalProduct?.id === product.id}
                    onClick={(event) => openVariantModal(event, product)}
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

      {variantModalProduct && (
        <VariantModal
          product={variantModalProduct}
          variants={variants}
          loading={variantsLoading}
          error={variantsError}
          adding={adding}
          onClose={() => setVariantModalProduct(null)}
          onConfirm={addToCart}
        />
      )}
    </section>
  );
}