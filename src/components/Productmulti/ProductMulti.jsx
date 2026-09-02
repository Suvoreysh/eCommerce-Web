import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest, ENDPOINTS } from "../../api/config";
import { cartApi } from "../../api/cartApi";
import { useCartCount } from "../../context/CartCountContext";
import { VariantModal } from "../ProductGrid/ProductGrid";
import "./ProductMulti.css";

export default function ProductMulti() {
  const { id: productId } = useParams();
  const { refreshCartCount } = useCartCount();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [variantModalProduct, setVariantModalProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantsError, setVariantsError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const [productResponse, imagesResponse] = await Promise.all([
          apiRequest(ENDPOINTS.PRODUCT_DETAIL(productId), {
            method: "GET",
            auth: false,
          }),
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
            apiImages.length ? apiImages : [productData?.image].filter(Boolean),
          ),
        ];

        setProduct(productData);
        setImages(allImages);
        setCurrentImage(0);
        setLoadedImages({});
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load product.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (productId) fetchProduct();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const openVariantModal = async () => {
    setVariantModalProduct(product);
    setVariants([]);
    setVariantsError("");
    setVariantsLoading(true);
    try {
      const response = await apiRequest(ENDPOINTS.PRODUCT_VARIANTS(productId), {
        method: "GET",
        auth: false,
      });
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
            variant.attributes?.size ??
            "Standard",
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
      setVariants(
        normalized.length
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
            ],
      );
    } catch (err) {
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
      alert(err.message || "Unable to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
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
  if (error || !product)
    return (
      <section className="product-hero">
        <p className="ph-error">{error || "Product not found."}</p>
      </section>
    );

  const markLoaded = (image) =>
    setLoadedImages((old) => ({ ...old, [image]: true }));
  const moveSlider = (direction) =>
    setCurrentImage((current) =>
      images.length ? (current + direction + images.length) % images.length : 0,
    );

  return (
    <section className="product-hero">
      <div className="product-hero-media">
        <div className="image-track-wrapper">
          {images[currentImage] && !loadedImages[images[currentImage]] && (
            <div className="product-image-skeleton">
              <span />
            </div>
          )}
          {images.length > 0 ? (
            <div
              className="image-track"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
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
      <div className="product-hero-info">
        <h1>{product.name}</h1>
        {product.price && <p className="product-hero-price">{product.price}</p>}
        {product.description && (
          <p className="product-hero-desc">
            {product.description.replace(/<[^>]*>/g, " ")}
          </p>
        )}
        <button
          type="button"
          className="add-cart-btn-multi"
          onClick={openVariantModal}
        >
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
