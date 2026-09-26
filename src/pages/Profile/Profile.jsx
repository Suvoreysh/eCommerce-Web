import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
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
  FiMapPin,
  FiLogOut,
  FiHeadphones,
  FiX,
  FiCamera,
  FiLoader,
} from "react-icons/fi";

import Seo from "../../components/common/Seo";
import BackHomeButton from "../../components/profile/BackHomeButton";
import { useAuth } from "../../context/AuthContext";
import { useCartCount } from "../../context/CartCountContext";
import { BASE_URL } from "../../api/config";
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

const SIDEBAR_NAV = [
  { to: "/orders",          icon: <FiShoppingBag />, label: "My Orders" },
  { to: "/wishlist",        icon: <FiHeart />,       label: "Wishlist" },
  { to: "/change-password", icon: <FiLock />,        label: "Change Password" },
  { to: "/address",         icon: <FiMapPin />,      label: "Address Book" },
];

const FALLBACK_IMAGE = "/images/profile.png";

/**
 * Upload profile image.
 * POST /profile/image  multipart/form-data { image: File }
 */
async function uploadProfileImage(file) {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");

  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${BASE_URL}/profile/image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type — browser sets it with the correct boundary
    },
    body: form,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON body on error
  }

  if (!res.ok) {
    const msg =
      json?.message || json?.error || `Upload failed (${res.status})`;
    throw new Error(msg);
  }

  return json;
}

