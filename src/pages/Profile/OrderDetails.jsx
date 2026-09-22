import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { IoInformationCircleOutline } from "react-icons/io5";

import { orderApi } from "../../api/cartApi";
import Seo from "../../components/common/Seo";
import LazyImage from "../../components/common/LazyImage";
import AccountSidebar from "../../components/profile/AccountSidebar";
import { firstErrorMessage, formatINR } from "../../utils/format";
import { deliveryStatusLabel, isCancelled } from "../../utils/orderStatus";
import "./OrderDetails.css";

const backIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const STEPS = [
  { id: 1, label: "Placed" },
  { id: 2, label: "Processing" },
  { id: 3, label: "Shipped" },
  { id: 4, label: "Out for Delivery" },
  { id: 5, label: "Delivered" },
];

function OrderDetailsContent({ order, onCancel, cancelling }) {
  const navigate = useNavigate();

  const currentStep = isCancelled(order) ? 0 : Number(order.delivery_status_id) || 1;
  const progressWidth =
    currentStep > 0 ? ((currentStep - 1) / (STEPS.length - 1)) * 100 : 0;

  const placedOnLabel = order.placed_on
    ? new Date(order.placed_on).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const cancellable = !isCancelled(order) && currentStep < 5;

  return (
    <div className="order-details-content">
      <header className="order-details-header">
        <button
          type="button"
          className="order-details-back-btn"
          onClick={() => navigate("/orders")}
          aria-label="Back to orders"
        >
          {backIcon}
        </button>

        <h1>Order Details</h1>

        <button
          type="button"
          className="order-details-info-btn"
          aria-label="Order information"
        >
          <IoInformationCircleOutline />
        </button>
      </header>

      {isCancelled(order) ? (
        <section className="order-status-banner order-status-banner--cancelled">
          This order was cancelled.
        </section>
      ) : (
        <section className="order-progress">
          <div className="order-progress-track">
            <div
              className="order-progress-track-active"
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`order-progress-step ${step.id <= currentStep ? "active" : ""}`}
            >
              <div className="order-progress-circle">
                <span />
              </div>
              <p>{step.label}</p>
            </div>
          ))}
        </section>
      )}

      <div className="order-details-grid">
        <section className="order-information-card">
          <div className="order-details-row order-status-row">
            <p>
              <strong>Order:</strong>
              <span> #{order.order_number}</span>
            </p>

            <span className="order-status-badge">
              {isCancelled(order) ? "Cancelled" : deliveryStatusLabel(order.delivery_status_id)}
            </span>
          </div>

          <div className="order-details-divider" />

          <div className="order-details-row delivery-row">
            <span>Placed on</span>
            <strong>{placedOnLabel}</strong>
          </div>

          <div className="order-details-divider" />

          <div className="order-details-row delivery-row">
            <span>Items</span>
            <strong>{order.item_count}</strong>
          </div>

          <div className="order-details-divider" />

          <div className="order-details-row delivery-row">
            <span>Total Payable</span>
            <strong>{formatINR(order.total_payable_amount)}</strong>
          </div>
        </section>

        <section className="order-details-product">
          <h3 className="order-preview-title">Items in this order</h3>
          <div className="order-preview-gallery">
            {(order.preview_images || []).map((image, index) => (
              <div className="order-preview-thumb" key={index}>
                <LazyImage src={image} alt="" />
              </div>
            ))}
            {(!order.preview_images || order.preview_images.length === 0) && (
              <p style={{ color: "#8a8a8a", fontSize: 13 }}>No preview available.</p>
            )}
          </div>
        </section>
      </div>

      {cancellable && (
        <div className="order-details-actions">
          <button
            type="button"
            className="order-cancel-btn"
            disabled={cancelling}
            onClick={onCancel}
          >
            {cancelling ? "Cancelling…" : "Cancel Order"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function OrderDetails() {
  const location = useLocation();
  const { orderId } = useParams();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Direct link / refresh without router state: fall back to the order list
  // and pick out this order, since there's no confirmed single-order
  // endpoint in the API contract.
  useEffect(() => {
    if (order) return;

    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        let page = 1;
        let found = null;
        let lastPage = 1;

        do {
          const response = await orderApi.getOrders(page);
          const data = response?.data || {};
          const rows = Array.isArray(data.orders) ? data.orders : [];

          found = rows.find((item) => String(item.order_id) === String(orderId));
          lastPage = Number(data.last_page) || 1;
          page += 1;
        } while (!found && page <= lastPage && page <= 10);

        if (!active) return;

        if (!found) {
          setError("Order not found.");
        } else {
          setOrder(found);
        }
      } catch (err) {
        if (active) setError(firstErrorMessage(err, "Unable to load this order."));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [order, orderId]);

  const handleCancel = async () => {
    if (!order || !window.confirm(`Cancel order #${order.order_number}?`)) return;

    try {
      setCancelling(true);
      await orderApi.cancelOrder(order.order_id);
      setOrder((prev) => ({ ...prev, order_status_id: 4 }));
    } catch (err) {
      window.alert(firstErrorMessage(err, "Unable to cancel this order."));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <main className="order-details-page">
      <Seo title="Order Details" description="View your order details." />

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px 20px" }}>Loading order…</p>
      ) : error || !order ? (
        <p style={{ textAlign: "center", padding: "40px 20px", color: "red" }}>
          {error || "Order not found."}
        </p>
      ) : (
        <>
          <div className="order-details-mobile">
            <OrderDetailsContent order={order} onCancel={handleCancel} cancelling={cancelling} />
          </div>

          <div className="order-details-desktop">
            <AccountSidebar />
            <section className="order-details-main-panel">
              <OrderDetailsContent order={order} onCancel={handleCancel} cancelling={cancelling} />
            </section>
          </div>
        </>
      )}
    </main>
  );
}
