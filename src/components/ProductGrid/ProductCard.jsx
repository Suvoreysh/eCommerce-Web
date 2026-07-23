import React from "react";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import "./ProductGrid.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      {/* Product Badge */}
      {product.badge && (
        <span className={`product-badge ${product.badge.toLowerCase()}`}>
          {product.badge}
        </span>
      )}

      {/* Wishlist Button */}
      <button className="wishlist-btn">
        <FaHeart />
      </button>

      {/* Product Image */}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Rating */}
      <div className="product-rating">
        {[...Array(5)].map((_, index) => (
          <FaStar key={index} />
        ))}

        <span className="review-count">({product.review})</span>
      </div>

      {/* Product Name */}
      <h3 className="product-name">{product.name}</h3>

      {/* Product Description */}
      <p className="product-description">{product.description}</p>

      {/* Price */}
      <div className="product-price">
        <span className="new-price">${product.price}</span>

        {product.oldPrice && (
          <span className="old-price">${product.oldPrice}</span>
        )}
      </div>

      {/* Add To Cart */}
      <button className="add-cart-btn">
        <FaShoppingCart />
        <span>Add To Cart</span>
      </button>
    </div>
  );
};

export default ProductCard;
