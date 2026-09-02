import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductHighlights.css";

import icon1 from "../../assets/icons/Icon-fill/1.svg";
import icon2 from "../../assets/icons/Icon-fill/2.svg";
import icon3 from "../../assets/icons/Icon-fill/3.svg";
import icon4 from "../../assets/icons/Icon-fill/4.svg";

import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { productApi } from "../../api/productApi";

const fallbackIcons = [icon1, icon2, icon3, icon4];

export default function ProductHighlights({ productId: passedProductId }) {
  const { id } = useParams();
  const productId = passedProductId ?? id;

  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    async function fetchFeatures() {
      setLoading(true);
      setError(null);

      try {
        const res = await productApi.getFeatures(productId, "upper");
        const list = res?.data || [];

        if (!isMounted) return;

        setHighlights(
          list
            .sort((a, b) => a.display_order - b.display_order)
            .map((item, idx) => ({
              id: item.id,
              icon: item.icon_url || fallbackIcons[idx % fallbackIcons.length],
              title: item.title,
              desc: item.description,
            })),
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load highlights");
        setHighlights([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchFeatures();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const showSkeleton = loading;
  const showEmpty = !loading && !error && highlights.length === 0;

  return (
    <section className="product-highlights">
      {error && <p className="highlights-error">{error}</p>}

      {!error && (
        <div className="highlights-grid">
          {showSkeleton &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div className="highlight-card" key={`skeleton-${idx}`}>
                <span className="highlight-skel-icon" />
                <div>
                  <span className="highlight-skel-line highlight-skel-line--title" />
                  <span className="highlight-skel-line highlight-skel-line--desc" />
                  <span className="highlight-skel-line highlight-skel-line--desc-2" />
                </div>
              </div>
            ))}

          {!showSkeleton &&
            highlights.map(({ id, icon, title, desc }) => (
              <div className="highlight-card" key={id}>
                <img src={icon} alt={title} className="highlight-icon" />

                <div>
                  <p className="highlight-title">{title}</p>
                  <p className="highlight-desc">{desc}</p>
                </div>
              </div>
            ))}

          {/* {showEmpty && (
            <p className="highlights-empty">No highlights available.</p>
          )} */}
        </div>
      )}

      <div className="action-bar">
        <button className="wishlist-bar-btn">
          <FiHeart /> Wishlist
        </button>

        <button className="cart-bar-btn">
          <FiShoppingCart /> Cart
        </button>
      </div>
    </section>
  );
}
