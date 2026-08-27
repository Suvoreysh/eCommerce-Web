import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
  FiInfo,
  FiEdit2,
  FiChevronRight,
  FiMail,
  FiCalendar,
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiSettings,
  FiMapPin,
  FiLogOut,
  FiHeadphones,
} from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";

import Seo from "../../components/common/Seo";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

import myorderIcon from "../../assets/icons/Icon-fill/myorder.svg";
import wishlistIcon from "../../assets/icons/Icon-fill/wishlist.svg";
import changepassIcon from "../../assets/icons/Icon-fill/changepass.svg";

const TRUST_ITEMS = [
  {
    icon: "🛡️",
    title: "Secure Payments",
    sub: "100% secure payment",
  },
  {
    icon: "🔄",
    title: "Easy Returns",
    sub: "7-day return policy",
  },
  {
    icon: "🎧",
    title: "24/7 Support",
    sub: "Dedicated support",
  },
  {
    icon: "⭐",
    title: "Best Quality",
    sub: "Guaranteed quality",
  },
];

const SIDEBAR_NAV = [
  {
    to: "/orders",
    icon: <FiShoppingBag />,
    label: "My Orders",
  },
  {
    to: "/wishlist",
    icon: <FiHeart />,
    label: "Wishlist",
  },
  {
    to: "/change-password",
    icon: <FiLock />,
    label: "Change Password",
  },
  {
    to: "/settings",
    icon: <FiSettings />,
    label: "Account Settings",
  },
  {
    to: "/address",
    icon: <FiMapPin />,
    label: "Address Book",
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const mobileFileInputRef = useRef(null);
  const desktopFileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    user?.image || "/images/profile.png",
  );

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const temporaryImageUrl = URL.createObjectURL(file);
    setProfileImage(temporaryImageUrl);

    // TODO: Upload the image to your backend.
  };

  const handleImageError = (event) => {
    event.currentTarget.src = "/images/profile.png";
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/home", { replace: true });
  };

  const menuItems = [
    {
      to: "/orders",
      label: "My Order",
      icon: <img src={myorderIcon} alt="" />,
    },
    {
      to: "/wishlist",
      label: "Wishlist",
      icon: <img src={wishlistIcon} alt="" />,
    },
    {
      to: "/change-password",
      label: "Change Password",
      icon: <img src={changepassIcon} alt="" />,
    },
  ];

  const quickActions = [
    {
      to: "/orders",
      icon: <img src={myorderIcon} alt="" />,
      title: "My Orders",
      description: "View and track your orders",
    },
    {
      to: "/wishlist",
      icon: <img src={wishlistIcon} alt="" />,
      title: "Wishlist",
      description: "View your saved items",
    },
    {
      to: "/change-password",
      icon: <img src={changepassIcon} alt="" />,
      title: "Change Password",
      description: "Update your account password",
    },
  ];

  return (
    <main className="profile-page">
      <Seo title="Profile" description="View and manage your profile." />

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header className="profile-header">
        <button
          type="button"
          className="profile-header__btn"
          onClick={handleBackToHome}
          aria-label="Back to home"
        >
          <IoChevronBack />
        </button>

        <h2>Profile</h2>

        <button
          type="button"
          className="profile-header__btn"
          aria-label="Profile information"
        >
          <FiInfo />
        </button>
      </header>

      {/* =====================================================
          MOBILE PROFILE HERO
      ====================================================== */}

      <section className="profile-hero">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            <img
              src={profileImage}
              alt={`${user?.name || "User"} profile`}
              onError={handleImageError}
            />
          </div>

          <input
            ref={mobileFileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          <button
            type="button"
            className="profile-edit-btn"
            onClick={() => mobileFileInputRef.current?.click()}
            aria-label="Change profile image"
          >
            <FiEdit2 />
          </button>
        </div>

        <h1>{user?.name || "Jhon Rao"}</h1>
        <p>{user?.phone || "+91 6254897524"}</p>
      </section>

      {/* =====================================================
          MOBILE ACCOUNT CARD
      ====================================================== */}

      <section className="profile-card">
        <h3>Account Overview</h3>

        <div className="profile-menu">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} className="profile-item">
              <div className="profile-item__left">
                <div className="profile-item__icon">{item.icon}</div>
                <span>{item.label}</span>
              </div>

              <FiChevronRight className="profile-item__arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          DESKTOP LAYOUT
      ====================================================== */}

      <div className="orders-desktop">
        {/* ===================================================
            DESKTOP SIDEBAR
        ==================================================== */}

        <aside className="od-sidebar">
          {/* Avatar wrapper:
              The button must be outside .od-avatar so it can
              overlap the avatar border without being clipped.
          */}

          <div className="od-avatar-wrapper">
            <div className="od-avatar">
              <img
                src={profileImage}
                alt={`${user?.name || "User"} profile`}
                onError={handleImageError}
              />
            </div>

            <input
              ref={desktopFileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            <button
              type="button"
              className="od-avatar-edit-btn"
              onClick={() => desktopFileInputRef.current?.click()}
              aria-label="Change profile image"
            >
              <FiEdit2 />
            </button>
          </div>

          {/* Name and phone are separate from the image wrapper */}

          <div className="od-user-details">
            <h2 className="od-name">{user?.name || "Jhon Rao"}</h2>

            <p className="od-phone">{user?.phone || "+91 6254897524"}</p>
          </div>

          <button
            type="button"
            className="od-edit-profile-btn"
            onClick={() => navigate("/edit-profile")}
          >
            <FiUser />
            <span>Edit Profile</span>
          </button>

          <nav className="od-nav" aria-label="Profile navigation">
            {SIDEBAR_NAV.map((item) => (
              <Link key={item.to} to={item.to} className="od-nav-item">
                <span className="od-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              type="button"
              className="od-nav-item od-nav-logout"
              onClick={handleLogout}
            >
              <span className="od-nav-icon">
                <FiLogOut />
              </span>

              <span>Logout</span>
            </button>
          </nav>

          <div className="od-help">
            <FiHeadphones className="od-help-icon" />

            <div>
              <p className="od-help-title">Need Help?</p>
              <p className="od-help-sub">24/7 Customer Support</p>

              <a href="mailto:support@shopkart.com" className="od-help-email">
                support@shopkart.com
              </a>
            </div>
          </div>
        </aside>

        {/* ===================================================
            DESKTOP MAIN CONTENT
        ==================================================== */}

        <section className="od-main">
          <div className="od-main-header">
            <div className="od-main-title">
              <button
                type="button"
                className="od-desktop-back-btn"
                onClick={handleBackToHome}
                aria-label="Back to home"
              >
                <IoChevronBack />
              </button>

              <h1>My Account</h1>
            </div>

            <button type="button" className="od-info-btn">
              <FiInfo />
              <span>How it works?</span>
            </button>
          </div>

          <div className="pd-welcome">
            <p className="pd-welcome-sub">
              Welcome back, {user?.name || "Jhon Rao"} 👋
            </p>

            <p className="pd-welcome-desc">
              Manage your orders, wishlist and account settings.
            </p>
          </div>

          <div className="pd-info-grid">
            <div className="pd-info-row">
              <div className="pd-info-icon-box">
                <FiMail className="pd-info-icon" />
              </div>

              <div>
                <p className="pd-info-label">Email</p>

                <p className="pd-info-value">
                  {user?.email || "jhonrao@email.com"}
                </p>
              </div>
            </div>

            <div className="pd-info-row">
              <div className="pd-info-icon-box">
                <FiCalendar className="pd-info-icon" />
              </div>

              <div>
                <p className="pd-info-label">Member Since</p>

                <p className="pd-info-value">
                  {user?.memberSince || "May 20, 2024"}
                </p>
              </div>
            </div>
          </div>

          <div className="od-list">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="od-card od-card--link"
              >
                <div className="pd-qa-icon">{action.icon}</div>

                <div className="pd-qa-text">
                  <strong>{action.title}</strong>
                  <span>{action.description}</span>
                </div>

                <FiChevronRight className="pd-qa-arrow" />
              </Link>
            ))}
          </div>

          <div className="pd-trust-bar">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="pd-trust-item">
                <span className="pd-trust-icon">{item.icon}</span>

                <div>
                  <p className="pd-trust-title">{item.title}</p>
                  <p className="pd-trust-sub">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
