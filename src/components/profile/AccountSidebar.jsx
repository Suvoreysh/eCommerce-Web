import { useState } from "react";
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
import LogoutModal from "../common/LogoutModal";
import "./AccountSidebar.css";

const FALLBACK_AVATAR = "/images/profile.png";

const NAV_ITEMS = [
  { to: "/orders",          icon: <FiShoppingBag />, label: "My Orders" },
  { to: "/wishlist",        icon: <FiHeart />,       label: "Wishlist" },
  { to: "/change-password", icon: <FiLock />,        label: "Change Password" },
  { to: "/address",         icon: <FiMapPin />,      label: "Address Book" },
];

export default function AccountSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { refreshCartCount } = useCartCount();
  const [showLogout, setShowLogout] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogout(false);
    logout();
    refreshCartCount();
    navigate("/home", { replace: true });
  };

  // user.image is always a full absolute URL from the API (/profile/image → data.image)
  const showImg = user?.image && !imgError;

  return (
    <>
      <aside className="account-sidebar">
        <div className="account-sidebar-avatar">
          {showImg ? (
            <img
              src={user.image}
              alt={user?.name || "Profile"}
              onError={() => setImgError(true)}
            />
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
              className={`account-sidebar-item${pathname === item.to ? " account-sidebar-item--active" : ""}`}
            >
              <span className="account-sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            type="button"
            className="account-sidebar-item account-sidebar-logout"
            onClick={() => setShowLogout(true)}
          >
            <span className="account-sidebar-icon"><FiLogOut /></span>
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

      <LogoutModal
        open={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
