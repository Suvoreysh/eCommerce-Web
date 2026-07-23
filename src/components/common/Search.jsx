import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

const backIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const searchIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M20 20l-3.5-3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const clearIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="#fff"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const historyIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 12a9 9 0 1 0 3-6.7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M3 4v5h5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7v5l3 3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const cartIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.2a2 2 0 0 0 2-1.6L20.5 8H6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="21" r="1.4" fill="currentColor" />
    <circle cx="17" cy="21" r="1.4" fill="currentColor" />
  </svg>
);

const recentSearches = [
  { id: 1, label: "Products" },
  { id: 2, label: "Products" },
  { id: 3, label: "Products" },
  { id: 4, label: "Products" },
];

const productImg =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop";

const products = [
  {
    id: 1,
    name: 'MacBook Air 13" and 15"',
    chip: "M5 chip",
    tagline: "Thin. Fast. Powerful and portable.",
    price: "7,29,900",
    sale: true,
    image: productImg,
  },
  {
    id: 2,
    name: 'MacBook Air 13" and 15"',
    chip: "M5 chip",
    tagline: "Thin. Fast. Powerful and portable.",
    price: "7,29,900",
    sale: true,
    image: productImg,
  },
  {
    id: 3,
    name: 'MacBook Air 13" and 15"',
    chip: "M5 chip",
    tagline: "Thin. Fast. Powerful and portable.",
    price: "7,29,900",
    sale: true,
    image: productImg,
  },
];

export default function Search({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const openDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleChipClick = (label) => {
    setQuery(label);
    closeDropdown();
  };

  return (
    <div className="search-page">
      <div className="search-top-bar">
        <button
          className="search-icon-btn"
          aria-label="Go back"
          onClick={handleBack}
        >
          {backIcon}
        </button>
        <h1>Search</h1>
        <span className="search-top-spacer" />
      </div>

      <div className="search-bar-wrap">
        <div className={`search-bar ${dropdownOpen ? "focused" : ""}`}>
          <span className="search-bar-icon">{searchIcon}</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search, Order, Enjoy, Repeat!"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={openDropdown}
          />
          <button
            className="search-clear-btn"
            aria-label="Clear search"
            onClick={handleClear}
          >
            {clearIcon}
          </button>
        </div>

        {dropdownOpen && (
          <>
            <button
              className="search-backdrop"
              aria-label="Close search suggestions"
              onClick={closeDropdown}
            />
            <div className="search-dropdown">
              <div className="search-dropdown-label-row">
                <span className="search-dropdown-label">
                  Recently Searched Products
                </span>
                <span className="search-dropdown-rule" />
              </div>
              <div className="search-chip-grid">
                {recentSearches.map((item) => (
                  <button
                    key={item.id}
                    className="search-chip"
                    onClick={() => handleChipClick(item.label)}
                  >
                    <span className="search-chip-icon">{historyIcon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* <div className="search-results">
        <div className="search-section-head">
          <h2>MacBook Air 13&quot; and 15&quot;</h2>
          <a href="#" className="search-see-more">
            See More <span>↔</span>
          </a>
        </div>

        <div className="search-product-row">
          {products.map((p) => (
            <div className="search-product-card" key={p.id}>
              {p.sale && <span className="search-sale-badge">sale</span>}
              <button className="search-wish-btn" aria-label="Save for later">
                ♡
              </button>

              <div className="search-product-thumb">
                <img src={p.image} alt={p.name} />
              </div>

              <p className="search-product-price">
                Price: <b>₹{p.price}</b>
              </p>
              <p className="search-product-name">{p.name}</p>
              <p className="search-product-chip">{p.chip}</p>
              <p className="search-product-tagline">{p.tagline}</p>

              <div className="search-product-actions">
                <button className="search-view-btn">View More</button>
                <button className="search-cart-btn" aria-label="Add to cart">
                  {cartIcon}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
