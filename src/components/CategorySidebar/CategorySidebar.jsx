import { useState } from "react";
import "./CategorySidebar.css";

const items = [
  {
    id: "iphone-17-pro",
    label: "Iphone 17pro",
    image: "/assets/products/iphone-17pro-orange.png",
  },
  {
    id: "iphone-17",
    label: "Iphone 17",
    image: "/assets/products/iphone-17-green.png",
  },
  {
    id: "iphone-17-pro-max",
    label: "Iphone 17pro max",
    image: "/assets/products/iphone-17pro-max.png",
  },
  {
    id: "iphone-17pro-2",
    label: "Iphone 17pro",
    image: "/assets/products/iphone-17pro-orange-2.png",
  },
  {
    id: "iphone-17-2",
    label: "Iphone 17",
    image: "/assets/products/iphone-17-green-2.png",
  },
];

export default function CategorySidebar({ onSelect }) {
  const [activeId, setActiveId] = useState(items[0].id);

  const handleSelect = (id) => {
    setActiveId(id);
    onSelect?.(id);
  };

  return (
    <div className="category-sidebar">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`sidebar-item ${activeId === item.id ? "active" : ""}`}
          onClick={() => handleSelect(item.id)}
        >
          <img src={item.image} alt={item.label} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
