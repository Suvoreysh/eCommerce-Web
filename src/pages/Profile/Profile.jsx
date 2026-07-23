import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import {
  FiInfo,
  FiEdit2,
  FiChevronRight,
  FiMail,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";

import Seo from "../../components/common/Seo";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";
import myorderIcon from "../../assets/icons/Icon-fill/myorder.svg";
import wishlistIcon from "../../assets/icons/Icon-fill/wishlist.svg";
import changepassIcon from "../../assets/icons/Icon-fill/changepass.svg";

const TRUST_ITEMS = [
  { icon: "🛡️", title: "Secure Payments", sub: "100% secure payment" },
  { icon: "🔄", title: "Easy Returns", sub: "7-day return policy" },
  { icon: "🎧", title: "24/7 Support", sub: "Dedicated support" },
  { icon: "⭐", title: "Best Quality", sub: "Guaranteed quality" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profileImage, setProfileImage] = useState(
    user?.image || "/images/profile.png",
  );
  const fileInputRef = useRef(null);
  const desktopFileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
    // TODO: upload to backend
  };

  const menuItems = [
    {
      to: "/orders",
      label: "My Order",
      icon: <img src={myorderIcon} alt="My Order" />,
    },
    {
      to: "/wishlist",
      label: "Wishlist",
      icon: <img src={wishlistIcon} alt="Wishlist" />,
    },
    {
      to: "/change-password",
      label: "Change Password",
      icon: <img src={changepassIcon} alt="Change Password" />,
    },
  ];

  const quickActions = [
    {
      to: "/orders",
      icon: <img src={myorderIcon} alt="" />,
      title: "My Orders",
      desc: "View and track your orders",
    },
    {
      to: "/wishlist",
      icon: <img src={wishlistIcon} alt="" />,
      title: "Wishlist",
      desc: "View your saved items",
    },
    {
      to: "/change-password",
      icon: <img src={changepassIcon} alt="" />,
      title: "Change Password",
      desc: "Update your account password",
    },
  ];

  return (
    <main className="profile-page">
      <Seo title="Profile" description="View and manage your profile." />

      {/* ══════ MOBILE HEADER (hidden on desktop) ══════ */}
      <header className="profile-header">
        <button
          className="profile-header__btn"
          onClick={() => navigate("/home")}
          aria-label="Back"
        >
          <IoChevronBack />
        </button>
        <h2>Profile</h2>
        <button className="profile-header__btn" aria-label="Info">
          <FiInfo />
        </button>
      </header>

      {/* ══════ MOBILE HERO (hidden on desktop) ══════ */}
      <section className="profile-hero">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            <img
              src={profileImage}
              alt="Profile"
              onError={(e) => {
                e.currentTarget.src = "/images/profile.png";
              }}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <button
            className="profile-edit-btn"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload Profile"
          >
            <FiEdit2 />
          </button>
        </div>
        <h1>{user?.name || "Jhon Rao"}</h1>
        <p>{user?.phone || "+91 6254897524"}</p>
      </section>

      {/* ══════ MOBILE CARD (hidden on desktop) ══════ */}
      <section className="profile-card">
        <h3>Account Overview</h3>
        {menuItems.map((item) => (
          <Link key={item.to} to={item.to} className="profile-item">
            <div className="profile-item__left">
              <div className="profile-item__icon">{item.icon}</div>
              <span>{item.label}</span>
            </div>
            <FiChevronRight className="profile-item__arrow" />
          </Link>
        ))}
      </section>

      {/* ══════ DESKTOP LAYOUT (hidden on mobile) ══════ */}
      <div className="profile-desktop">
        {/* ── Left sidebar ── */}
        <aside className="pd-sidebar">
          {/* Back button — top left of sidebar */}
          <button
            className="pd-back-btn"
            onClick={() => navigate("/home")}
            aria-label="Back"
          >
            <IoChevronBack />
          </button>

          <div className="pd-avatar-wrap">
            <div className="pd-avatar">
              <img
                src={profileImage}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.src = "/images/profile.png";
                }}
              />
            </div>
            <input
              ref={desktopFileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button
              className="pd-edit-btn"
              onClick={() => desktopFileInputRef.current?.click()}
              aria-label="Upload Profile"
            >
              <FiEdit2 size={15} />
            </button>
          </div>

          <h2 className="pd-name">{user?.name || "Jhon Rao"}</h2>
          <p className="pd-phone">{user?.phone || "+91 6254897524"}</p>

          <div className="pd-divider" />

          <div className="pd-info-row">
            <FiMail className="pd-info-icon" />
            <div>
              <p className="pd-info-label">Email</p>
              <p className="pd-info-value">
                {user?.email || "jhonrao@email.com"}
              </p>
            </div>
          </div>

          <div className="pd-info-row">
            <FiCalendar className="pd-info-icon" />
            <div>
              <p className="pd-info-label">Member Since</p>
              <p className="pd-info-value">
                {user?.memberSince || "May 20, 2024"}
              </p>
            </div>
          </div>

          <button
            className="pd-edit-profile-btn"
            onClick={() => navigate("/edit-profile")}
          >
            <FiUser size={16} />
            Edit Profile
          </button>
        </aside>

        {/* ── Right main panel ── */}
        <div className="pd-main">
          <div className="pd-welcome">
            <h1>My Account</h1>
            <p className="pd-welcome-sub">
              Welcome back, {user?.name || "Jhon Rao"} 👋
            </p>
            <p className="pd-welcome-desc">
              Manage your orders, wishlist and account settings.
            </p>
          </div>

          {/* Quick action cards */}
          <div className="pd-quick-actions">
            {quickActions.map((qa) => (
              <Link key={qa.to} to={qa.to} className="pd-qa-card">
                <div className="pd-qa-icon">{qa.icon}</div>
                <div className="pd-qa-text">
                  <strong>{qa.title}</strong>
                  <span>{qa.desc}</span>
                </div>
                <FiChevronRight className="pd-qa-arrow" />
              </Link>
            ))}
          </div>

          {/* Trust bar */}
          <div className="pd-trust-bar">
            {TRUST_ITEMS.map((t) => (
              <div key={t.title} className="pd-trust-item">
                <span className="pd-trust-icon">{t.icon}</span>
                <div>
                  <p className="pd-trust-title">{t.title}</p>
                  <p className="pd-trust-sub">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
