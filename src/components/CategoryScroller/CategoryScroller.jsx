import { useRef } from "react";
import "./CategoryScroller.css";
import { FiChevronRight } from "react-icons/fi";
import phoneIcon from "../../assets/icons/category-phones.jpg";
import tabletIcon from "../../assets/icons/category-phones.jpg";
import airpodIcon from "../../assets/icons/category-phones.jpg";
import laptopIcon from "../../assets/icons/category-phones.jpg";

const categories = [
  { name: "Phones", icon: phoneIcon },
  { name: "Tablets", icon: tabletIcon },
  { name: "AirPods", icon: airpodIcon },
  { name: "Laptops", icon: laptopIcon },
];

export default function CategoryScroller() {
  const trackRef = useRef(null);

  const scrollNext = () => {
    trackRef.current?.scrollBy({ left: 180, behavior: "smooth" });
  };

  return (
    <div className="category-scroller">
      <div className="category-track" ref={trackRef}>
        {categories.map((cat) => (
          <div className="category-scroll-item" key={cat.name}>
            <div className="category-scroll-circle">
              <img src={cat.icon} alt={cat.name} />
            </div>
            <span>Product Name</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="category-next-btn"
        onClick={scrollNext}
        aria-label="Show more categories"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}
