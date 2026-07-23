import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoChevronBack, IoInformationCircleOutline } from "react-icons/io5";
import {
  FiShoppingBag,
  FiHeart,
  FiLock,
  FiSettings,
  FiMapPin,
  FiLogOut,
  FiHeadphones,
} from "react-icons/fi";

import Seo from "../../components/common/Seo";
import { useAuth } from "../../context/AuthContext";
import "./MyOrders.css";
// import profilePlaceholder from "/images/profile.png";

const tabs = [
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "return", label: "Return" },
];

const orders = [
  {
    id: "123456788",
    total: 1000,
    status: "Shipped",
    items: [
      {
        name: "Product name",
        value: 500,
        arrival: "04 Dec 26",
        qty: 1,
        image: "",
      },
      {
        name: "Product name",
        value: 500,
        arrival: "04 Dec 26",
        qty: 1,
        image: "",
      },
    ],
  },
  {
    id: "123455789",
    total: 1000,
    status: "Shipped",
    items: [
      {
        name: "Product name",
        value: 1000,
        arrival: "04 Dec 26",
        qty: 1,
        image: "",
      },
    ],
  },
];

const sidebarNav = [
  { to: "/orders", icon: <FiShoppingBag />, label: "My Orders", active: true },
  { to: "/wishlist", icon: <FiHeart />, label: "Wishlist", active: false },
  {
    to: "/change-password",
    icon: <FiLock />,
    label: "Change Password",
    active: false,
  },
  {
    to: "/settings",
    icon: <FiSettings />,
    label: "Account Settings",
    active: false,
  },
  { to: "/address", icon: <FiMapPin />, label: "Address Book", active: false },
  { to: "/logout", icon: <FiLogOut />, label: "Logout", active: false },
];

export default function MyOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <main className="orders-page">
      <Seo title="My Orders" description="My Orders" />

      {/* ══════ MOBILE HEADER (hidden on desktop) ══════ */}
      <header className="orders-header">
        <button
          className="orders-header__btn"
          onClick={() => navigate("/profile")}
        >
          <IoChevronBack />
        </button>
        <h2>My Order</h2>
        <button className="orders-header__btn">
          <IoInformationCircleOutline />
        </button>
      </header>

      {/* ══════ MOBILE CONTENT ══════ */}
      <div className="orders-mobile-body">
        <div className="orders-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={
                activeTab === tab.key ? "orders-tab active" : "orders-tab"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="orders-list">
          {orders.map((order, index) => (
            <div className="order-card" key={index}>
              <div className="order-card__header">
                <div>
                  <strong>ID:</strong> <span>#{order.id}</span>
                </div>
                <div className="order-card__right">
                  <span>({order.items.length} Items)</span>
                  <strong>${order.total.toFixed(2)}</strong>
                </div>
              </div>
              <div className="order-divider" />
              {order.items.map((item, i) => (
                <div className="order-product" key={i}>
                  <div className="order-product__image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="image-placeholder" />
                    )}
                  </div>
                  <div className="order-product__content">
                    <h3>{item.name}</h3>
                    <p className="price">Value: ${item.value.toFixed(2)}</p>
                    <p className="arrival">
                      Est Arrival: <strong>{item.arrival}</strong>
                    </p>
                  </div>
                  <div className="order-product__qty">Qty: {item.qty}</div>
                </div>
              ))}
              <div className="order-card__actions">
                <button className="status-btn">{order.status}</button>
                <button className="track-btn">Order Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════ DESKTOP LAYOUT (hidden on mobile) ══════ */}
      <div className="orders-desktop">
        {/* ── Left sidebar ── */}
        <aside className="od-sidebar">
          {/* Avatar */}
          <div className="od-avatar">
            {/* <img
              src={user?.image || profilePlaceholder}
              alt="Profile"
              onError={(e) => {
                e.currentTarget.src = "/images/profile.png";
              }}
            /> */}
          </div>
          <h2 className="od-name">{user?.name || "Jhon Rao"}</h2>
          <p className="od-phone">{user?.phone || "+91 6254897524"}</p>

          {/* Nav */}
          <nav className="od-nav">
            {sidebarNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`od-nav-item${item.active ? " od-nav-item--active" : ""}`}
              >
                <span className="od-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Help box */}
          <div className="od-help">
            <FiHeadphones className="od-help-icon" />
            <div>
              <p className="od-help-title">Need Help?</p>
              <p className="od-help-sub">24/7 Customer Support</p>
              <p className="od-help-email">support@shopkart.com</p>
            </div>
          </div>
        </aside>

        {/* ── Right content panel ── */}
        <div className="od-main">
          {/* Panel header */}
          <div className="od-main-header">
            <h1>My Orders</h1>
            <button className="od-info-btn">
              <IoInformationCircleOutline />
              How orders work?
            </button>
          </div>

          {/* Tabs */}
          <div className="od-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={
                  activeTab === tab.key ? "od-tab od-tab--active" : "od-tab"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Order cards */}
          <div className="od-list">
            {orders.map((order, index) => (
              <div className="od-card" key={index}>
                <div className="od-card__header">
                  <span className="od-card__id">ID: #{order.id}</span>
                  <span className="od-card__meta">
                    ({order.items.length}{" "}
                    {order.items.length === 1 ? "Item" : "Items"})
                  </span>
                  <strong className="od-card__total">
                    ${order.total.toFixed(2)}
                  </strong>
                </div>
                <div className="od-card__divider" />
                {order.items.map((item, i) => (
                  <div className="od-product" key={i}>
                    <div className="od-product__img">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="od-img-placeholder" />
                      )}
                    </div>
                    <div className="od-product__info">
                      <h3>{item.name}</h3>
                      <p>Value: ${item.value.toFixed(2)}</p>
                      <p>
                        Est Arrival: <strong>{item.arrival}</strong>
                      </p>
                    </div>
                    <span className="od-product__qty">Qty: {item.qty}</span>
                  </div>
                ))}
                <div className="od-card__actions">
                  <button className="od-status-btn">{order.status}</button>
                  <button className="od-track-btn">Order Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
