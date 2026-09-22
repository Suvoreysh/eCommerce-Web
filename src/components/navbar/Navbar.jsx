import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiHeadphones } from "react-icons/fi";

import CartIcon from "../../assets/icons/Icon-fill/cart.svg";
import Logo from "../../assets/images/logo-small.png";
import { useCartCount } from "../../context/CartCountContext";
import { useAuth } from "../../context/AuthContext";
import useCatalogSearch from "../../hooks/useCatalogSearch";

const MAX_RESULTS = 8;

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, refreshCartCount } = useCartCount();
  const { user } = useAuth();
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { suggestions } = useCatalogSearch(query, { limit: MAX_RESULTS });

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  // Click anywhere outside closes the dropdown — never a modal on desktop.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToCart = () => {
    navigate("/cart");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const runSearch = () => {
    const value = query.trim();
    if (!value) return;
    setOpen(false);
    navigate(`/category?q=${encodeURIComponent(value)}`);
  };

  const goToProduct = (product) => {
    setOpen(false);
    navigate(`/productdetails/${product.id}`);
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div className="navbar-wrapper">
      <header className="navbar">
        {/* Logo */}
        <div
          className="logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img src={Logo} alt="Logo" />
        </div>

        {/* Desktop Search */}
        <div className="nav-center desktop-only" ref={wrapperRef}>
          <form
            className="search-box"
            onSubmit={(event) => {
              event.preventDefault();
              runSearch();
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search for products..."
              aria-label="Search for products"
            />
            <button type="submit" aria-label="Search">
              <FiSearch />
            </button>
          </form>

          {showDropdown && (
            <div className="search-suggest">
              {suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    className="search-suggest__item"
                    onClick={() => goToProduct(product)}
                  >
                    <FiSearch
                      className="search-suggest__icon"
                      aria-hidden="true"
                    />
                    <span className="search-suggest__text">
                      <span className="search-suggest__name">
                        {product.name}
                      </span>
                      {product.categoryName && (
                        <span className="search-suggest__cat">
                          in {product.categoryName}
                        </span>
                      )}
                    </span>
                  </button>
                ))
              ) : (
                <p className="search-suggest__empty">
                  No matches for &ldquo;{query.trim()}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>

        {/* Desktop Icons */}
        <div className="nav-icons desktop-only">
          <div
            className="nav-item nav-item-profile"
            onClick={goToProfile}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <FiUser />
            <span>{user ? "Profile" : "Login"}</span>
          </div>

          <div className="nav-item">
            <FiHeadphones />
            <span>Assistance</span>
          </div>
        </div>

        {/* Mobile: cart only */}
        <div className="mobile-cart mobile-only">
          <div className="cart" onClick={goToCart} role="button" tabIndex={0}>
            <img src={CartIcon} alt="Cart" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>
        </div>
      </header>
    </div>
  );
}
