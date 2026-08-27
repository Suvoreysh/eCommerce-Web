import { useState } from "react";
import {
  FiX,
  FiSliders,
  FiChevronUp,
  FiChevronDown,
  FiStar,
} from "react-icons/fi";
import "./FilterDrawer.css";

const SORT_OPTIONS = [
  "Popular",
  "New Collection",
  "Price : High To Low",
  "Price : Low To High",
];

const PRICE_OPTIONS = ["Under ₹1,000", "₹1,000 - 3,000", "Above - 5,000"];

const RATING_OPTIONS = [4, 3, 2];

export default function FilterDrawer({ isOpen, onClose, onApply }) {
  const [openSections, setOpenSections] = useState({
    sort: true,
    price: true,
    rating: true,
  });
  const [selectedSort, setSelectedSort] = useState("Popular");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleClearAll = () => {
    setSelectedSort(null);
    setSelectedPrice(null);
    setSelectedRating(null);
    onApply?.({ sort: null, price: null, rating: null });
  };

  const handleShowResult = () => {
    onApply?.({
      sort: selectedSort,
      price: selectedPrice,
      rating: selectedRating,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="filter-drawer-overlay" onClick={onClose}>
      <aside className="filter-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="fd-header">
          <h2>Filters</h2>
          <button className="fd-close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        {/* Sub-header */}
        <div className="fd-subheader">
          <span className="fd-subheader-title">
            <FiSliders /> Filters
          </span>
          <button className="fd-clear-btn" onClick={handleClearAll}>
            Clear All
          </button>
        </div>
        <div className="fd-divider" />

        <div className="fd-body">
          {/* Sort By */}
          <div className="fd-section">
            <button
              className="fd-section-header"
              onClick={() => toggleSection("sort")}
            >
              <span>Short By</span>
              {openSections.sort ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSections.sort && (
              <div className="fd-options">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`fd-option${selectedSort === opt ? " fd-option--active" : ""}`}
                    onClick={() => setSelectedSort(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="fd-divider" />

          {/* Price Range */}
          <div className="fd-section">
            <button
              className="fd-section-header"
              onClick={() => toggleSection("price")}
            >
              <span>Price Range</span>
              {openSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSections.price && (
              <div className="fd-options">
                {PRICE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`fd-option${selectedPrice === opt ? " fd-option--active" : ""}`}
                    onClick={() => setSelectedPrice(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="fd-divider" />

          {/* Rating */}
          <div className="fd-section">
            <button
              className="fd-section-header"
              onClick={() => toggleSection("rating")}
            >
              <span>Rating</span>
              {openSections.rating ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openSections.rating && (
              <div className="fd-options">
                {RATING_OPTIONS.map((stars) => (
                  <button
                    key={stars}
                    className={`fd-rating-row${selectedRating === stars ? " fd-option--active" : ""}`}
                    onClick={() => setSelectedRating(stars)}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        className={
                          i < stars ? "fd-star fd-star--filled" : "fd-star"
                        }
                      />
                    ))}
                    <span className="fd-rating-label">&amp; Above</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="fd-footer">
          <button className="fd-show-result-btn" onClick={handleShowResult}>
            Show Result
          </button>
        </div>
      </aside>
    </div>
  );
}
