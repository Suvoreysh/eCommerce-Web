import "./ProBeyond.css";

import mainImg from "../../assets/images/white.png";
import card1 from "../../assets/images/orange.png";
import card2 from "../../assets/images/white.png";
import card3 from "../../assets/images/orange.png";

const products = [
  {
    title: "Product Name",
    subtitle: "Utrumque suas trumque audivi adivinos intellegem",
    image: mainImg,
    layout: "center",
  },
  {
    title: "Product Name",
    subtitle: "Utrumque suas trumque audivi adivinos intellegem",
    image: card1,
    layout: "left",
  },
  {
    title: "Product Name",
    subtitle: "Utrumque suas trumque audivi adivinos intellegem",
    image: card2,
    layout: "center",
  },
  {
    title: "Product Name",
    subtitle: "Utrumque suas trumque audivi adivinos intellegem",
    image: card3,
    layout: "left",
  },
];

function ProductItem({ item }) {
  if (item.layout === "center") {
    return (
      <section className="product-section center-layout">
        <div className="product-content">
          <h2>{item.title}</h2>

          <p className="product-subtitle">{item.subtitle}</p>

          <div className="product-image">
            <img src={item.image} alt={item.title} />
          </div>

          <div className="product-buttons">
            <button className="btn-outline">Learn more</button>

            <button className="btn-filled">Buy</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-section split-layout">
      <div className="split-image">
        <img src={item.image} alt={item.title} />
      </div>

      <div className="split-content">
        <h2>{item.title}</h2>

        <p className="product-subtitle">{item.subtitle}</p>

        <div className="product-buttons">
          <button className="btn-outline">Learn more</button>

          <button className="btn-filled">Buy</button>
        </div>
      </div>
    </section>
  );
}

export default function ProBeyond() {
  return (
    <section className="pro-beyond">
      {products.map((item, index) => (
        <ProductItem key={index} item={item} />
      ))}
    </section>
  );
}
