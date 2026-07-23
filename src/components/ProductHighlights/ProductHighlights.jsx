import "./ProductHighlights.css";

import icon1 from "../../assets/icons/Icon-fill/1.svg";
import icon2 from "../../assets/icons/Icon-fill/2.svg";
import icon3 from "../../assets/icons/Icon-fill/3.svg";
import icon4 from "../../assets/icons/Icon-fill/4.svg";

import { FiHeart, FiShoppingCart } from "react-icons/fi";

const highlights = [
  {
    icon: icon1,
    title: "Productivity tool",
    desc: "Distraction blocker, custom BUSY message, focus timer, cross-platform sync",
  },
  {
    icon: icon2,
    title: "Apps and integration",
    desc: "App library, connection to 3rd-party software, integrations with calendar events and calls",
  },
  {
    icon: icon3,
    title: "Smart home support",
    desc: "Connect to Google Home and Apple Home via the Matter protocol",
  },
  {
    icon: icon4,
    title: "Developer-friendly",
    desc: "Open HTTP API, open-source SDK, Python / Go / JavaScript libs, MQTT",
  },
];

export default function ProductHighlights() {
  return (
    <section className="product-highlights">
      <div className="highlights-grid">
        {highlights.map(({ icon, title, desc }) => (
          <div className="highlight-card" key={title}>
            <img src={icon} alt={title} className="highlight-icon" />

            <div>
              <p className="highlight-title">{title}</p>
              <p className="highlight-desc">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="action-bar">
        <button className="wishlist-bar-btn">
          <FiHeart /> Wishlist
        </button>

        <button className="cart-bar-btn">
          <FiShoppingCart /> Cart
        </button>
      </div>
    </section>
  );
}
