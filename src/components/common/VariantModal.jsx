import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

import LazyImage from "./LazyImage";
import { formatINR, toNumber } from "../../utils/format";
import "./VariantModal.css";

const DEFAULT_MAX_QUANTITY = 99;

// null / undefined stock means "not tracked" — only an explicit 0 (or less)
// marks a variant as sold out.
function stockOf(variant) {
  return toNumber(variant?.stock_quantity);
}

function isAvailable(variant) {
  const stock = stockOf(variant);
  return stock === null || stock > 0;
}

export default function VariantModal({
  product,
  variants,
  loading,
  error,
  addError,
  onClose,
  onConfirm,
  adding,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Pre-select the first variant that can actually be bought.
  useEffect(() => {
    const firstAvailable = variants.find(isAvailable) ?? null;
    setSelectedId(firstAvailable?.id ?? null);
    setQuantity(1);
  }, [product?.id, variants]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape" && !adding) onCloseRef.current?.();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [adding]);

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedId),
    [variants, selectedId],
  );

  const maxQuantity = stockOf(selectedVariant) ?? DEFAULT_MAX_QUANTITY;

  const updateQuantity = (nextQuantity) => {
    setQuantity(Math.min(maxQuantity, Math.max(1, nextQuantity)));
  };

  const selectVariant = (variant) => {
    if (!isAvailable(variant)) return;
    setSelectedId(variant.id);
    setQuantity(1);
  };

  const fallbackImage = product?.image || product?.product?.image || "";

  return createPortal(
    <div
      className="variant-modal-overlay"
      onClick={() => !adding && onClose()}
      role="presentation"
    >
      <div
        className="variant-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="variant-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="variant-modal-header">
          <div>
            <h3 id="variant-modal-title">Select Variant</h3>
            <p>Choose an option and quantity</p>
          </div>
          <button
            type="button"
            className="variant-modal-close"
            onClick={onClose}
            disabled={adding}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {loading && (
          <div className="variant-modal-grid" aria-label="Loading variants">
            {[0, 1, 2].map((index) => (
              <div
                className="variant-card variant-card-skeleton"
                key={index}
                aria-hidden="true"
              >
                <span
                  className="lazy-img variant-card-image"
                  data-status="loading"
                >
                  <span className="lazy-img__skeleton" />
                </span>
              </div>
            ))}
          </div>
        )}
        {!loading && error && (
          <p className="variant-modal-message variant-modal-error">{error}</p>
        )}
        {!loading && !error && variants.length === 0 && (
          <p className="variant-modal-message">No variants available.</p>
        )}

        {!loading && !error && variants.length > 0 && (
          <>
            <div className="variant-modal-grid">
              {variants.map((variant) => {
                const available = isAvailable(variant);
                const price = formatINR(variant.price);

                return (
                  <button
                    type="button"
                    key={variant.id}
                    disabled={!available}
                    className={`variant-card ${
                      selectedId === variant.id ? "variant-card-selected" : ""
                    } ${available ? "" : "variant-card-soldout"}`}
                    aria-pressed={selectedId === variant.id}
                    onClick={() => selectVariant(variant)}
                  >
                    <LazyImage
                      className="variant-card-image"
                      src={variant.image || fallbackImage}
                      alt={variant.name}
                    />
                    {price && <p className="variant-card-price">Price: {price}</p>}
                    <p className="variant-card-name" title={variant.name}>
                      {variant.name}
                    </p>
                    <span className="variant-card-label">
                      {variant.label ||
                        variant.storage ||
                        variant.sku ||
                        "Standard"}
                    </span>
                    {!available && (
                      <span className="variant-card-stock">Out of stock</span>
                    )}
                  </button>
                );
              })}
            </div>

            {addError && (
              <p
                className="variant-modal-message variant-modal-error"
                role="alert"
              >
                {addError}
              </p>
            )}

            <div className="variant-modal-footer">
              <div className="variant-quantity-group">
                <span className="variant-quantity-label">Quantity</span>
                <div className="variant-qty-stepper">
                  <button
                    type="button"
                    disabled={quantity <= 1 || adding}
                    onClick={() => updateQuantity(quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    disabled={adding || quantity >= maxQuantity}
                    onClick={() => updateQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="variant-modal-confirm"
                disabled={selectedId === null || adding}
                onClick={() => onConfirm(selectedId, quantity)}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
