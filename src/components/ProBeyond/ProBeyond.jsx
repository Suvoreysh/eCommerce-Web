import "./ProBeyond.css";

import mainImg from "../../assets/images/white.png";
import orangeImg from "../../assets/images/orange.png";
import whiteImg from "../../assets/images/white.png";

const products = [
  {
    id: 1,
    title: "Product Name",
    subtitle:
      "Ultra-thin design with powerful performance and an advanced camera system.",
    image: mainImg,
    layout: "center",
    theme: "aqua",
  },
  {
    id: 2,
    title: "Product Name",
    subtitle:
      "A powerful smartphone created for photography, gaming and everyday use.",
    image: whiteImg,
    layout: "split",
    imagePosition: "right",
    theme: "white",
  },
  {
    id: 3,
    title: "Product Name",
    subtitle:
      "Premium materials, intelligent performance and exceptional battery life.",
    image: mainImg,
    layout: "center",
    theme: "aqua",
  },
  {
    id: 4,
    title: "Product Name",
    subtitle:
      "Designed to look beautiful and perform smoothly throughout your day.",
    image: orangeImg,
    layout: "split",
    imagePosition: "left",
    theme: "white",
  },
];

/* ==========================================================
   SINGLE BUTTON
   Shows "Buy Now"
   Hover -> Changes to "Learn More"
========================================================== */

function ProductButton() {
  return (
    <button className="product-action-button">
      <span className="button-default-text">Buy Now</span>

      <span className="button-hover-text">Learn More</span>
    </button>
  );
}

/* ==========================================================
   CENTER PRODUCT
========================================================== */

function CenterProduct({ item }) {
  return (
    <section
      className={`product-section center-product product-theme-${item.theme}`}
    >
      <div className="center-product-content">
        <div className="product-text">
          <h2>{item.title}</h2>

          <p className="product-subtitle">{item.subtitle}</p>
        </div>

        <div className="center-product-image">
          <img src={item.image} alt={item.title} />
        </div>

        <ProductButton />
      </div>
    </section>
  );
}

/* ==========================================================
   SPLIT PRODUCT
========================================================== */

function SplitProduct({ item }) {
  const direction =
    item.imagePosition === "right" ? "image-right" : "image-left";

  return (
    <section
      className={`product-section split-product ${direction} product-theme-${item.theme}`}
    >
      <div className="split-product-inner">
        <div className="split-product-image">
          <img src={item.image} alt={item.title} />
        </div>

        <div className="split-product-content">
          <h2>{item.title}</h2>

          <p className="product-subtitle">{item.subtitle}</p>

          <ProductButton />
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   PRODUCT ITEM
========================================================== */

function ProductItem({ item }) {
  if (item.layout === "center") {
    return <CenterProduct item={item} />;
  }

  return <SplitProduct item={item} />;
}

/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function ProBeyond() {
  return (
    <section className="pro-beyond">
      <div className="pro-beyond-container">
        {products.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
