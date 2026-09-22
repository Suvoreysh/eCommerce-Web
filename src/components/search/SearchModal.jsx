import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiClock, FiSearch, FiX } from "react-icons/fi";

import { useSearch } from "../../context/SearchContext";
import useCatalogSearch from "../../hooks/useCatalogSearch";
import { formatPriceRange } from "../../utils/format";
import LazyImage from "../common/LazyImage";
import "./SearchModal.css";

const ANIMATION_MS = 260;
const MAX_SUGGESTIONS = 6;
const MAX_RECENT = 6;
const RECENT_KEY = "spaknit:recent-searches";
const LISTBOX_ID = "search-modal-results";

/* ---------------------------------------------------------------------------
   Recent searches (localStorage — every access guarded, storage can be
   blocked in private mode)
--------------------------------------------------------------------------- */

function readRecent() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string").slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

function writeRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // ignore — recents are a nicety
  }
}

/* ---------------------------------------------------------------------------
   Panel — mounted fresh on every open, so its state always starts clean
--------------------------------------------------------------------------- */

function SearchPanel({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState(readRecent);

  const {
    status: catalogStatus,
    categories,
    trimmed,
    productMatches,
    categoryMatches,
    suggestions,
    reload: fetchCatalog,
  } = useCatalogSearch(query, { limit: MAX_SUGGESTIONS });

  const catalog = { status: catalogStatus, categories };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const rememberQuery = (text) => {
    const value = text.trim();

    if (value.length < 2) return;

    const next = [
      value,
      ...recent.filter((item) => item.toLowerCase() !== value.toLowerCase()),
    ].slice(0, MAX_RECENT);

    setRecent(next);
    writeRecent(next);
  };

  const clearRecent = () => {
    setRecent([]);
    writeRecent([]);
  };

  const goToResults = (text = query) => {
    const value = text.trim();

    if (!value) return;

    rememberQuery(value);
    onClose();
    navigate(`/category?q=${encodeURIComponent(value)}`);
  };

  const goToProduct = (product) => {
    rememberQuery(trimmed);
    onClose();
    navigate(`/productdetails/${product.id}`);
  };

  const goToCategory = (category) => {
    onClose();
    navigate(`/category/${category.id}`);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToProduct(suggestions[activeIndex]);
      return;
    }

    goToResults();
  };

  const handleClear = () => {
    setQuery("");
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const isLoading = catalog.status === "loading";
  const hasError = catalog.status === "error";
  const hasResults = suggestions.length > 0;

  return (
    <div className="sm-panel-inner" onKeyDown={handleKeyDown}>
      <div className="sm-top-bar">
        <button
          type="button"
          className="sm-icon-btn"
          aria-label="Close search"
          onClick={onClose}
        >
          <FiChevronLeft />
        </button>

        <h2 id="search-modal-title">Search</h2>

        <span className="sm-top-spacer" />
      </div>

      <form className="sm-form" onSubmit={handleSubmit} role="search">
        <div className="sm-field">
          <FiSearch className="sm-field__icon" aria-hidden="true" />

          <input
            ref={inputRef}
            type="search"
            className="sm-field__input"
            placeholder="Search products, categories…"
            value={query}
            onChange={handleChange}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            enterKeyHint="search"
            role="combobox"
            aria-label="Search products"
            aria-expanded={hasResults}
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `sm-option-${suggestions[activeIndex]?.id}` : undefined
            }
          />

          {query && (
            <button
              type="button"
              className="sm-field__clear"
              aria-label="Clear search"
              onClick={handleClear}
            >
              <FiX />
            </button>
          )}
        </div>
      </form>

      <div className="sm-body">
        {/* ---------------- Empty query: recents + categories ---------------- */}
        {!trimmed && (
          <>
            {recent.length > 0 && (
              <section className="sm-section">
                <div className="sm-section__head">
                  <h3>Recent searches</h3>
                  <button type="button" onClick={clearRecent}>
                    Clear
                  </button>
                </div>

                <div className="sm-chips">
                  {recent.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className="sm-chip"
                      onClick={() => goToResults(item)}
                    >
                      <FiClock aria-hidden="true" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="sm-section">
              <div className="sm-section__head">
                <h3>Browse categories</h3>
              </div>

              {isLoading && (
                <div className="sm-chips" aria-hidden="true">
                  {[0, 1, 2, 3].map((index) => (
                    <span className="sm-chip sm-chip--skeleton" key={index} />
                  ))}
                </div>
              )}

              {!isLoading && !hasError && catalog.categories.length > 0 && (
                <div className="sm-chips">
                  {catalog.categories.map((category) => (
                    <button
                      type="button"
                      key={category.id}
                      className="sm-chip"
                      onClick={() => goToCategory(category)}
                    >
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {hasError && (
                <p className="sm-message">
                  We couldn't load the catalogue.{" "}
                  <button type="button" onClick={fetchCatalog}>
                    Try again
                  </button>
                </p>
              )}
            </section>
          </>
        )}

        {/* ---------------- Query typed ---------------- */}
        {trimmed && isLoading && (
          <ul className="sm-results" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <li key={index} className="sm-result sm-result--skeleton">
                <span className="lazy-img sm-result__thumb" data-status="loading">
                  <span className="lazy-img__skeleton" />
                </span>
                <span className="sm-result__body">
                  <span className="sm-skeleton-line" />
                  <span className="sm-skeleton-line sm-skeleton-line--short" />
                </span>
              </li>
            ))}
          </ul>
        )}

        {trimmed && hasError && (
          <p className="sm-message">
            We couldn't load the catalogue.{" "}
            <button type="button" onClick={fetchCatalog}>
              Try again
            </button>
          </p>
        )}

        {trimmed && !isLoading && !hasError && (
          <>
            {categoryMatches.length > 0 && (
              <section className="sm-section">
                <div className="sm-section__head">
                  <h3>Categories</h3>
                </div>

                <div className="sm-chips">
                  {categoryMatches.map((category) => (
                    <button
                      type="button"
                      key={category.id}
                      className="sm-chip"
                      onClick={() => goToCategory(category)}
                    >
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {hasResults ? (
              <section className="sm-section">
                <div className="sm-section__head">
                  <h3>Products</h3>
                  <span className="sm-count">
                    {productMatches.length}{" "}
                    {productMatches.length === 1 ? "result" : "results"}
                  </span>
                </div>

                <ul className="sm-results" id={LISTBOX_ID} role="listbox">
                  {suggestions.map((product, index) => (
                    <li key={product.id} role="presentation">
                      <button
                        type="button"
                        id={`sm-option-${product.id}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        className={`sm-result ${
                          index === activeIndex ? "sm-result--active" : ""
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => goToProduct(product)}
                      >
                        <LazyImage
                          className="sm-result__thumb"
                          src={product.image}
                          alt=""
                        />

                        <span className="sm-result__body">
                          <span className="sm-result__name">{product.name}</span>
                          <span className="sm-result__meta">
                            {[product.categoryName, product.subcategoryName]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </span>

                        <span className="sm-result__price">
                          {formatPriceRange(product.priceMin, product.priceMax)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="sm-view-all"
                  onClick={() => goToResults()}
                >
                  View all results for “{trimmed}”
                  <FiArrowRight aria-hidden="true" />
                </button>
              </section>
            ) : (
              categoryMatches.length === 0 && (
                <div className="sm-empty" role="status">
                  <FiSearch aria-hidden="true" />
                  <p className="sm-empty__title">No products found</p>
                  <p className="sm-empty__text">
                    Nothing matched “{trimmed}”. Check the spelling or try a
                    more general word.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Shell — portal, backdrop, open/close animation, scroll lock, focus return
--------------------------------------------------------------------------- */

export default function SearchModal() {
  const { isOpen, closeSearch } = useSearch();
  const location = useLocation();

  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const returnFocusRef = useRef(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      returnFocusRef.current = document.activeElement;
      setMounted(true);
      setClosing(false);
      return undefined;
    }

    // Nothing to animate out until the modal has been opened at least once.
    if (!hasOpenedRef.current) return undefined;

    setClosing(true);

    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
      returnFocusRef.current?.focus?.();
      returnFocusRef.current = null;
    }, ANIMATION_MS);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Browser back / any navigation while open dismisses the modal.
  useEffect(() => {
    closeSearch();
  }, [location.pathname, location.search, closeSearch]);

  useEffect(() => {
    if (!mounted) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`sm-backdrop ${closing ? "sm-backdrop--closing" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeSearch();
      }}
    >
      <div
        className={`sm-panel ${closing ? "sm-panel--closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        <SearchPanel onClose={closeSearch} />
      </div>
    </div>,
    document.body,
  );
}
