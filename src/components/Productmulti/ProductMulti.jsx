import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../../api/config";
import { cartApi } from "../../api/cartApi";
import { useCartCount } from "../../context/CartCountContext";
import "./ProductMulti.css";
import { VariantModal } from "../ProductGrid/ProductGrid";

export default function ProductMulti() {
  const { id: productId } = useParams();
  const { refreshCartCount } = useCartCount();

  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [variantModalProduct, setVariantModalProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantsError, setVariantsError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest(
          ENDPOINTS.PRODUCT_DETAIL(productId),
          { method: "GET", auth: false },
        );

        if (!isMounted) return;

        setProduct(response?.data || null);
        setCurrentImage(0);
      } catch (err) {
        if (!isMounted) return;
        console.error("Get product failed:", err);
        setError(err.message || "Unable to load product.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (productId) fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const openVariantModal = async () => {
    setVariantModalProduct(product);
    setVariants([]);
    setVariantsError("");
    setVariantsLoading(true);

    try {
      const response = await apiRequest(
        ENDPOINTS.PRODUCT_VARIANTS(productId),
        { method: "GET", auth: false },
      );

      const rows = Array.isArray(response?.data) ? response.data : [];

      const normalized = rows
        .map((variant) => ({
          id: variant.id ?? variant.product_variant_id ?? null,
          name: product.name,
          label:
            variant.label ??
            variant.storage ??
            variant.size ??
            variant.sku ??
            variant.attributes?.storage ??
            variant.attributes?.size,
          image: variant.image ?? product.image,
          price:
            variant.price ??
            variant.sale_price ??
            variant.regular_price ??
            product.price ??
            product.price_min ??
            product.price_max,
          stock_quantity: variant.stock_quantity,
        }))
        .filter((variant) => variant.id !== null);

      const variantData = normalized.length
        ? normalized
        : [
            {
              id: product.id,
              name: product.name,
              label: "Standard",
              image: product.image,
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

  // Matches the same add-to-cart behaviour used on the home/category grids.
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

  const images = product?.image ? [product.image] : [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <section className="product-hero">
        <div className="product-hero-media">
          <div className="ph-skeleton-image" />
        </div>
        <div className="product-hero-info">
          <span className="ph-skeleton-bar ph-skeleton-title" />
          <span className="ph-skeleton-bar ph-skeleton-price" />
          <span className="ph-skeleton-bar" />
          <span className="ph-skeleton-bar ph-skeleton-short" />
          <span className="ph-skeleton-btn" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-hero">
        <p className="ph-error">{error}</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-hero">
        <p className="ph-error">Product not found.</p>
      </section>
    );
  }

  return (
    <section className="product-hero">
      <div className="product-hero-media">
        <div className="image-track-wrapper">
          <div
            className="image-track"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {images.map((img, index) => (
              <div className="image-slide" key={index}>
                <img src={img} alt={product.name} />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <div className="image-slider">
            <button onClick={prevImage}>&lsaquo;</button>

            <div className="slider-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={currentImage === index ? "active" : ""}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>

            <button onClick={nextImage}>&rsaquo;</button>
          </div>
        )}
      </div>

      <div className="product-hero-info">
        <h1>{product.name}</h1>

        {product.description && (
          <p className="product-hero-desc">{product.description}</p>
        )}

        <button className="add-cart-btn-multi" onClick={openVariantModal}>
          Add to Cart
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
