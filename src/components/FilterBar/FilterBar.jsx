import "./FilterBar.css";
import { FiSliders, FiChevronDown } from "react-icons/fi";

export default function FilterBar({ onFiltersClick, onProductsClick }) {
  return (
    <div className="filter-bar">
      <button type="button" className="filter-btn" onClick={onFiltersClick}>
        <FiSliders /> Filters
      </button>

      <button type="button" className="products-btn" onClick={onProductsClick}>
        Products <FiChevronDown />
      </button>
    </div>
  );
}
