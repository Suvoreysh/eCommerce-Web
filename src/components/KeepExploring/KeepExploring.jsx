import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiChevronRight } from "react-icons/fi";
import { productApi } from "../../api/productApi";
import { cartApi } from "../../api/cartApi";
import { useCartCount } from "../../context/CartCountContext";
import { VariantModal } from "../ProductGrid/ProductGrid";
import "./KeepExploring.css";

const SKELETON_COUNT = 4;

export default function KeepExploring({ productId: passedProductId }) {
  const { id } = useParams();
  const productId = passedProductId ?? id;
  const navigate = useNavigate();
  const { refreshCartCount } = useCartCount();
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [variantModalProduct, setVariantModalProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantsError, setVariantsError] = useState("");
  const [adding, setAdding] = useState(false);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const response = await productApi.getRelated(productId);
        const data = Array.isArray(response?.data) ? response.data : [];
        if (!mounted) return;
        setProducts(data);
        setCategoryName(data[0]?.category_name || "Products");
      } catch (error) {
        console.error("Related products error:", error);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (productId) fetchRelated();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const openVariantModal = async (product) => {
    setVariantModalProduct(product);
    setVariants([]);
    setVariantsError("");
    setVariantsLoading(true);
    try {
      const response = await productApi.getProductVariants(product.id);
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
            "Standard",
          image: variant.image ?? product.image,
          price:
            variant.price ??
            variant.sale_price ??
            variant.regular_price ??
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
                price: product.price_min ?? product.price_max,
                stock_quantity: product.stock_quantity,
              },
            ],
      );
    } catch (error) {
      setVariantsError(error.message || "Unable to load variants.");
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
    } catch (error) {
      alert(error.message || "Unable to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (!productId || (!loading && !products.length)) return null;

  const pageCount = Math.max(
    1,
    Math.ceil((loading ? SKELETON_COUNT : products.length) / 2),
  );
  const scrollToPage = (page) => {
    const track = sliderRef.current;
    if (!track) return;
    track.scrollTo({
      left: page * (track.clientWidth * 0.86),
      behavior: "smooth",
    });
    setActivePage(page);
  };

  return (
    <section className="keep-exploring">
      <div className="keep-exploring-header">
        <h2>Keep Exploring {categoryName}</h2>
        <a href="/products" className="explore-more-link">
          Exploring More <span>‹›</span>
        </a>
      </div>
      <div className="keep-exploring-slider" ref={sliderRef}>
        <div className="keep-exploring-row">
          {loading &&
            Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <article className="explore-card explore-skeleton" key={index}>
                <i />
                <i />
                <i />
                <i />
              </article>
            ))}
          {!loading &&
            products.map((product) => (
              <article className="explore-card" key={product.id}>
                <button
                  type="button"
                  className={`explore-wishlist ${wishlist.includes(product.id) ? "active" : ""}`}
                  onClick={() =>
                    setWishlist((old) =>
                      old.includes(product.id)
                        ? old.filter((item) => item !== product.id)
                        : [...old, product.id],
                    )
                  }
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <FiHeart />
                </button>
                <div className="explore-image-box">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                {(product.price_min || product.price_max) && (
                  <p className="explore-price">
                    Price:{" "}
                    <strong>
                      ₹{product.price_min || product.price_max}
                      {product.price_min &&
                      product.price_max &&
                      product.price_min !== product.price_max
                        ? ` – ₹${product.price_max}`
                        : ""}
                    </strong>
                  </p>
                )}
                <h3 className="explore-name">{product.name}</h3>
                <p className="explore-chip">{product.subcategory_name}</p>
                <div className="explore-actions">
                  <button
                    type="button"
                    className="explore-btn"
                    onClick={() => navigate(`/productdetails/${product.id}`)}
                  >
                    View more
                  </button>
                  <button
                    type="button"
                    className="explore-cart-btn"
                    onClick={() => openVariantModal(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <FiShoppingCart />
                  </button>
                </div>
              </article>
            ))}
        </div>
      </div>
      <div className="explore-navigation">
        <div className="explore-dots">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              type="button"
              key={index}
              className={`explore-dot ${activePage === index ? "active" : ""}`}
              onClick={() => scrollToPage(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="explore-next-btn"
          onClick={() =>
            scrollToPage(activePage === pageCount - 1 ? 0 : activePage + 1)
          }
          aria-label="Show next products"
        >
          <FiChevronRight />
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
