import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  FiInfo,
  FiChevronRight,
  FiMail,
  FiCalendar,
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiMapPin,
  FiLogOut,
  FiHeadphones,
  FiCamera,
} from "react-icons/fi";

import Seo from "../../components/common/Seo";
import BackHomeButton from "../../components/profile/BackHomeButton";
import LogoutModal from "../../components/common/LogoutModal";
import { useAuth } from "../../context/AuthContext";
import { useCartCount } from "../../context/CartCountContext";
import { BASE_URL } from "../../api/config";
import "./Profile.css";

import myorderIcon   from "../../assets/icons/Icon-fill/myorder.svg";
import wishlistIcon  from "../../assets/icons/Icon-fill/wishlist.svg";
import changepassIcon from "../../assets/icons/Icon-fill/changepass.svg";

const TRUST_ITEMS = [
  { icon: "🛡️", title: "Secure Payments", sub: "100% secure payment" },
  { icon: "🔄", title: "Easy Returns",    sub: "7-day return policy" },
  { icon: "🎧", title: "24/7 Support",    sub: "Dedicated support" },
  { icon: "⭐", title: "Best Quality",    sub: "Guaranteed quality" },
];

const SIDEBAR_NAV = [
  { to: "/orders",          icon: <FiShoppingBag />, label: "My Orders" },
  { to: "/wishlist",        icon: <FiHeart />,       label: "Wishlist" },
  { to: "/change-password", icon: <FiLock />,        label: "Change Password" },
  { to: "/address",         icon: <FiMapPin />,      label: "Address Book" },
];

const FALLBACK_IMAGE = "/images/profile.png";

