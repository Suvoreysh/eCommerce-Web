import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiMapPin,
  FiLogOut,
  FiHeadphones,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCartCount } from "../../context/CartCountContext";
import "./AccountSidebar.css";

// Account Settings intentionally excluded — there's no page behind it yet.
const NAV_ITEMS = [
  { to: "/orders", icon: <FiShoppingBag />, label: "My Orders" },
  { to: "/wishlist", icon: <FiHeart />, label: "Wishlist" },
  { to: "/change-password", icon: <FiLock />, label: "Change Password" },
  { to: "/address", icon: <FiMapPin />, label: "Address Book" },
];

/**
 * Read-only account sidebar shared by every account-area page. Profile.jsx
 * keeps its own richer sidebar (it needs the avatar-edit affordance); every
 * other account page renders this instead so the nav list, active state,
 * and logout behavior never drift out of sync.
 */
export default function AccountSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { refreshCartCount } = useCartCount();

  const handleLogout = () => {
    logout();
    refreshCartCount();
    navigate("/home", { replace: true });
  };

  return (
    <aside className="account-sidebar">
      <div className="account-sidebar-avatar">
        {user?.image ? (
          <img src={user.image} alt={user?.name || "Profile"} />
        ) : (
          <span className="account-sidebar-avatar-placeholder">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <h2 className="account-sidebar-name">{user?.name || "Guest"}</h2>
      <p className="account-sidebar-phone">{user?.phone || ""}</p>

      <nav className="account-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`account-sidebar-item${
              pathname === item.to ? " account-sidebar-item--active" : ""
            }`}
          >
            <span className="account-sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        <button
          type="button"
          className="account-sidebar-item account-sidebar-logout"
          onClick={handleLogout}
        >
          <span className="account-sidebar-icon">
            <FiLogOut />
          </span>
          <span>Logout</span>
        </button>
      </nav>

      <div className="account-sidebar-help">
        <FiHeadphones className="account-sidebar-help-icon" />
        <div>
          <p className="account-sidebar-help-title">Need Help?</p>
          <p className="account-sidebar-help-sub">24/7 Customer Support</p>
          <p className="account-sidebar-help-email">support@shopkart.com</p>
        </div>
      </div>
    </aside>
  );
}
