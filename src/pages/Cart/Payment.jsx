import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";
import { checkoutApi } from "../../api/checkoutApi";
import { useCheckout } from "../../context/CheckoutContext";
import { firstErrorMessage, formatINR, paymentLabel } from "../../utils/format";
import Stepper from "../../components/cart/Stepper";
import "./Checkout.css";

const steps = [
  { num: 1, label: "Personal Details" },
  { num: 2, label: "Delivery Address" },
  { num: 3, label: "Payment" },
];

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

export default function Payment() {
  const navigate = useNavigate();
  const { userDetails, address, paymentType, setPaymentType } = useCheckout();

  // If earlier steps were skipped (deep link / refresh), send the shopper
  // back to where checkout actually starts.
  useEffect(() => {
    if (!address) navigate("/cart/delivery", { replace: true });
  }, [address, navigate]);

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [selectedTypeId, setSelectedTypeId] = useState(paymentType?.id ?? null);

  const [cartMeta, setCartMeta] = useState({ subtotal: 0, discount: 0, gst: 0, payable: 0 });
  const [cartLoading, setCartLoading] = useState(true);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await checkoutApi.getPaymentTypes();
        if (!active) return;

        const list = Array.isArray(response?.data) ? response.data : [];
        setPaymentTypes(list);
        setSelectedTypeId((prev) => prev ?? list[0]?.id ?? null);
      } catch (err) {
        console.error("Get payment types failed:", err);
      } finally {
        if (active) setTypesLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await cartApi.getCart();
        if (!active) return;
        const data = response?.data;
        setCartMeta({
          subtotal: Number(data?.subtotal ?? 0),
          discount: Number(data?.discount ?? 0),
          gst: Number(data?.gst ?? 0),
          payable: Number(data?.payable ?? (data?.subtotal ?? 0) - (data?.discount ?? 0) + (data?.gst ?? 0)),
        });
      } catch (err) {
        console.error("Get cart failed:", err);
      } finally {
        if (active) setCartLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedTypeId || placing) return;

    setPlacing(true);
    setPlaceError("");

    const chosenType = paymentTypes.find((type) => type.id === selectedTypeId);
    setPaymentType(chosenType || null);

    try {
      // Non-fatal — place-order below carries payment_type_id explicitly too.
      try {
        await checkoutApi.setPaymentMethod(selectedTypeId);
      } catch (err) {
        console.error("Set payment method failed:", err);
      }

      const response = await checkoutApi.placeOrder({
        first_name: userDetails?.fullName?.split(" ")?.[0] || userDetails?.first_name,
        last_name: userDetails?.fullName?.split(" ")?.slice(1).join(" ") || userDetails?.last_name,
        email_id: userDetails?.email || userDetails?.email_id,
        phone_number: userDetails?.phone || userDetails?.phone_number,
        country: userDetails?.country,
        address_id: address?.id,
        payment_type_id: selectedTypeId,
      });

      if (response?.success === false) {
        throw new Error(response?.message || "Unable to place your order.");
      }

      const orderId =
        response?.data?.order_id ||
        response?.data?.id ||
        response?.order_id ||
        `#${Math.floor(100000000 + Math.random() * 900000000)}`;

      navigate("/order-success", {
        state: {
          personal: userDetails,
          address,
          paymentType: chosenType,
          total: cartMeta.payable,
          orderId: String(orderId).startsWith("#") ? orderId : `#${orderId}`,
        },
      });
    } catch (err) {
      console.error("Place order failed:", err);
      setPlaceError(firstErrorMessage(err, "Unable to place your order. Please try again."));
    } finally {
      setPlacing(false);
    }
  };

  const bodyContent = (
    <>
      <p className="section-title">Delivery Address</p>
      {address && (
        <div className="addr-card selected" style={{ cursor: "default" }}>
          <div className="addr-top">
            <b>{address.full_name}</b>
          </div>
          <p className="addr-lines">
            {[address.house_name, address.street_name, address.full_address, address.landmark]
              .filter(Boolean)
              .join(", ")}
            <br />
            {[address.city, address.state, address.pincode, address.country]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p className="addr-phone">Phone No: {address.phone_number}</p>
        </div>
      )}

      <p className="section-title" style={{ marginTop: 22 }}>
        Payment Method
      </p>

      {typesLoading && <p style={{ color: "#6b6b6b", fontSize: 14 }}>Loading payment options…</p>}

      {!typesLoading && paymentTypes.length === 0 && (
        <p style={{ color: "#6b6b6b", fontSize: 14 }}>No payment methods available.</p>
      )}

      {!typesLoading &&
        paymentTypes.map((type) => (
          <div
            key={type.id}
            className={`pay-option ${selectedTypeId === type.id ? "selected" : ""}`}
            onClick={() => setSelectedTypeId(type.id)}
          >
            <span>{paymentLabel(type.name)}</span>
            <div className={`radio-dot ${selectedTypeId === type.id ? "on" : ""}`} />
          </div>
        ))}

      <p className="section-title" style={{ marginTop: 22 }}>
        Order Details
      </p>

      {cartLoading ? (
        <p style={{ color: "#6b6b6b", fontSize: 14 }}>Loading order summary…</p>
      ) : (
        <>
          <div className="order-row">
            <span>Sub Total (Include all Taxes)</span>
            <b>{formatINR(cartMeta.subtotal)}</b>
          </div>
          {cartMeta.discount > 0 && (
            <div className="order-row discount">
              <span>Discount</span>
              <b>-{formatINR(cartMeta.discount)}</b>
            </div>
          )}
          {cartMeta.gst > 0 && (
            <div className="order-row">
              <span>GST</span>
              <b>{formatINR(cartMeta.gst)}</b>
            </div>
          )}
          <div className="order-divider" />
          <div className="order-total">
            <span>Total (Include all Taxes)</span>
            <span>{formatINR(cartMeta.payable)}</span>
          </div>
        </>
      )}

      {placeError && (
        <p className="error-text" role="alert" style={{ marginTop: 12 }}>
          {placeError}
        </p>
      )}

      <div className="bottom-bar">
        <button className="total-btn">Total = {formatINR(cartMeta.payable)}</button>
        <button
          className="continue-btn"
          disabled={!selectedTypeId || placing || typesLoading}
          onClick={handlePlaceOrder}
        >
          {placing ? "Placing..." : "Place Order"}
        </button>
      </div>
    </>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-mobile">
        <div className="top-bar">
          <button className="icon-btn" onClick={() => navigate("/cart/delivery")}>
            {backIcon}
          </button>
          <h1>Cart</h1>
          <div className="info-circle">i</div>
        </div>

        <div className="stepper-wrap">
          <Stepper current={3} />
        </div>

        <div className="content">{bodyContent}</div>
      </div>

      <div className="cd-desktop">
        <aside className="od-sidebar">
          <div className="od-avatar" />
          <h2 className="od-name">Checkout</h2>
          <p className="od-phone">Step 3 of 3</p>

          <nav className="od-steps">
            {steps.map((s) => (
              <div key={s.num} className={`od-step ${s.num === 3 ? "active" : "done"}`}>
                <span className="od-step-num">{s.num < 3 ? "✓" : s.num}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </nav>

          <div className="od-help">
            <span className="od-help-icon">🎧</span>
            <div>
              <p className="od-help-title">Need Help?</p>
              <p className="od-help-sub">24/7 Customer Support</p>
              <p className="od-help-email">support@shopkart.com</p>
            </div>
          </div>
        </aside>

        <div className="od-main">
          <div className="od-main-header">
            <h1>Payment</h1>
          </div>
          <div className="content">{bodyContent}</div>
        </div>
      </div>
    </div>
  );
}
