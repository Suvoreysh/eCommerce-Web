// api/config.js
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://spaknit.com/spaknit/api/v1";

export const ENDPOINTS = {
  HOME: "/home",
  BANNERS: "/banners",
  FAQS: "/faqs",
  PRODUCT_FEATURED_IMAGE_SECTIONS: (id) =>
    `/products/${id}/featured-image-sections`,
  LOGIN: "/login",
  SIGNUP: "/register",
  PRODUCT_RELATED: (id) => `/products/${id}/related`,
  VERIFY_SIGNUP_OTP: "/otp/verify-signup",
  RESEND_OTP: "/otp/resend",
  PRODUCT_REVIEWS: (id) => `/products/${id}/reviews`,
  REQUEST_LOGIN_OTP: "/login/otp/request",
  VERIFY_LOGIN_OTP: "/login/otp/verify",

  PROFILE: "/me",
  CHANGE_PASSWORD: "/change-password",
  FORGOT_PASSWORD: "/forgot-password",
  PRODUCT_IMAGES: (id) => `/products/${id}/images`,
  PRODUCT_KEY_POINTS: (id) => `/products/${id}/key-points`,
  PRODUCT_KEYNOTE_SECTIONS: (id) => `/products/${id}/keynote-sections`,
  CATEGORIES: "/categories",
  CATEGORY_SUBCATEGORIES: (categoryId) =>
    `/categories/${categoryId}/subcategories`,
  CATEGORY_PRODUCTS: (categoryId) => `/categories/${categoryId}/products`,
  CATEGORY_OFFERS: (categoryId) => `/categories/${categoryId}/offers`,
  SUBCATEGORIES: "/subcategories",
  SUBCATEGORY_DETAIL: (id) => `/subcategories/${id}`,
  SUBCATEGORY_PRODUCTS: (id) => `/subcategories/${id}/products`,
  OPINION: "/opinion",
  VARIANTS: "/variants",
  VARIANT_DETAIL: (id) => `/variants/${id}`,
  PRODUCT_FEATURES: (id, section) =>
    `/products/${id}/features${section ? `?section=${section}` : ""}`,
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  PRODUCT_VARIANTS: (id) => `/products/${id}/variants`,

  CART: "/cart",
  ORDERS: "/orders",

  // Checkout flow
  PAYMENT_TYPES: "/payment-types",
  CHECKOUT_USER_DETAILS: "/checkout/user-details",
  CHECKOUT_DELIVERY_ADDRESS: "/checkout/delivery-address",
  CHECKOUT_PAYMENT_METHOD: "/checkout/payment-method",
  CHECKOUT_ORDER_SUMMARY: "/checkout/order-summary",
  CHECKOUT_PLACE_ORDER: "/checkout/place-order",

  WISHLIST: "/wishlist",
  WISHLIST_TOGGLE: "/wishlist/toggle",
  WISHLIST_ITEM: (productId) => `/wishlist/${productId}`,

  ADDRESSES: "/addresses",
  ADDRESS_DETAIL: (id) => `/addresses/${id}`,
  ADDRESS_UPDATE: (id) => `/addresses/${id}`,
  ADDRESS_SET_DEFAULT: (id) => `/addresses/${id}/set-default`,
  ADDRESS_DELETE: (id) => `/addresses/${id}/delete`,
  ADDRESS_DEFAULT: "/addresses/default",
};

function getToken() {
  return localStorage.getItem("authToken");
}

/**
 * Append query-string params to a path, skipping empty values.
 *   withQuery("/products", { page: 2, q: "" }) -> "/products?page=2"
 */
export function withQuery(path, params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.append(key, String(value));
  });

  const queryString = search.toString();

  if (!queryString) return path;

  return `${path}${path.includes("?") ? "&" : "?"}${queryString}`;
}

export async function apiRequest(
  path,
  { method = "GET", body, headers = {}, auth = true } = {},
) {
  const token = auth ? getToken() : null;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body !== undefined && body !== null) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, config);

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.errors?.message ||
      `Request failed (${response.status})`;

    const error = new Error(message);

    error.status = response.status;
    error.errors = data?.errors;
    error.data = data;

    throw error;
  }

  return data;
}
