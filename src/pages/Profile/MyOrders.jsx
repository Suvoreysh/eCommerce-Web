import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoInformationCircleOutline } from "react-icons/io5";

import Seo from "../../components/common/Seo";
import AccountSidebar from "../../components/profile/AccountSidebar";
import BackHomeButton from "../../components/profile/BackHomeButton";

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

export default function MyOrders() {
  const navigate = useNavigate();

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
        <BackHomeButton className="orders-header__btn" />

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
        <AccountSidebar />

        <section className="od-main">
          <div className="od-main-header">
            <div className="od-main-title">
              <BackHomeButton className="od-desktop-back-btn" />
              <h1>My Orders</h1>
            </div>

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
