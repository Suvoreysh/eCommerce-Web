import "./Hero.css";
import heroPhone from "../../assets/images/hero-iphone.png";

export default function Hero() {
  return (
    <section className="hero">
      <p className="offer">
        Offer @ <span className="old">₹699</span>{" "}
        <span className="price">499</span> <a href="/">Shop Now</a>
      </p>

      <div className="hero-content">
        <h1 className="iphone">IPHONE</h1>

        <h2 className="number">17</h2>

        <img src={heroPhone} alt="iPhone 17" className="phone" />
      </div>

      <div className="fade"></div>
    </section>
  );
}
