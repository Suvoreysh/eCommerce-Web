import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiShoppingCart, FiChevronRight } from "react-icons/fi";

import { productApi } from "../../api/productApi";
import { cartApi } from "../../api/cartApi";
import { useCartCount } from "../../context/CartCountContext";
import { useAuth } from "../../context/AuthContext";

import VariantModal from "../common/VariantModal";
import WishlistButton from "../common/WishlistButton";

import "./KeepExploring.css";

const SKELETON_COUNT = 4;

/*
  Number of cards represented by one dot/page.

  Your original logic uses 2 products per page,
  so we keep the same behaviour.
*/
const ITEMS_PER_PAGE = 2;

export default function KeepExploring({ productId: passedProductId }) {
  const { id } = useParams();

  const productId = passedProductId ?? id;

  const navigate = useNavigate();

  const { refreshCartCount } = useCartCount();
  const { user } = useAuth();

  const sliderRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const [loading, setLoading] = useState(true);

  const [variantModalProduct, setVariantModalProduct] = useState(null);

  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);

  const [variantsError, setVariantsError] = useState("");

  const [adding, setAdding] = useState(false);

  /*
    Current visible slider page.
  */
  const [activePage, setActivePage] = useState(0);

  /* =========================================
     FETCH RELATED PRODUCTS
  ========================================= */

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

        /*
          Reset slider when product changes.
        */
        setActivePage(0);

        if (sliderRef.current) {
          sliderRef.current.scrollLeft = 0;
        }
      } catch (error) {
        console.error("Related products error:", error);

        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (productId) {
      fetchRelated();
    }

    return () => {
      mounted = false;
    };
  }, [productId]);

  /* =========================================
     VARIANT MODAL
  ========================================= */

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

  /* =========================================
     ADD TO CART
  ========================================= */

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

  /* =========================================
     PAGE COUNT
  ========================================= */

  const totalItems = loading ? SKELETON_COUNT : products.length;

  const pageCount = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  /* =========================================
     SCROLL TO DOT/PAGE
  ========================================= */

  const scrollToPage = (page) => {
    const track = sliderRef.current;

    if (!track) return;

    /*
      Actual maximum amount the slider
      can horizontally scroll.
    */
    const maxScroll = track.scrollWidth - track.clientWidth;

    /*
      If there is only one page.
    */
    if (pageCount <= 1 || maxScroll <= 0) {
      track.scrollTo({
        left: 0,
        behavior: "smooth",
      });

      setActivePage(0);

      return;
    }

    /*
      Divide total scroll distance equally
      between all dots.

      This guarantees:
      first dot = start
      last dot = exact end
    */
    const pagePosition = maxScroll * (page / (pageCount - 1));

    track.scrollTo({
      left: pagePosition,
      behavior: "smooth",
    });

    setActivePage(page);
  };

  /* =========================================
     DETECT MANUAL SCROLL / SWIPE

     THIS IS THE IMPORTANT FIX.

     When the user manually scrolls,
     calculate which dot corresponds
     to the current scroll position.
  ========================================= */

  const handleSliderScroll = () => {
    const track = sliderRef.current;

    if (!track) return;

    if (pageCount <= 1) {
      if (activePage !== 0) {
        setActivePage(0);
      }

      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;

    if (maxScroll <= 0) {
      if (activePage !== 0) {
        setActivePage(0);
      }

      return;
    }

    /*
      Current scroll percentage:
      0 = beginning
      1 = end
    */
    const progress = track.scrollLeft / maxScroll;

    /*
      Convert scroll percentage
      into dot index.
    */
    const calculatedPage = Math.round(progress * (pageCount - 1));

    /*
      Prevent invalid indexes.
    */
    const safePage = Math.max(0, Math.min(calculatedPage, pageCount - 1));

    if (safePage !== activePage) {
      setActivePage(safePage);
    }
  };

  /* =========================================
     NEXT PAGE
  ========================================= */

  const handleNext = () => {
    const nextPage = activePage >= pageCount - 1 ? 0 : activePage + 1;

    scrollToPage(nextPage);
  };

  /* =========================================
     EMPTY
  ========================================= */

  if (!productId || (!loading && !products.length)) {
    return null;
  }

  return (
    <section className="keep-exploring">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="keep-exploring-header">
        <h2>Keep Exploring {categoryName}</h2>

        <a href="/products" className="explore-more-link">
          Exploring More
          <span>‹›</span>
        </a>
      </div>

      {/* =====================================
          PRODUCT SLIDER
      ====================================== */}

      <div
        className="keep-exploring-slider"
        ref={sliderRef}
        onScroll={handleSliderScroll}
      >
        <div className="keep-exploring-row">
          {/* SKELETON */}

          {loading &&
            Array.from({
              length: SKELETON_COUNT,
            }).map((_, index) => (
              <article className="explore-card explore-skeleton" key={index}>
                <i />
                <i />
                <i />
                <i />
              </article>
            ))}

          {/* PRODUCTS */}

          {!loading &&
            products.map((product) => (
              <article className="explore-card" key={product.id}>
                {/* WISHLIST */}

                <WishlistButton
                  productId={product.id}
                  className="explore-wishlist"
                  activeClassName="active"
                />

                {/* IMAGE */}

                <div className="explore-image-box">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>

                {/* PRICE */}

                {user ? (
                  (product.price_min || product.price_max) && (
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
                  )
                ) : (
                  <p
                    className="explore-price explore-price-login-prompt"
                    onClick={(event) => {
                      event.stopPropagation();

                      const returnTo = encodeURIComponent(
                        window.location.pathname,
                      );

                      navigate(`/login?returnTo=${returnTo}`);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();

                        const returnTo = encodeURIComponent(
                          window.location.pathname,
                        );

                        navigate(`/login?returnTo=${returnTo}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    Login to see price
                  </p>
                )}

                {/* NAME */}

                <h3 className="explore-name">{product.name}</h3>

                {/* SUBCATEGORY */}

                <p className="explore-chip">{product.subcategory_name}</p>

                {/* ACTIONS */}

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

      {/* =====================================
          NAVIGATION
      ====================================== */}

      <div className="explore-navigation">
        {/* DOTS */}

        <div className="explore-dots">
          {Array.from({
            length: pageCount,
          }).map((_, index) => (
            <button
              type="button"
              key={index}
              className={`explore-dot ${activePage === index ? "active" : ""}`}
              onClick={() => scrollToPage(index)}
              aria-label={`Go to slide ${index + 1} of ${pageCount}`}
              aria-current={activePage === index ? "true" : undefined}
            />
          ))}
        </div>

        {/* NEXT */}

        <button
          type="button"
          className="explore-next-btn"
          onClick={handleNext}
          aria-label="Show next products"
        >
          <FiChevronRight />
        </button>
      </div>

      {/* =====================================
          VARIANT MODAL
      ====================================== */}

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
