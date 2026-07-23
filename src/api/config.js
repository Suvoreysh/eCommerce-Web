// Central place for API base URL. Change .env to switch environments
// (dev / staging / production) without touching component code.
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://spaknit.com/spaknit/api/v1";

export const ENDPOINTS = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  VERIFY_OTP: "/verify-otp",
  RESEND_OTP: "/resend-otp",
  PROFILE: "/user/profile",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  CATEGORIES: "/categories",
  CART: "/cart",
  ORDERS: "/orders",
  CHECKOUT: "/orders/checkout",
};

function getToken() {
  return localStorage.getItem("authToken");
}

/**
 * Single fetch wrapper used by every API module.
 * Keeps headers, error handling and base URL logic in one place.
 */
export async function apiRequest(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const token = auth ? getToken() : null;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${path}`, config);
  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    /* no JSON body */
  }

  if (!response.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}
