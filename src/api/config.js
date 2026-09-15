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
  PRODUCT_IMAGES: (id) => `/products/${id}/images`,
  PRODUCT_KEY_POINTS: (id) => `/products/${id}/key-points`,
  PRODUCT_KEYNOTE_SECTIONS: (id) => `/products/${id}/keynote-sections`,
  CATEGORIES: "/categories",
  CATEGORY_SUBCATEGORIES: (categoryId) =>
    `/categories/${categoryId}/subcategories`,
  SUBCATEGORIES: "/subcategories",
  SUBCATEGORY_DETAIL: (id) => `/subcategories/${id}`,

  VARIANTS: "/variants",
  VARIANT_DETAIL: (id) => `/variants/${id}`,
  // add to api/config.js ENDPOINTS
  PRODUCT_FEATURES: (id, section) =>
    `/products/${id}/features${section ? `?section=${section}` : ""}`,
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  PRODUCT_VARIANTS: (id) => `/products/${id}/variants`,

  CART: "/cart",
  ORDERS: "/orders",
  CHECKOUT: "/orders/checkout",

  WISHLIST: "/wishlist",
  WISHLIST_TOGGLE: "/wishlist/toggle",
  WISHLIST_ITEM: (productId) => `/wishlist/${productId}`,

  ADDRESSES: "/addresses",
  ADDRESS_DETAIL: (id) => `/addresses/${id}`,
  ADDRESS_UPDATE: (id) => `/addresses/${id}/update`,
  ADDRESS_SET_DEFAULT: (id) => `/addresses/${id}/set-default`,
  ADDRESS_DELETE: (id) => `/addresses/${id}/delete`,
  ADDRESS_DEFAULT: "/addresses/default",
};

function getToken() {
  return localStorage.getItem("authToken");
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
