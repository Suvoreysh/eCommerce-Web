import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSliders, FiChevronDown } from "react-icons/fi";
import { productApi } from "../../api/productApi";
import FilterDrawer from "./FilterDrawer";
import "./FilterBar.css";

// Clickable dropdown showing the current category's name as its label.
// Opens a single-column list of all categories; picking one switches page.
export default function FilterBar({
  onFiltersClick,
  onFiltersApply,
  categoryName,
}) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const handleFiltersClick = () => {
    setIsFilterOpen(true);
    onFiltersClick?.();
  };

  const openMenu = async () => {
    setIsMenuOpen(true);

    if (categories.length > 0) return;

    try {
      setCategoriesLoading(true);
      const response = await productApi.getCategories();
      setCategories(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error("Get categories failed:", err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const goToCategory = (category) => {
    setIsMenuOpen(false);
    navigate(`/category/${category.id}`, {
      state: { categoryName: category.name },
    });
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      <div className="filter-bar" ref={wrapperRef}>
        <button
          type="button"
          className="filter-btn"
          onClick={handleFiltersClick}
        >
          <FiSliders /> Filters
        </button>

        <div className="products-dropdown-wrapper">
          <button
            type="button"
            className="products-btn"
            onClick={() => (isMenuOpen ? setIsMenuOpen(false) : openMenu())}
          >
            {categoryName || "Products"} <FiChevronDown />
          </button>

          {isMenuOpen && (
            <div className="products-dropdown-panel products-dropdown-panel-single">
              <div className="products-dropdown-col">
                {categoriesLoading && (
                  <p className="products-dropdown-message">Loading...</p>
                )}
                {!categoriesLoading &&
                  categories.map((category) => (
                    <button
                      type="button"
                      key={category.id}
                      className={`products-dropdown-item ${
                        category.name === categoryName ? "active" : ""
                      }`}
                      onClick={() => goToCategory(category)}
                    >
                      <span>{category.name}</span>
                    </button>
                  ))}
                {!categoriesLoading && categories.length === 0 && (
                  <p className="products-dropdown-message">
                    No categories found.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={onFiltersApply}
      />
    </>
  );
}
