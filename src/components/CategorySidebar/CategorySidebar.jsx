import "./CategorySidebar.css";

import phone from "../../assets/icons/category-phones.jpg";
import tablet from "../../assets/icons/category-tablets.jpg";
import airpods from "../../assets/icons/category-airpods.jfif";
import watch from "../../assets/icons/category-watches.jpg";
import accessories from "../../assets/icons/category-accessories.jpg";

const items = [
  {
    id: "phones",
    label: "Phones",
    image: phone,
  },
  {
    id: "tablets",
    label: "Tablets",
    image: tablet,
  },
  {
    id: "airpods",
    label: "AirPods",
    image: airpods,
  },
  {
    id: "watches",
    label: "Watches",
    image: watch,
  },
  {
    id: "accessories",
    label: "Accessories",
    image: accessories,
  },
];

export default function CategorySidebar({ activeId, onSelect }) {
  return (
    <aside className="category-sidebar">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`sidebar-item ${activeId === item.id ? "active" : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <img src={item.image} alt={item.label} />
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}
