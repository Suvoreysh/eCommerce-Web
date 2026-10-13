import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";
import { checkoutApi } from "../../api/checkoutApi";
import { useCheckout } from "../../context/CheckoutContext";
import { firstErrorMessage, formatINR, paymentLabel } from "../../utils/format";
import Stepper from "../../components/cart/Stepper";
import CheckoutSidebar from "./CheckoutSidebar";
import "./Checkout.css";

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

const tagIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

// ─── Skeleton ──────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="content">
      <div
        className="co-skel co-skel-row"
        style={{ width: 160, height: 18, marginBottom: 14 }}
      />
      <div className="co-skel co-skel-addr" />

      <div
        className="co-skel co-skel-row"
        style={{ width: 140, height: 18, marginBottom: 14, marginTop: 22 }}
      />
      <div className="co-skel co-skel-pay" />

      <div
        className="co-skel co-skel-row"
        style={{ width: 140, height: 18, marginBottom: 14, marginTop: 22 }}
      />
      {[1, 2].map((n) => (
        <div key={n} className="co-skel co-skel-pay" />
      ))}

      <div
        className="co-skel co-skel-row"
        style={{ width: 140, height: 18, marginBottom: 14, marginTop: 22 }}
      />
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="co-skel co-skel-row"
          style={{ marginBottom: 14 }}
        />
      ))}
    </div>
  );
}