export default function Profile() {
  const navigate   = useNavigate();
  const { pathname } = useLocation();
  const { user, logout, fetchProfile } = useAuth();
  const { refreshCartCount } = useCartCount();

  const mobileFileInputRef  = useRef(null);
  const desktopFileInputRef = useRef(null);

  // Local optimistic preview while the upload is in-flight
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState("");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Derive the displayed avatar: optimistic preview > API image > fallback
  const displayImage =
    previewImage || user?.image || FALLBACK_IMAGE;

  // Clear optimistic preview once the API-refreshed image arrives
  useEffect(() => {
    if (previewImage && user?.image) {
      // Give the browser a tick to load the new URL, then drop the blob URL
      const timer = setTimeout(() => {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user?.image, previewImage]);

  // Lock body scroll while logout modal is open
  useEffect(() => {
    document.body.style.overflow = showLogoutModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLogoutModal]);

  // Escape key closes logout modal
  useEffect(() => {
    if (!showLogoutModal) return;
    const handler = (e) => { if (e.key === "Escape") setShowLogoutModal(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showLogoutModal]);

  /*
   * ─── IMAGE UPLOAD ────────────────────────────────────────────────────────────
   * 1. Show an instant blob preview (optimistic UI)
   * 2. POST multipart to /profile/image
   * 3. Call fetchProfile() to pull the canonical URL from /me
   * 4. On error, revert to the previous image and show a message
   */
  const handleImageChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      // Reset the input so the same file can be re-selected after an error
      event.target.value = "";

      if (!file) return;
      if (!user) return; // guard: should never happen since route is protected

      setUploadError("");

      // Validate: only images, max 5 MB
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image must be smaller than 5 MB.");
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      setPreviewImage(blobUrl);
      setUploading(true);

      try {
        await uploadProfileImage(file);
        // Pull the canonical URL from /me so user.image is always in sync
        await fetchProfile();
      } catch (err) {
        console.error("Profile image upload failed:", err);
        setUploadError(err.message || "Upload failed. Please try again.");
        // Revert the optimistic preview
        URL.revokeObjectURL(blobUrl);
        setPreviewImage(null);
      } finally {
        setUploading(false);
      }
    },
    [user, fetchProfile],
  );

  const handleImageError = (e) => {
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  // ─── LOGOUT ──────────────────────────────────────────────────────────────────
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    refreshCartCount();
    navigate("/home", { replace: true });
  };

  // ─── MOBILE MENU ITEMS ───────────────────────────────────────────────────────
  const menuItems = [
    { to: "/orders",          label: "My Order",         icon: <img src={myorderIcon} alt="" /> },
    { to: "/wishlist",        label: "Wishlist",         icon: <img src={wishlistIcon} alt="" /> },
    { to: "/change-password", label: "Change Password",  icon: <img src={changepassIcon} alt="" /> },
  ];

  const quickActions = [
    { to: "/orders",          icon: <img src={myorderIcon} alt="" />,    title: "My Orders",       description: "View and track your orders" },
    { to: "/wishlist",        icon: <img src={wishlistIcon} alt="" />,   title: "Wishlist",        description: "View your saved items" },
    { to: "/change-password", icon: <img src={changepassIcon} alt="" />, title: "Change Password", description: "Update your account password" },
  ];

  // ─── SHARED AVATAR BUTTON ────────────────────────────────────────────────────
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

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}
      <header className="profile-header">
        <BackHomeButton className="profile-header__btn" />
        <h2>Profile</h2>
        <button type="button" className="profile-header__btn" aria-label="Profile information">
          <FiInfo />
        </button>
      </header>

      {/* =====================================================
          MOBILE PROFILE HERO
      ====================================================== */}
      <section className="profile-hero">
        <AvatarUploadButton
          inputRef={mobileFileInputRef}
          wrapperClass="profile-avatar-wrapper"
          avatarClass="profile-avatar"
          editBtnClass="profile-edit-btn"
        />

        {uploadError && (
          <p className="profile-upload-error" role="alert">
            {uploadError}
          </p>
        )}

        <h1>{user?.name || "Guest"}</h1>
        <p>{user?.phone || ""}</p>
      </section>

      {/* =====================================================
          MOBILE ACCOUNT CARD
      ====================================================== */}
      <section className="profile-card">
        {/* <h3>Account Overview</h3> */}

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
              <div className="profile-item__icon profile-logout-icon">
                <FiLogOut />
              </div>
              <span>Logout</span>
            </div>
            <FiChevronRight className="profile-item__arrow" />
          </button>
        </div>
      </section>

      {/* =====================================================
          DESKTOP LAYOUT
      ====================================================== */}
      <div className="orders-desktop">
        {/* ─── SIDEBAR ─── */}
        <aside className="od-sidebar">
          <AvatarUploadButton
            inputRef={desktopFileInputRef}
            wrapperClass="od-avatar-wrapper"
            avatarClass="od-avatar"
            editBtnClass="od-avatar-edit-btn"
          />

          {uploadError && (
            <p
              className="profile-upload-error"
              role="alert"
              style={{ textAlign: "center", margin: "8px 0" }}
            >
              {uploadError}
            </p>
          )}

          <div className="od-user-details">
            <h2 className="od-name">{user?.name || "Guest"}</h2>
            <p className="od-phone">{user?.phone || ""}</p>
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
              <a href="mailto:support@shopkart.com" className="od-help-email">
                support@shopkart.com
              </a>
            </div>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
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
            <p className="pd-welcome-sub">
              Welcome back, {user?.name || "there"} 👋
            </p>
            <p className="pd-welcome-desc">
              Manage your orders, wishlist and account settings.
            </p>
          </div>

          <div className="pd-info-grid">
            {user?.email && (
              <div className="pd-info-row">
                <div className="pd-info-icon-box">
                  <FiMail className="pd-info-icon" />
                </div>
                <div>
                  <p className="pd-info-label">Email</p>
                  <p className="pd-info-value">{user.email}</p>
                </div>
              </div>
            )}

            {user?.memberSince && (
              <div className="pd-info-row">
                <div className="pd-info-icon-box">
                  <FiCalendar className="pd-info-icon" />
                </div>
                <div>
                  <p className="pd-info-label">Member Since</p>
                  <p className="pd-info-value">{user.memberSince}</p>
                </div>
              </div>
            )}
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

      {/* =====================================================
          LOGOUT MODAL
      ====================================================== */}
      {showLogoutModal && (
        <div
          className="logout-modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="logout-modal-close"
              onClick={() => setShowLogoutModal(false)}
              aria-label="Close"
            >
              <FiX />
            </button>

            <div className="logout-modal-icon">
              <FiLogOut />
            </div>

            <div className="logout-modal-content">
              <h2 id="logout-modal-title">Are you sure?</h2>
              <p>Are you sure you want to logout from your account?</p>
            </div>

            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-confirm-btn"
                onClick={handleConfirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
