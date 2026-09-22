import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import useCatalogSearch from "../../hooks/useCatalogSearch";
import LazyImage from "../common/LazyImage";
import { formatPriceRange } from "../../utils/format";
import "./NavSearchBar.css";

const LISTBOX_ID = "nav-search-results";

/**
 * Always-visible, stuck-in-navbar search input for desktop/web — a live
 * dropdown of matches, not the full-screen modal used on phones.
 */
export default function NavSearchBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { status, trimmed, categoryMatches, suggestions, reload } =
    useCatalogSearch(query, { limit: 6 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToResults = (text = query) => {
    const value = text.trim();
    if (!value) return;
    setOpen(false);
    navigate(`/category?q=${encodeURIComponent(value)}`);
  };

  const goToProduct = (product) => {
    setOpen(false);
    navigate(`/productdetails/${product.id}`);
  };

  const goToCategory = (category) => {
    setOpen(false);
    navigate(`/category/${category.id}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToProduct(suggestions[activeIndex]);
      return;
    }

    goToResults();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!open || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    }
  };

  const showDropdown = open && trimmed.length > 0;

  return (
    <div className="nsb" ref={wrapperRef}>
      <form className="search-box" role="search" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search for products..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `nsb-option-${suggestions[activeIndex]?.id}` : undefined
          }
        />

        <button type="submit" aria-label="Search">
          <FiSearch />
        </button>
      </form>

      {showDropdown && (
        <div className="nsb__dropdown" role="presentation">
          {status === "loading" && (
            <div className="nsb__message">Searching…</div>
          )}

          {status === "error" && (
            <div className="nsb__message">
              Couldn't load results.{" "}
              <button type="button" onClick={reload}>
                Try again
              </button>
            </div>
          )}

          {status === "ready" && (
            <>
              {categoryMatches.length > 0 && (
                <div className="nsb__chips">
                  {categoryMatches.slice(0, 4).map((category) => (
                    <button
                      type="button"
                      key={category.id}
                      className="nsb__chip"
                      onClick={() => goToCategory(category)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}

              {suggestions.length > 0 ? (
                <>
                  <ul className="nsb__list" id={LISTBOX_ID} role="listbox">
                    {suggestions.map((product, index) => (
                      <li key={product.id} role="presentation">
                        <button
                          type="button"
                          id={`nsb-option-${product.id}`}
                          role="option"
                          aria-selected={index === activeIndex}
                          className={`nsb__result ${
                            index === activeIndex ? "nsb__result--active" : ""
                          }`}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => goToProduct(product)}
                        >
                          <LazyImage className="nsb__thumb" src={product.image} alt="" />
                          <span className="nsb__body">
                            <span className="nsb__name">{product.name}</span>
                            <span className="nsb__meta">
                              {[product.categoryName, product.subcategoryName]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </span>
                          <span className="nsb__price">
                            {formatPriceRange(product.priceMin, product.priceMax)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="nsb__view-all"
                    onClick={() => goToResults()}
                  >
                    View all results for “{trimmed}”
                  </button>
                </>
              ) : (
                categoryMatches.length === 0 && (
                  <div className="nsb__message">No matches for “{trimmed}”.</div>
                )
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
