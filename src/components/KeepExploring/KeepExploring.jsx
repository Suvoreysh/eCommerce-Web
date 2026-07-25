import { useRef } from "react";
import { FiHeart, FiShoppingCart, FiChevronRight } from "react-icons/fi";

import "./KeepExploring.css";

import macAir13 from "../../assets/images/airpods-model.png";
import macAir15 from "../../assets/images/airpods-model.png";

const relatedProducts = [
  {
    id: 1,
    name: "MacBook Air 13” and 15”",
    price: "₹7,29,900",
    tag: "sale",
    chip: "M5 chip",
    description: "Thin. Fast. Powerful and portable.",
    image: macAir13,
  },
  {
    id: 2,
    name: "MacBook Air 13” and 15”",
    price: "₹7,29,900",
    tag: "sale",
    chip: "M5 chip",
    description: "Thin. Fast. Powerful and portable.",
    image: macAir15,
  },
  {
    id: 3,
    name: "MacBook Air 13” and 15”",
    price: "₹7,29,900",
    tag: "sale",
    chip: "M5 chip",
    description: "Thin. Fast. Powerful and portable.",
    image: macAir13,
  },
  {
    id: 4,
    name: "MacBook Air 13” and 15”",
    price: "₹7,29,900",
    tag: "sale",
    chip: "M5 chip",
    description: "Thin. Fast. Powerful and portable.",
    image: macAir15,
  },
];

export default function KeepExploring() {
  const sliderRef = useRef(null);

  const handleNext = () => {
    sliderRef.current?.scrollBy({
      left: 220,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
  };

  return (
    <section className="keep-exploring">
      <div className="keep-exploring-header">
        <h2>Keep Exploring Mac Pro</h2>

        <a href="/products" className="explore-more-link">
          Exploring More
          <span>‹›</span>
        </a>
      </div>

      <div className="keep-exploring-slider" ref={sliderRef}>
        <div className="keep-exploring-row">
          {relatedProducts.map((product) => (
            <article className="explore-card" key={product.id}>
              <span className="explore-tag">{product.tag}</span>

              <button
                type="button"
                className="explore-wishlist"
                aria-label={`Add ${product.name} to wishlist`}
              >
                <FiHeart />
              </button>

              <div className="explore-image-box">
                <img src={product.image} alt={product.name} />
              </div>

              <p className="explore-price">
                Price: <strong>{product.price}</strong>
              </p>

              <h3 className="explore-name">{product.name}</h3>

              <p className="explore-chip">{product.chip}</p>

              <p className="explore-description">{product.description}</p>

              <div className="explore-actions">
                <button type="button" className="explore-btn">
                  View more
                </button>

                <button
                  type="button"
                  className="explore-cart-btn"
                  aria-label={`Add ${product.name} to cart`}
                  onClick={() => handleAddToCart(product)}
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
          <button
            type="button"
            className="explore-dot active"
            aria-label="Slide 1"
          />

          <button type="button" className="explore-dot" aria-label="Slide 2" />

          <button type="button" className="explore-dot" aria-label="Slide 3" />

          <button type="button" className="explore-dot" aria-label="Slide 4" />
        </div>

        <button
          type="button"
          className="explore-next-btn"
          onClick={handleNext}
          aria-label="Show next products"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
}
