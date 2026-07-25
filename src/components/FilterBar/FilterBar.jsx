import { useState } from "react";
import "./FilterBar.css";
import { FiSliders, FiChevronDown } from "react-icons/fi";
import FilterDrawer from "./FilterDrawer";

export default function FilterBar({ onFiltersClick, onProductsClick }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFiltersClick = () => {
    setIsFilterOpen(true);
    onFiltersClick?.();
  };

  return (
    <>
      <div className="filter-bar">
        <button
          type="button"
          className="filter-btn"
          onClick={handleFiltersClick}
        >
          <FiSliders /> Filters
        </button>

        <button
          type="button"
          className="products-btn"
          onClick={onProductsClick}
        >
          Products <FiChevronDown />
        </button>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  );
}
