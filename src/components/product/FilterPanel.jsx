import { useState } from "react";
import Button from "../common/Button";
import "./FilterPanel.css";

const sortOptions = ["Popular", "New Collection", "Price: High to Low", "Price: Low to High"];
const priceRanges = ["Under ₹1,000", "₹1,000 - 3,000", "Above ₹5,000"];
const ratings = [4, 3, 2];

export default function FilterPanel({ open, onClose, onApply }) {
  const [sort, setSort] = useState("Popular");
  const [price, setPrice] = useState(null);
  const [rating, setRating] = useState(null);

  if (!open) return null;

  const clearAll = () => {
    setSort("Popular");
    setPrice(null);
    setRating(null);
  };

  return (
    <div className="filter-overlay" role="dialog" aria-label="Product filters">
      <div className="filter-panel">
        <div className="filter-panel__header">
          <h2>Filters</h2>
          <button onClick={onClose} aria-label="Close filters">
            ✕
          </button>
        </div>

        <div className="filter-panel__topbar">
          <span>⚙ Filters</span>
          <button className="filter-clear" onClick={clearAll}>
            Clear All
          </button>
        </div>

        <fieldset className="filter-group">
          <legend>Sort By</legend>
          {sortOptions.map((opt) => (
            <button
              key={opt}
              className={`filter-option ${sort === opt ? "filter-option--active" : ""}`}
              onClick={() => setSort(opt)}
            >
              {opt}
            </button>
          ))}
        </fieldset>

        <fieldset className="filter-group">
          <legend>Price Range</legend>
          {priceRanges.map((opt) => (
            <button
              key={opt}
              className={`filter-option ${price === opt ? "filter-option--active" : ""}`}
              onClick={() => setPrice(opt)}
            >
              {opt}
            </button>
          ))}
        </fieldset>

        <fieldset className="filter-group">
          <legend>Rating</legend>
          {ratings.map((r) => (
            <button key={r} className={`filter-option ${rating === r ? "filter-option--active" : ""}`} onClick={() => setRating(r)}>
              {"★".repeat(r)}
              {"☆".repeat(5 - r)} &amp; Above
            </button>
          ))}
        </fieldset>

        <Button fullWidth onClick={() => onApply?.({ sort, price, rating })}>
          Show Result
        </Button>
      </div>
    </div>
  );
}
