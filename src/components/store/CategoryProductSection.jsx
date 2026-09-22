import { Link } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";

import StoreProductCard, { StoreProductCardSkeleton } from "./StoreProductCard";
import "./CategoryProductSection.css";

const SKELETON_COUNT = 4;

/**
 * One "MacBook Air 13” and 15”"-style block from the Store design:
 * category name + "See More »" (-> /category/:id) + a row of product cards.
 */
export default function CategoryProductSection({
  category,
  section,
  onAddToCart,
  onRetry,
}) {
  const { status, products, message } = section;

  return (
    <section className="store-section" aria-label={category.name}>
      <div className="store-section__header">
        <h2>{category.name}</h2>

        <Link to={`/category/${category.id}`} className="store-section__more">
          See More <span aria-hidden="true">&raquo;</span>
        </Link>
      </div>

      {status === "loading" && (
        <div className="store-section__grid" aria-busy="true">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <StoreProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="store-section__error" role="alert">
          <p>{message || `Unable to load ${category.name}.`}</p>
          <button type="button" onClick={() => onRetry(category.id)}>
            <FiRefreshCw aria-hidden="true" /> Try again
          </button>
        </div>
      )}

      {status === "ready" && (
        <div className="store-section__grid">
          {products.map((product) => (
            <StoreProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
