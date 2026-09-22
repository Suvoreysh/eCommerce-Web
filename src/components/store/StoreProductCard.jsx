import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

import LazyImage from "../common/LazyImage";
import WishlistButton from "../common/WishlistButton";
import { formatPriceRange } from "../../utils/format";
import "./StoreProductCard.css";

/**
 * Product card for the Store listing — see the "product listing page" design.
 * `product` is a normalised list product (utils/catalog.normalizeListProduct).
 * Both the "Add to Cart" button and the cart icon open the variant picker.
 */
export default function StoreProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const href = `/productdetails/${product.id}`;
  const price = formatPriceRange(product.priceMin, product.priceMax);
  const stop = (event) => event.stopPropagation();

  return (
    <article className="sp-card" onClick={() => navigate(href)}>
      <WishlistButton
        productId={product.id}
        className="sp-card__wish"
        activeClassName="sp-card__wish--active"
      />

      <Link
        to={href}
        className="sp-card__media"
        onClick={stop}
        tabIndex={-1}
        aria-hidden="true"
      >
        <LazyImage src={product.image} alt="" />
      </Link>

      {price && (
        <p className="sp-card__price">
          Price: <b>{price}</b>
        </p>
      )}

      <h3 className="sp-card__name" title={product.name}>
        <Link to={href} onClick={stop}>
          {product.name}
        </Link>
      </h3>

      {product.subcategoryName && (
        <p className="sp-card__chip">{product.subcategoryName}</p>
      )}
      {product.categoryName && (
        <p className="sp-card__tagline">{product.categoryName}</p>
      )}

      <div className="sp-card__actions">
        <button
          type="button"
          className="sp-card__cta"
          onClick={(event) => onAddToCart(event, product)}
        >
          Add to Cart
        </button>

        <button
          type="button"
          className="sp-card__cart"
          aria-label={`Add ${product.name} to cart`}
          onClick={(event) => onAddToCart(event, product)}
        >
          <FiShoppingCart />
        </button>
      </div>
    </article>
  );
}

export function StoreProductCardSkeleton() {
  return (
    <div className="sp-card sp-card--skeleton" aria-hidden="true">
      <span className="lazy-img sp-card__media" data-status="loading">
        <span className="lazy-img__skeleton" />
      </span>
      <span className="sp-skeleton-line sp-skeleton-line--price" />
      <span className="sp-skeleton-line" />
      <span className="sp-skeleton-line sp-skeleton-line--short" />
      <span className="sp-skeleton-btn" />
    </div>
  );
}
