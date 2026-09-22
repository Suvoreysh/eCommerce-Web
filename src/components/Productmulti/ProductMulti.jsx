
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { productApi } from "../../api/productApi";
import { apiRequest, ENDPOINTS } from "../../api/config";
import useVariantCart from "../../hooks/useVariantCart";
import WishlistButton from "../common/WishlistButton";
import {
  sanitizeProductDescription,
  hasRenderableText,
} from "../../utils/richText";

import "./ProductMulti.css";

export default function ProductMulti() {
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);

  const {
    open: openVariants,
    modal: variantModal,
  } = useVariantCart();

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, imagesResponse] = await Promise.all([
          productApi.getById(productId),
          apiRequest(ENDPOINTS.PRODUCT_IMAGES(productId), {
            method: "GET",
            auth: false,
          }),
        ]);

        if (!mounted) return;

        const productData = productResponse?.data || null;

        const imageRows = Array.isArray(imagesResponse?.data)
          ? imagesResponse.data
          : [];

        const apiImages = imageRows
          .filter((item) => Number(item.status ?? 1) === 1)
          .map((item) => item.image_url || item.image)
          .filter(Boolean);

        const allImages = [
          ...new Set(
            apiImages.length
              ? apiImages
              : [productData?.image].filter(Boolean)
          ),
        ];

        setProduct(productData);
        setImages(allImages);
        setCurrentImage(0);
        setLoadedImages({});
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load product.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (productId) {
      fetchProduct();
    }

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <section className="product-hero product-hero-loading">
        <div className="ph-skeleton-image" />

        <div className="product-hero-info">
          <span className="ph-skeleton-bar ph-skeleton-title" />
          <span className="ph-skeleton-bar" />
          <span className="ph-skeleton-bar ph-skeleton-short" />
          <span className="ph-skeleton-btn" />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="product-hero">
        <p className="ph-error">
          {error || "Product not found."}
        </p>
      </section>
    );
  }

  const markLoaded = (image) => {
    setLoadedImages((old) => ({
      ...old,
      [image]: true,
    }));
  };

  const moveSlider = (direction) => {
    setCurrentImage((current) =>
      images.length
        ? (current + direction + images.length) % images.length
        : 0
    );
  };

  const descriptionHtml = sanitizeProductDescription(
    product.description
  );

  const hasDescription = hasRenderableText(
    product.description
  );

  return (
    <section className="product-hero">
      {/* =========================
          PRODUCT IMAGE
      ========================== */}

      <div className="product-hero-media">
        <div className="product-image-area">
          <div className="image-track-wrapper">
            {images[currentImage] && !loadedImages[images[currentImage]] && (
              <div className="product-image-skeleton">
                <span />
              </div>
            )}

            {images.length > 0 ? (
              <div
                className="image-track"
                style={{
                  transform: `translateX(-${currentImage * 100}%)`,
                }}
              >
                {images.map((image) => (
                  <div className="image-slide" key={image}>
                    <img
                      src={image}
                      alt={product.name}
                      loading="eager"
                      decoding="async"
                      onLoad={() => markLoaded(image)}
                      onError={() => markLoaded(image)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="product-no-image">No image available</div>
            )}
          </div>

          {/* Desktop wishlist beside image */}
          <div className="desktop-wishlist">
            <WishlistButton productId={productId} />
          </div>
        </div>

        {/* Image slider */}
        {images.length > 1 && (
          <div className="image-slider">
            <button
              type="button"
              onClick={() => moveSlider(-1)}
              aria-label="Previous image"
            >
              &lsaquo;
            </button>

            <div className="slider-dots">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={currentImage === index ? "active" : ""}
                  onClick={() => setCurrentImage(index)}
                  aria-label={`Show image ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => moveSlider(1)}
              aria-label="Next image"
            >
              &rsaquo;
            </button>
          </div>
        )}
      </div>

      {/* =========================
          PRODUCT INFORMATION
      ========================== */}

      <div className="product-hero-info">
        <h1>{product.name}</h1>

        {(product.price_min || product.price) && (
          <p className="product-hero-price">
            {product.price_min &&
            product.price_max &&
            product.price_min !== product.price_max
              ? `₹${product.price_min} – ₹${product.price_max}`
              : `₹${product.price_min ?? product.price}`}
          </p>
        )}

        {/* Description */}
        {hasDescription && (
          <>
            <div
              className={`product-hero-desc rich-description ${
                descExpanded
                  ? "rich-description--expanded"
                  : "rich-description--clamped"
              }`}
              dangerouslySetInnerHTML={{
                __html: descriptionHtml,
              }}
            />

            <button
              type="button"
              className="desc-toggle-btn"
              onClick={() => setDescExpanded((value) => !value)}
            >
              {descExpanded ? "See less" : "See more"}
            </button>
          </>
        )}

        {/* =========================
            ADD TO CART
        ========================== */}

        <div className="desktop-cart-action">
          <div className="desktop-cart-action">
            <button
              type="button"
              className="add-cart-btn-multi"
              onClick={(event) => openVariants(event, product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Variant cart modal */}
      {variantModal}
    </section>
  );
}