async function uploadProfileImage(file) {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${BASE_URL}/profile/image`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: form,
  });
  let json = null;
  try { json = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) throw new Error(json?.message || json?.error || `Upload failed (${res.status})`);
  return json;
}

export default function Profile() {
  const navigate      = useNavigate();
  const { pathname }  = useLocation();
  const { user, logout, fetchProfile } = useAuth();
  const { refreshCartCount } = useCartCount();

  const mobileFileInputRef  = useRef(null);
  const desktopFileInputRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Derive avatar: optimistic preview → API image → fallback
  const displayImage = previewImage || user?.image || FALLBACK_IMAGE;

  // Drop blob URL once real image arrives
  useEffect(() => {
    if (previewImage && user?.image) {
      const timer = setTimeout(() => {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user?.image, previewImage]);

  const handleImageChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !user) return;
      setUploadError("");
      if (!file.type.startsWith("image/")) { setUploadError("Please select an image file."); return; }
      if (file.size > 5 * 1024 * 1024)    { setUploadError("Image must be smaller than 5 MB."); return; }

      const blobUrl = URL.createObjectURL(file);
      setPreviewImage(blobUrl);
      setUploading(true);
      try {
        await uploadProfileImage(file);
        await fetchProfile(); // re-fetches /me + /profile/image to get canonical URL
      } catch (err) {
        console.error("Profile image upload failed:", err);
        setUploadError(err.message || "Upload failed. Please try again.");
        URL.revokeObjectURL(blobUrl);
        setPreviewImage(null);
      } finally {
        setUploading(false);
      }
    },
    [user, fetchProfile],
  );

  const handleImageError = (e) => { e.currentTarget.src = FALLBACK_IMAGE; };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    refreshCartCount();
    navigate("/home", { replace: true });
  };

  const menuItems = [
    { to: "/orders",          label: "My Order",        icon: <img src={myorderIcon}    alt="" /> },
    { to: "/wishlist",        label: "Wishlist",        icon: <img src={wishlistIcon}   alt="" /> },
    { to: "/change-password", label: "Change Password", icon: <img src={changepassIcon} alt="" /> },
  ];

  const quickActions = [
    { to: "/orders",          icon: <img src={myorderIcon}    alt="" />, title: "My Orders",       description: "View and track your orders" },
    { to: "/wishlist",        icon: <img src={wishlistIcon}   alt="" />, title: "Wishlist",        description: "View your saved items" },
    { to: "/change-password", icon: <img src={changepassIcon} alt="" />, title: "Change Password", description: "Update your account password" },
  ];

  const AvatarUploadButton = ({ inputRef, wrapperClass, avatarClass, editBtnClass }) => (
    <div className={wrapperClass}>
      <div className={avatarClass}>
        <img
          src={displayImage}
          alt={`${user?.name || "User"} profile`}
          onError={handleImageError}
          style={{ opacity: uploading ? 0.6 : 1, transition: "opacity 0.2s" }}
        />
        {uploading && (
          <div className="profile-upload-overlay" aria-label="Uploading…">
            <div className="profile-upload-spinner" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={handleImageChange}
        disabled={uploading}
      />

      <button
        type="button"
        className={editBtnClass}
        onClick={() => inputRef.current?.click()}
        aria-label="Change profile image"
        disabled={uploading}
        title={uploading ? "Uploading…" : "Change photo"}
      >
        {uploading ? <div className="profile-spinner-sm" /> : <FiCamera />}
      </button>
    </div>
  );

  return (
    <main className="profile-page">
      <Seo title="Profile" description="View and manage your profile." />

      {/* MOBILE HEADER */}
      <header className="profile-header">
        <BackHomeButton className="profile-header__btn" />
        <h2>Profile</h2>
        <button type="button" className="profile-header__btn" aria-label="Profile information">
          <FiInfo />
        </button>
      </header>

      {/* MOBILE PROFILE HERO */}
      <section className="profile-hero">
        <AvatarUploadButton
          inputRef={mobileFileInputRef}
          wrapperClass="profile-avatar-wrapper"
          avatarClass="profile-avatar"
          editBtnClass="profile-edit-btn"
        />
        {uploadError && <p className="profile-upload-error" role="alert">{uploadError}</p>}
        <h1>{user?.name || "Guest"}</h1>
        <p>{user?.phone || ""}</p>
      </section>

      {/* MOBILE ACCOUNT CARD */}
      <section className="profile-card">
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

          <button
            type="button"
            className="profile-item profile-logout-item"
            onClick={() => setShowLogoutModal(true)}
          >
            <div className="profile-item__left">
              <div className="profile-item__icon profile-logout-icon"><FiLogOut /></div>
              <span>Logout</span>
            </div>
            <FiChevronRight className="profile-item__arrow" />
          </button>
        </div>
      </section>

      {/* DESKTOP LAYOUT */}
      <div className="orders-desktop">
        {/* SIDEBAR */}
        <aside className="od-sidebar">
          <AvatarUploadButton
            inputRef={desktopFileInputRef}
            wrapperClass="od-avatar-wrapper"
            avatarClass="od-avatar"
            editBtnClass="od-avatar-edit-btn"
          />

          {uploadError && (
            <p className="profile-upload-error" role="alert" style={{ textAlign: "center", margin: "8px 0" }}>
              {uploadError}
            </p>
          )}

          <div className="od-user-details">
            <h2 className="od-name">{user?.name || "Guest"}</h2>
            <p className="od-phone">{user?.phone || ""}</p>
          </div>

          <button type="button" className="od-edit-profile-btn" onClick={() => navigate("/edit-profile")}>
            <FiUser />
            <span>Edit Profile</span>
          </button>

          <nav className="od-nav" aria-label="Profile navigation">
            {SIDEBAR_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`od-nav-item${pathname === item.to ? " od-nav-item--active" : ""}`}
              >
                <span className="od-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              type="button"
              className="od-nav-item od-nav-logout"
              onClick={() => setShowLogoutModal(true)}
            >
              <span className="od-nav-icon"><FiLogOut /></span>
              <span>Logout</span>
            </button>
          </nav>

          <div className="od-help">
            <FiHeadphones className="od-help-icon" />
            <div>
              <p className="od-help-title">Need Help?</p>
              <p className="od-help-sub">24/7 Customer Support</p>
              <a href="mailto:support@shopkart.com" className="od-help-email">support@shopkart.com</a>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="od-main">
          <div className="od-main-header">
            <div className="od-main-title">
              <BackHomeButton className="od-desktop-back-btn" />
              <h1>My Account</h1>
            </div>
            <button type="button" className="od-info-btn">
              <FiInfo />
              <span>How it works?</span>
            </button>
          </div>

          <div className="pd-welcome">
            <p className="pd-welcome-sub">Welcome back, {user?.name || "there"} 👋</p>
            <p className="pd-welcome-desc">Manage your orders, wishlist and account settings.</p>
          </div>

          <div className="pd-info-grid">
            {user?.email && (
              <div className="pd-info-row">
                <div className="pd-info-icon-box"><FiMail className="pd-info-icon" /></div>
                <div>
                  <p className="pd-info-label">Email</p>
                  <p className="pd-info-value">{user.email}</p>
                </div>
              </div>
            )}
            {user?.memberSince && (
              <div className="pd-info-row">
                <div className="pd-info-icon-box"><FiCalendar className="pd-info-icon" /></div>
                <div>
                  <p className="pd-info-label">Member Since</p>
                  <p className="pd-info-value">{user.memberSince}</p>
                </div>
              </div>
            )}
          </div>

          <div className="od-list">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to} className="od-card od-card--link">
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

      {/* LOGOUT MODAL */}
      <LogoutModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </main>
  );
}
