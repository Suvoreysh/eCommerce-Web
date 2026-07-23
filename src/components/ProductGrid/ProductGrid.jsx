import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiHeart, FiHome, FiShield } from "react-icons/fi";

import { FaHeart, FaStar } from "react-icons/fa";
import phone from "../../assets/icons/category-phones.jpg";
import tablet from "../../assets/icons/category-tablets.jpg";
import airpods from "../../assets/icons/category-airpods.jfif";
import watch from "../../assets/icons/category-watches.jpg";
import accessories from "../../assets/icons/category-accessories.jpg";
import apple from "../../assets/icons/apple.png";
import heroPhone from "../../assets/images/hero-iphone.png";
import airpodsModel from "../../assets/images/airpods-model.png";
import "./ProductGrid.css";

const products = [
  {
    id: 1,
    name: "iPhone 17 Pro",
    price: 399,
    oldPrice: 499,
    rating: 3,
    reviews: 150,
    image: heroPhone,
  },
  {
    id: 2,
    name: "Apple",
    price: 399,
    oldPrice: 499,
    rating: 3,
    reviews: 150,
    image: apple,
  },
  {
    id: 3,
    name: "AirPods",
    price: 399,
    oldPrice: 499,
    rating: 3,
    reviews: 150,
    image: airpodsModel,
  },
  {
    id: 4,
    name: "Phone",
    price: 399,
    oldPrice: 499,
    rating: 3,
    reviews: 150,
    image: phone,
  },
  {
    id: 5,
    name: "Tablet",
    price: 399,
    oldPrice: 499,
    rating: 3,
    reviews: 150,
    image: tablet,
  },
  {
    id: 6,
    name: "Watch",
    price: 399,
    oldPrice: 499,
    rating: 3,
    reviews: 150,
    image: watch,
  },
  {
    id: 7,
    name: "Accessories",
    price: 399,
    oldPrice: 499,
    rating: 3,
    reviews: 150,
    image: accessories,
  },
  {
    id: 8,
    name: "AirPods Category",
    price: 399,
    oldPrice: 499,
    rating: 3,
    reviews: 150,
    image: airpods,
  },
];

export default function ProductGrid() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, index) => (
      <FaStar key={index} className={index < count ? "star filled" : "star"} />
    ));
  };

  return (
    <section className="product-section">
      <div className="product-inner">
        <h2 className="product-heading">Product List</h2>

        <div className="product-grid">
          {products.map((p) => (
            <div
              className="product-card"
              key={p.id}
              onClick={() => navigate(`/productdetails/${p.id}`)}
            >
              <button
                className="wishlist-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(p.id);
                }}
              >
                {wishlist.includes(p.id) ? (
                  <FaHeart className="heart-active" />
                ) : (
                  <FiHeart />
                )}
              </button>

              <div className="product-image-box">
                <img src={p.image} alt={p.name} className="product-image" />
              </div>
              <h3 className="product-name">{p.name}</h3>
              <div className="price-row">
                <span className="price">₹ {p.price}</span>

                <span className="old-price">{p.oldPrice}</span>
              </div>

              <div className="rating-row">
                <div className="stars">{renderStars(p.rating)}</div>

                <span className="review">
                  {p.rating} | {p.reviews}
                </span>
              </div>

              <div className="feature-row">
                <div className="feature">
                  <FiHome />

                  <span>Product Name</span>
                </div>

                <div className="feature">
                  <FiShield />

                  <span>UV Protection</span>
                </div>
              </div>

              <button
                className="add-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  console.log("Add To Cart");
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <button className="view-all-btn" onClick={() => navigate("/products")}>
          View all products
        </button>
      </div>
    </section>
  );
}
