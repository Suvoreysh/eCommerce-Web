import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiHeadphones } from "react-icons/fi";

import CartIcon from "../../assets/icons/Icon-fill/cart.svg";
import Logo from "../../assets/images/logo-small.png";

export default function Navbar() {
  const navigate = useNavigate();

  const goToCart = () => {
    navigate("/cart");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="navbar-wrapper">
      <header className="navbar">
        {/* Logo */}
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={Logo} alt="Logo" />
        </div>

        {/* Desktop Search */}
        <div className="nav-center desktop-only">
          <select>
            <option>All Categories</option>
            <option>Phones</option>
            <option>Laptops</option>
            <option>Accessories</option>
          </select>

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
            className="nav-item"
            onClick={goToProfile}
            style={{ cursor: "pointer" }}
          >
            <FiUser />
            <span>Profile</span>
          </div>

          <div className="nav-item">
            <FiHeadphones />
            <span>Assistance</span>
          </div>
        </div>

        {/* Mobile Cart */}
        <div className="mobile-cart mobile-only">
          <div className="cart" onClick={goToCart} role="button" tabIndex={0}>
            <img src={CartIcon} alt="Cart" />
            <span className="badge">5</span>
          </div>
        </div>
      </header>
    </div>
  );
}
