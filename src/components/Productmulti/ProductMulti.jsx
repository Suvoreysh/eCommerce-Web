import { useState } from "react";
import "./ProductMulti.css";

import img1 from "../../assets/images/orange.png";
import img2 from "../../assets/images/white.png";
import img3 from "../../assets/images/orange.png";
import img4 from "../../assets/images/white.png";

const images = [img1, img2, img3, img4];

export default function ProductMulti() {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <section className="product-hero">
      <div className="product-hero-media">
        <div className="image-track-wrapper">
          <div
            className="image-track"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {images.map((img, index) => (
              <div className="image-slide" key={index}>
                <img src={img} alt="MacBook Neo" />
              </div>
            ))}
          </div>
        </div>

        <div className="image-slider">
          <button onClick={prevImage}>&lsaquo;</button>

          <div className="slider-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={currentImage === index ? "active" : ""}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>

          <button onClick={nextImage}>&rsaquo;</button>
        </div>
      </div>

      <div className="product-hero-info">
        <h1>Mack Book</h1>

        <p className="product-hero-price">
          From ₹11150.00/mo.Per Month with instant cashback Footnote and No Cost
          EMI Footnote or MRP ₹69900.00 (inclusive of all taxes)
        </p>

        <p className="product-hero-desc">
          productivity multi-tool with an LED pixel screen for custom statuses.
          Built-in Pomodoro timer and apps.
        </p>

        <button className="add-cart-btn-multi">Add to Cart</button>
      </div>
    </section>
  );
}
