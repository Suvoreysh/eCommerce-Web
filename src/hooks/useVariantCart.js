import { useCallback, useRef, useState, createElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { productApi } from "../api/productApi";
import { cartApi } from "../api/cartApi";
import { useAuth } from "../context/AuthContext";
import { useCartCount } from "../context/CartCountContext";
import VariantModal from "../components/common/VariantModal";
import { resolveImageUrl } from "../utils/image";
import { firstErrorMessage, toNumber } from "../utils/format";

/**
 * Turns whatever /products/:id/variants returns into a flat list the
 * VariantModal can render. Tolerates the response shapes the backend has used
 * so far (data | data.variants | data.product_variants | data.data).
 */
function normalizeVariants(response, product) {
  const payload = response?.data;

  const rows =
    [
      payload,
      payload?.variants,
      payload?.product_variants,
      payload?.data,
      response?.variants,
    ].find(Array.isArray) ?? [];

  const fallbackPrice =
    product.priceMin ??
    product.price_min ??
    product.price ??
    product.priceMax ??
    product.price_max;

  return rows
    .map((variant) => ({
      ...variant,
      id:
        variant.id ??
        variant.variant_id ??
        variant.product_variant_id ??
        null,
      name:
        variant.name ??
        variant.variant_name ??
        variant.product_name ??
        product.name,
      label:
        variant.label ??
        variant.storage ??
        variant.size ??
        variant.sku ??
        variant.attributes?.storage ??
        variant.attributes?.size,
      image:
        resolveImageUrl(variant.image ?? variant.image_url) ||
        product.image ||
        product.product?.image ||
        "",
      price:
        toNumber(
          variant.price ?? variant.sale_price ?? variant.regular_price,
        ) ?? toNumber(fallbackPrice),
    }))
    .filter((variant) => variant.id !== null);
}

/**
 * Shared "Add to Cart -> choose variant -> add" flow used by every product
 * card. Render the returned `modal` once per section (NOT inside a card, so
 * clicks in the overlay can't bubble into a card's navigate handler).
 *
 *   const { open, modal } = useVariantCart();
 *   <button onClick={(e) => open(e, product)}>Add to Cart</button>
 *   {modal}
 */
export default function useVariantCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { refreshCartCount } = useCartCount();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  // Guards against a slow response for product A landing after the shopper
  // has already closed it and opened product B.
  const requestRef = useRef(0);

  const goToLogin = useCallback(() => {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    navigate(`/login?returnTo=${returnTo}`);
  }, [navigate, location.pathname, location.search]);

  const close = useCallback(() => {
    requestRef.current += 1;
    setProduct(null);
    setVariants([]);
    setError("");
    setAddError("");
    setLoading(false);
  }, []);

  const open = useCallback(
    async (event, target) => {
      event?.stopPropagation?.();
      event?.preventDefault?.();

      if (!user) {
        goToLogin();
        return;
      }

      const productId =
        target?.id ?? target?.product_id ?? target?.product?.id ?? null;
      const token = ++requestRef.current;

      setProduct(target);
      setVariants([]);
      setError("");
      setAddError("");
      setLoading(true);

      try {
        if (productId === null) throw new Error("Product ID is missing.");

        const response = await productApi.getProductVariants(productId);

        if (token !== requestRef.current) return;

        setVariants(normalizeVariants(response, target));
      } catch (err) {
        if (token !== requestRef.current) return;

        console.error("Get variants failed:", err);
        setError(err.message || "Unable to load variants.");
      } finally {
        if (token === requestRef.current) setLoading(false);
      }
    },
    [user, goToLogin],
  );

  const confirm = useCallback(
    async (variantId, quantity) => {
      try {
        setAdding(true);
        setAddError("");

        await cartApi.addItem(variantId, quantity);

        close();
        refreshCartCount();
      } catch (err) {
        console.error("Add to cart failed:", err);

        if (err?.status === 401) {
          close();
          goToLogin();
          return;
        }

        setAddError(firstErrorMessage(err, "Unable to add item to cart."));
      } finally {
        setAdding(false);
      }
    },
    [close, refreshCartCount, goToLogin],
  );

  const modal = product
    ? createElement(VariantModal, {
        product,
        variants,
        loading,
        error,
        addError,
        adding,
        onClose: close,
        onConfirm: confirm,
      })
    : null;

  return { open, close, modal };
}
