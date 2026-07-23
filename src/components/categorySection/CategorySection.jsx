import "./CategorySection.css";
import phoneIcon from "../../assets/icons/category-phones.jpg";
import tabletIcon from "../../assets/icons/category-tablets.jpg";
import airpodIcon from "../../assets/icons/category-airpods.jfif";
import watchIcon from "../../assets/icons/category-watches.jpg";
import accessoryIcon from "../../assets/icons/category-accessories.jpg";
import chargerIcon from "../../assets/icons/category-accessories.jpg";

const categories = [
  { name: "Phones", icon: phoneIcon },
  { name: "Tablets", icon: tabletIcon },
  { name: "AirPods", icon: airpodIcon },
  { name: "Watches", icon: watchIcon },

];

export default function CategorySection() {
  return (
    <section className="category-section">
      <div className="category-inner">
        {categories.map((cat) => (
          <div className="category-item" key={cat.name}>
            <div className="category-circle">
              <img src={cat.icon} alt={cat.name} />
            </div>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