export default function Payment() {
  const navigate = useNavigate();
  const { userDetails, address, paymentType, setPaymentType } = useCheckout();

  useEffect(() => {
    if (!address) navigate("/cart/delivery", { replace: true });
  }, [address, navigate]);

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [selectedTypeId, setSelectedTypeId] = useState(paymentType?.id ?? null);

  const [cartMeta, setCartMeta] = useState({
    subtotal: 0,
    discount: 0,
    gst: 0,
    payable: 0,
  });
  const [cartLoading, setCartLoading] = useState(true);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  const isLoading = typesLoading && cartLoading;

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
        const d = response?.data;
        setCartMeta({
          subtotal: Number(d?.subtotal ?? 0),
          discount: Number(d?.discount ?? 0),
          gst: Number(d?.gst ?? 0),
          payable: Number(
            d?.payable ??
              (d?.subtotal ?? 0) - (d?.discount ?? 0) + (d?.gst ?? 0),
          ),
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

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const response = await checkoutApi.applyCoupon(code);
      const savings = Number(
        response?.data?.discount ?? response?.discount ?? 0,
      );
      setAppliedCoupon({ code, savings });
      setShowCouponInput(false);
      setCouponInput("");
      const cartRes = await cartApi.getCart(true);
      const d = cartRes?.data;
      setCartMeta({
        subtotal: Number(d?.subtotal ?? 0),
        discount: Number(d?.discount ?? 0),
        gst: Number(d?.gst ?? 0),
        payable: Number(d?.payable ?? 0),
      });
    } catch (err) {
      setCouponError(firstErrorMessage(err, "Invalid or expired coupon code."));
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await checkoutApi.removeCoupon();
    } catch {
      /* non-fatal */
    }
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    try {
      const cartRes = await cartApi.getCart(true);
      const d = cartRes?.data;
      setCartMeta({
        subtotal: Number(d?.subtotal ?? 0),
        discount: Number(d?.discount ?? 0),
        gst: Number(d?.gst ?? 0),
        payable: Number(d?.payable ?? 0),
      });
    } catch {
      /* non-fatal */
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedTypeId || placing) return;
    setPlacing(true);
    setPlaceError("");
    const chosenType = paymentTypes.find((t) => t.id === selectedTypeId);
    setPaymentType(chosenType || null);
    try {
      try {
        await checkoutApi.setPaymentMethod(selectedTypeId);
      } catch {
        /* non-fatal */
      }
      const response = await checkoutApi.placeOrder({
        first_name:
          userDetails?.fullName?.split(" ")?.[0] || userDetails?.first_name,
        last_name:
          userDetails?.fullName?.split(" ")?.slice(1).join(" ") ||
          userDetails?.last_name,
        email_id: userDetails?.email || userDetails?.email_id,
        phone_number: userDetails?.phone || userDetails?.phone_number,
        country: userDetails?.country,
        address_id: address?.id,
        payment_type_id: selectedTypeId,
        ...(appliedCoupon ? { coupon_code: appliedCoupon.code } : {}),
      });
      if (response?.success === false)
        throw new Error(response?.message || "Unable to place your order.");
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
      setPlaceError(
        firstErrorMessage(err, "Unable to place your order. Please try again."),
      );
    } finally {
      setPlacing(false);
    }
  };

  const couponDiscount = appliedCoupon?.savings ?? 0;
  const finalPayable = Math.max(0, cartMeta.payable - couponDiscount);

  const bodyContent = isLoading ? (
    <PageSkeleton />
  ) : (
    <>
      <p className="section-title">Delivery Address</p>
      {address && (
        <div className="addr-card selected" style={{ cursor: "default" }}>
          <div className="addr-top">
            <b>{address.full_name}</b>
          </div>
          <p className="addr-lines">
            {[
              address.house_name,
              address.street_name,
              address.full_address,
              address.landmark,
            ]
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
        Offers &amp; Coupons
      </p>
      {appliedCoupon ? (
        <div className="coupon-applied-row">
          <div className="coupon-applied-left">
            {tagIcon}
            <span className="coupon-applied-code">{appliedCoupon.code}</span>
            {couponDiscount > 0 && (
              <span className="saved-badge">
                Saved {formatINR(couponDiscount)}
              </span>
            )}
          </div>
          <button className="coupon-remove-btn" onClick={handleRemoveCoupon}>
            ✕
          </button>
        </div>
      ) : showCouponInput ? (
        <div className="coupon-input-row">
          <input
            className="coupon-text-input"
            placeholder="Enter coupon code"
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value.toUpperCase());
              setCouponError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
          />
          <button
            className="coupon-apply-btn"
            onClick={handleApplyCoupon}
            disabled={couponLoading}
          >
            {couponLoading ? "…" : "Apply"}
          </button>
          <button
            className="coupon-cancel-btn"
            onClick={() => {
              setShowCouponInput(false);
              setCouponInput("");
              setCouponError("");
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="coupon-row" onClick={() => setShowCouponInput(true)}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tagIcon}
            <span className="coupon-code">Apply Coupon / Promo Code</span>
          </div>
          <span className="chev">‹</span>
        </div>
      )}
      {couponError && (
        <p className="error-text" style={{ marginTop: -2, marginBottom: 12 }}>
          {couponError}
        </p>
      )}

      <p className="section-title" style={{ marginTop: 22 }}>
        Payment Method
      </p>
      {paymentTypes.map((type) => (
        <div
          key={type.id}
          className={`pay-option ${selectedTypeId === type.id ? "selected" : ""}`}
          onClick={() => setSelectedTypeId(type.id)}
        >
          <span>{paymentLabel(type.name)}</span>
          <div
            className={`radio-dot ${selectedTypeId === type.id ? "on" : ""}`}
          />
        </div>
      ))}

      <p className="section-title" style={{ marginTop: 22 }}>
        Order Details
      </p>
      <div className="order-row">
        <span>Sub Total (Include all Taxes)</span>
        <b>{formatINR(cartMeta.subtotal)}</b>
      </div>
      {cartMeta.discount > 0 && (
        <div className="order-row discount">
          <span>Cart Discount</span>
          <b>-{formatINR(cartMeta.discount)}</b>
        </div>
      )}
      {couponDiscount > 0 && (
        <div className="order-row discount">
          <span>Coupons Discount</span>
          <b>-{formatINR(couponDiscount)}</b>
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
        <span>{formatINR(finalPayable)}</span>
      </div>

      {placeError && (
        <p className="error-text" role="alert" style={{ marginTop: 12 }}>
          {placeError}
        </p>
      )}

      <div className="bottom-bar">
        <button className="total-btn">Total = {formatINR(finalPayable)}</button>
        <button
          className="continue-btn"
          disabled={!selectedTypeId || placing}
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
        <div className="checkout-sticky-top">
          <div className="top-bar">
            <button
              className="icon-btn"
              onClick={() => navigate("/cart/delivery")}
            >
              {backIcon}
            </button>
            <h1>Cart</h1>
            <div className="info-circle">i</div>
          </div>
          <div className="stepper-wrap">
            <Stepper current={3} />
          </div>
        </div>
        <div className="content">{bodyContent}</div>
      </div>

      <div className="cd-desktop">
        <CheckoutSidebar
          current={3}
          onBack={() => navigate("/cart/delivery")}
        />
        <div className="od-main">
          <div className="od-main-header od-main-header--sticky">
            <h1>Payment</h1>
          </div>
          <div className="content">{bodyContent}</div>
        </div>
      </div>
    </div>
  );
}
