import "./ProductHero.css";
import productImg from "../../assets/images/airpods-model.png";

export default function ProductHero() {
  return (
    <section className="product-hero">
      <div className="product-hero-media">
        <img src={productImg} alt="MacBook Neo" />
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

        <button type="button" className="add-cart-btn">
          Add to Cart
        </button>
      </div>
    </section>
  );
}
