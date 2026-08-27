import { useEffect } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiLock, FiHeadphones } from "react-icons/fi";

import CartIcon from "../../assets/icons/Icon-fill/cart.svg";
import Logo from "../../assets/images/logo-small.png";
import { useCartCount } from "../../context/CartCountContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, refreshCartCount } = useCartCount();
  const { user } = useAuth();

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  const goToCart = () => {
    navigate("/cart");
  };

  const goToProfile = () => {
    const returnTo = encodeURIComponent(window.location.pathname);
    navigate(user ? "/profile" : `/login?returnTo=${returnTo}`);
  };

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
        <div className="nav-center desktop-only">
          {/* <select>
            <option>All Categories</option>
            <option>Phones</option>
            <option>Laptops</option>
            <option>Accessories</option>
          </select> */}

          <div className="search-box">
            <input type="text" placeholder="Search for products..." />
            <button type="button">
              <FiSearch />
            </button>
          </div>
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
            {user ? <FiUser /> : <FiUser />}
            <span>{user ? "Profile" : "Login"}</span>
          </div>

          <div className="nav-item">
            <FiHeadphones />
            <span>Assistance</span>
          </div>
        </div>

        {/* Mobile: profile + cart */}
        <div className="mobile-cart mobile-only">
          {/* <div
            className="mobile-profile"
            onClick={goToProfile}
            role="button"
            tabIndex={0}
          >
            {user ? <FiLock /> : <FiUser />}
          </div> */}

          <div className="cart" onClick={goToCart} role="button" tabIndex={0}>
            <img src={CartIcon} alt="Cart" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>
        </div>
      </header>
    </div>
  );
}
