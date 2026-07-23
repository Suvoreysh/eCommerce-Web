import { Link } from "react-router-dom";
import Button from "../common/Button";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const { id, name, price, mrp, image, badge } = product;

  return (
    <article className="product-card">
      <Link to={`/product/${id}`} className="product-card__media">
        {badge && <span className="product-card__badge">{badge}</span>}
        <button className="product-card__wishlist" aria-label="Add to wishlist" onClick={(e) => e.preventDefault()}>
          ♡
        </button>
        <img src={image} alt={name} loading="lazy" />
      </Link>
      <div className="product-card__body">
        <Link to={`/product/${id}`}>
          <h3 className="product-card__name">{name}</h3>
        </Link>
        <p className="product-card__price">
          ₹{price} {mrp && <span className="product-card__mrp">{mrp}</span>}
        </p>
        <Button fullWidth onClick={() => onAddToCart?.(product)}>
          Add to Cart
        </Button>
      </div>
    </article>
  );
}
