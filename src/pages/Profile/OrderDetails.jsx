import { useLocation, useNavigate, useParams } from "react-router-dom";

import { IoCallOutline, IoInformationCircleOutline } from "react-icons/io5";

import Seo from "../../components/common/Seo";
import AccountSidebar from "../../components/profile/AccountSidebar";
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

const steps = [
  { id: 1, label: "Processing" },
  { id: 2, label: "Picking" },
  { id: 3, label: "Shipping" },
  { id: 4, label: "Delivered" },
];

const fallbackOrder = {
  id: "123456789",
  total: 1000,
  status: "Processing",
  currentStep: 2,
  deliveryEstimate: "December 3, 2026",

  customer: {
    name: "Rahul Sharma",
    address:
      "Flat 5B, Shanti Residency, 24 MG Road, Indiranagar, Karnataka, Bengaluru-560038",
    phone: "+91 98765 43210",
  },

  paymentMethod: "Credit Card",

  items: [
    {
      name: "Product name",
      value: 1000,
      arrival: "04 Dec 26",
      qty: 1,
      image: "",
    },
  ],
};

function OrderDetailsContent({ order }) {
  const navigate = useNavigate();

  const product = order.items?.[0] || fallbackOrder.items[0];

  const progressWidth = ((order.currentStep - 1) / (steps.length - 1)) * 100;

  const handleContact = () => {
    window.location.href = `tel:${order.customer.phone.replace(/\s/g, "")}`;
  };

  const handleCancelOrder = () => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${order.id}?`,
    );

    if (!confirmed) return;

    console.log("Order cancelled:", order.id);
  };

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

      <section className="order-progress">
        <div className="order-progress-track">
          <div
            className="order-progress-track-active"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        {steps.map((step) => {
          const active = step.id <= order.currentStep;

          return (
            <div
              key={step.id}
              className={`order-progress-step ${active ? "active" : ""}`}
            >
              <div className="order-progress-circle">
                <span />
              </div>

              <p>{step.label}</p>
            </div>
          );
        })}
      </section>

      <div className="order-details-grid">
        <section className="order-information-card">
          <div className="order-details-row order-status-row">
            <p>
              <strong>ID:</strong>
              <span> #{order.id}</span>
            </p>

            <span className="order-status-badge">{order.status}</span>
          </div>

          <div className="order-details-divider" />

          <div className="order-details-row delivery-row">
            <span>Delivery estimate</span>
            <strong>{order.deliveryEstimate}</strong>
          </div>

          <div className="order-details-divider" />

          <div className="customer-details">
            <h2>{order.customer.name}</h2>

            <p className="customer-address">{order.customer.address}</p>

            <p className="customer-phone">
              <span>Phone No:</span>
              <strong>{order.customer.phone}</strong>
            </p>
          </div>

          <div className="order-details-divider" />

          <div className="order-details-row payment-row">
            <span>Payment method</span>
            <strong>{order.paymentMethod}</strong>
          </div>
        </section>

        <section className="order-product-details-card">
          <div className="order-product-card-header">
            <p>
              <strong>ID:</strong>
              <span> #{order.id}</span>
            </p>

            <strong>${Number(order.total).toFixed(2)}</strong>
          </div>

          <div className="order-details-divider" />

          <div className="order-product-details-body">
            <div className="order-details-product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="order-details-placeholder" />
              )}
            </div>

            <div className="order-details-product-info">
              <h2>{product.name}</h2>

              <p>Value: ${Number(product.value).toFixed(2)}</p>

              <small>
                Est Arrival: <strong>{product.arrival}</strong>
              </small>
            </div>

            <span className="order-details-product-qty">
              Qty: {product.qty}
            </span>
          </div>
        </section>
      </div>

      <div className="order-details-actions">
        <button
          type="button"
          className="order-contact-btn"
          onClick={handleContact}
        >
          <IoCallOutline />
          Contact Us
        </button>

        <button
          type="button"
          className="order-cancel-btn"
          onClick={handleCancelOrder}
        >
          Cancel Order
        </button>
      </div>
    </div>
  );
}

export default function OrderDetails() {
  const location = useLocation();
  const { orderId } = useParams();

  const receivedOrder = location.state?.order;

  const order = {
    ...fallbackOrder,
    ...receivedOrder,

    id: orderId || receivedOrder?.id || fallbackOrder.id,

    currentStep: receivedOrder?.currentStep || fallbackOrder.currentStep,

    deliveryEstimate:
      receivedOrder?.deliveryEstimate || fallbackOrder.deliveryEstimate,

    customer: receivedOrder?.customer || fallbackOrder.customer,

    paymentMethod: receivedOrder?.paymentMethod || fallbackOrder.paymentMethod,

    items: receivedOrder?.items || fallbackOrder.items,
  };

  return (
    <main className="order-details-page">
      <Seo
        title="Order Details"
        description={`Order details for ${order.id}`}
      />

      {/* Mobile */}
      <div className="order-details-mobile">
        <OrderDetailsContent order={order} />
      </div>

      {/* Desktop */}
      <div className="order-details-desktop">
        <AccountSidebar />

        <section className="order-details-main-panel">
          <OrderDetailsContent order={order} />
        </section>
      </div>
    </main>
  );
}
