import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const tabs = [
  {
    key: "pending",
    label: "Pending",
  },
  {
    key: "completed",
    label: "Completed",
  },
  {
    key: "return",
    label: "Return",
  },
];

const orders = [
  {
    id: "123456788",
    total: 1000,
    status: "Shipped",
    tab: "pending",

    items: [
      {
        id: 1,
        name: "Product name",
        value: 500,
        arrival: "04 Dec 26",
        qty: 1,
        image: "",
      },
      {
        id: 2,
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
    tab: "pending",

    items: [
      {
        id: 3,
        name: "Product name",
        value: 1000,
        arrival: "04 Dec 26",
        qty: 1,
        image: "",
      },
    ],
  },

  {
    id: "123455790",
    total: 750,
    status: "Delivered",
    tab: "completed",

    items: [
      {
        id: 4,
        name: "Completed product",
        value: 750,
        arrival: "28 Nov 26",
        qty: 1,
        image: "",
      },
    ],
  },

  {
    id: "123455791",
    total: 450,
    status: "Return Requested",
    tab: "return",

    items: [
      {
        id: 5,
        name: "Returned product",
        value: 450,
        arrival: "25 Nov 26",
        qty: 1,
        image: "",
      },
    ],
  },
];

const sidebarNav = [
  {
    to: "/orders",
    icon: <FiShoppingBag />,
    label: "My Orders",
    active: true,
  },
  {
    to: "/wishlist",
    icon: <FiHeart />,
    label: "Wishlist",
    active: false,
  },
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
  {
    to: "/address",
    icon: <FiMapPin />,
    label: "Address Book",
    active: false,
  },
  {
    to: "/logout",
    icon: <FiLogOut />,
    label: "Logout",
    active: false,
  },
];

export default function MyOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("pending");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => order.tab === activeTab);
  }, [activeTab]);

  const openOrderDetails = (order) => {
    navigate(`/order-details/${order.id}`, {
      state: {
        order,
      },
    });
  };

  return (
    <main className="orders-page">
      <Seo title="My Orders" description="View and manage your orders" />

      {/* ========================================
          MOBILE HEADER
      ======================================== */}

      <header className="orders-header">
        <button
          type="button"
          className="orders-header__btn"
          aria-label="Back to profile"
          onClick={() => navigate("/profile")}
        >
          <IoChevronBack />
        </button>

        <h1>My Order</h1>

        <button
          type="button"
          className="orders-header__btn orders-header__info"
          aria-label="Order information"
        >
          <IoInformationCircleOutline />
        </button>
      </header>

      {/* ========================================
          MOBILE CONTENT
      ======================================== */}

      <div className="orders-mobile-body">
        <div className="orders-tabs">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              className={`orders-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="orders-empty">
              <FiShoppingBag />
              <h2>No orders found</h2>
              <p>There are no orders available in this section.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card__header">
                  <div className="order-card__id">
                    <strong>ID:</strong>
                    <span> #{order.id}</span>
                  </div>

                  <div className="order-card__right">
                    <span>
                      ({order.items.length}{" "}
                      {order.items.length === 1 ? "Item" : "Items"})
                    </span>

                    <strong>${Number(order.total).toFixed(2)}</strong>
                  </div>
                </div>

                <div className="order-divider" />

                <div className="order-products">
                  {order.items.map((item) => (
                    <div className="order-product" key={item.id}>
                      <div className="order-product__image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="image-placeholder" />
                        )}
                      </div>

                      <div className="order-product__content">
                        <h2>{item.name}</h2>

                        <p className="price">
                          Value: ${Number(item.value).toFixed(2)}
                        </p>

                        <p className="arrival">
                          Est Arrival: <strong>{item.arrival}</strong>
                        </p>
                      </div>

                      <span className="order-product__qty">
                        Qty: {item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-card__actions">
                  <button type="button" className="status-btn">
                    {order.status}
                  </button>

                  <button
                    type="button"
                    className="track-btn"
                    onClick={() => openOrderDetails(order)}
                  >
                    Order Details
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* ========================================
          DESKTOP LAYOUT
      ======================================== */}

      <div className="orders-desktop">
        <aside className="od-sidebar">
          <div className="od-avatar">
            {user?.image ? (
              <img src={user.image} alt={user?.name || "Profile"} />
            ) : (
              <div className="od-avatar-placeholder">
                {(user?.name || "J").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h2 className="od-name">{user?.name || "Jhon Rao"}</h2>

          <p className="od-phone">{user?.phone || "+91 6254897524"}</p>

          <nav className="od-nav">
            {sidebarNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`od-nav-item ${
                  item.active ? "od-nav-item--active" : ""
                }`}
              >
                <span className="od-nav-icon">{item.icon}</span>

                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="od-help">
            <FiHeadphones className="od-help-icon" />

            <div>
              <p className="od-help-title">Need Help?</p>

              <p className="od-help-sub">24/7 Customer Support</p>

              <p className="od-help-email">support@shopkart.com</p>
            </div>
          </div>
        </aside>

        <section className="od-main">
          <div className="od-main-header">
            <h1>My Orders</h1>

            <button type="button" className="od-info-btn">
              <IoInformationCircleOutline />
              <span>How orders work?</span>
            </button>
          </div>

          <div className="od-tabs">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                className={`od-tab ${
                  activeTab === tab.key ? "od-tab--active" : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="od-list">
            {filteredOrders.length === 0 ? (
              <div className="od-empty">
                <FiShoppingBag />

                <h2>No orders found</h2>

                <p>There are no orders available in this section.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <article className="od-card" key={order.id}>
                  <div className="od-card__header">
                    <span className="od-card__id">ID: #{order.id}</span>

                    <span className="od-card__meta">
                      ({order.items.length}{" "}
                      {order.items.length === 1 ? "Item" : "Items"})
                    </span>

                    <strong className="od-card__total">
                      ${Number(order.total).toFixed(2)}
                    </strong>
                  </div>

                  <div className="od-card__divider" />

                  <div className="od-products">
                    {order.items.map((item) => (
                      <div className="od-product" key={item.id}>
                        <div className="od-product__img">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className="od-img-placeholder" />
                          )}
                        </div>

                        <div className="od-product__info">
                          <h2>{item.name}</h2>

                          <p>Value: ${Number(item.value).toFixed(2)}</p>

                          <p>
                            Est Arrival: <strong>{item.arrival}</strong>
                          </p>
                        </div>

                        <span className="od-product__qty">Qty: {item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="od-card__actions">
                    <button type="button" className="od-status-btn">
                      {order.status}
                    </button>

                    <button
                      type="button"
                      className="od-track-btn"
                      onClick={() => openOrderDetails(order)}
                    >
                      Order Details
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
