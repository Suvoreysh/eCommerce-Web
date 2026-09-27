// MyOrders.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoInformationCircleOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";

import { orderApi } from "../../api/cartApi";
import Seo from "../../components/common/Seo";
import LazyImage from "../../components/common/LazyImage";
import AccountSidebar from "../../components/profile/AccountSidebar";
import BackHomeButton from "../../components/profile/BackHomeButton";
import { firstErrorMessage, formatINR } from "../../utils/format";
import { deliveryStatusLabel, orderTab } from "../../utils/orderStatus";

import "./MyOrders.css";

const tabs = [
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function OrderCard({ order, desktop, onOpen }) {
  const prefix = desktop ? "od-card" : "order-card";

  return (
    <article className={prefix}>
      <div className={`${prefix}__header`}>
        <div className={`${prefix}__id`}>
          <strong>Order:</strong> <span>#{order.order_number}</span>
        </div>
        <div className={`${prefix}__right`}>
          <span>
            ({order.item_count} {order.item_count === 1 ? "Item" : "Items"})
          </span>
          <strong>{formatINR(order.total_payable_amount)}</strong>
        </div>
      </div>

      <div className={`${prefix}__divider`} />

      <div className="order-preview-row">
        {(order.preview_images || []).slice(0, 4).map((image, index) => (
          <div
            className="order-preview-thumb"
            key={`${order.order_id}-${index}`}
          >
            <LazyImage src={image} alt="" />
          </div>
        ))}
        {order.item_count > (order.preview_images || []).length && (
          <div className="order-preview-thumb order-preview-thumb--more">
            +{order.item_count - (order.preview_images || []).length}
          </div>
        )}
      </div>

      <p className="order-placed-on">
        Placed on{" "}
        {new Date(order.placed_on).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className={`${prefix}__actions`}>
        <button
          type="button"
          className={desktop ? "od-status-btn" : "status-btn"}
        >
          {deliveryStatusLabel(order.delivery_status_id)}
        </button>
        <button
          type="button"
          className={desktop ? "od-track-btn" : "track-btn"}
          onClick={() => onOpen(order)}
        >
          Order Details
        </button>
      </div>
    </article>
  );
}

export default function MyOrders() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadPage = async (targetPage) => {
    try {
      if (targetPage === 1) setLoading(true);
      else setLoadingMore(true);
      setError("");

      const response = await orderApi.getOrders(targetPage);
      const data = response?.data || {};
      const rows = Array.isArray(data.orders) ? data.orders : [];

      setOrders((prev) => (targetPage === 1 ? rows : [...prev, ...rows]));
      setPage(Number(data.current_page) || targetPage);
      setLastPage(Number(data.last_page) || 1);
    } catch (err) {
      console.error("Get orders failed:", err);
      setError(firstErrorMessage(err, "Unable to load your orders."));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  const filteredOrders = useMemo(
    () => orders.filter((order) => orderTab(order) === activeTab),
    [orders, activeTab],
  );

  const openOrderDetails = (order) => {
    navigate(`/order-details/${order.order_id}`, { state: { order } });
  };

  const emptyState = (
    <div className="orders-empty">
      <FiShoppingBag />
      <h2>No orders found</h2>
      <p>There are no orders available in this section.</p>
    </div>
  );

  return (
    <main className="orders-page">
      <Seo title="My Orders" description="View and manage your orders" />

      {/* ── Mobile ── */}
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
          {loading ? (
            <p style={{ textAlign: "center", padding: "24px 0" }}>
              Loading orders…
            </p>
          ) : error ? (
            <p style={{ textAlign: "center", padding: "24px 0", color: "red" }}>
              {error}
            </p>
          ) : filteredOrders.length === 0 ? (
            emptyState
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                onOpen={openOrderDetails}
              />
            ))
          )}
        </div>

        {!loading && page < lastPage && (
          <button
            type="button"
            className="orders-load-more"
            disabled={loadingMore}
            onClick={() => loadPage(page + 1)}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        )}
      </div>

      {/* ── Desktop ── */}
      <div className="orders-desktop">
        <AccountSidebar />

        <section className="od-main">
          <div className="od-main-header od-main-header--sticky">
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
                className={`od-tab ${activeTab === tab.key ? "od-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="od-list">
            {loading ? (
              <p style={{ textAlign: "center", padding: "24px 0" }}>
                Loading orders…
              </p>
            ) : error ? (
              <p
                style={{ textAlign: "center", padding: "24px 0", color: "red" }}
              >
                {error}
              </p>
            ) : filteredOrders.length === 0 ? (
              <div className="od-empty">
                <FiShoppingBag />
                <h2>No orders found</h2>
                <p>There are no orders available in this section.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  desktop
                  onOpen={openOrderDetails}
                />
              ))
            )}

            {!loading && page < lastPage && (
              <button
                type="button"
                className="orders-load-more"
                disabled={loadingMore}
                onClick={() => loadPage(page + 1)}
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
