import { apiRequest, ENDPOINTS } from "./config";
import { cacheGet, cacheSet, cacheInvalidate } from "../utils/apiCache";

const CART_CACHE_KEY = "cart";
const CART_TTL = 30_000;

export const cartApi = {
  getCart: async (force = false) => {
    if (!force) {
      const cached = cacheGet(CART_CACHE_KEY);
      if (cached) return cached.data;
    }
    const response = await apiRequest(ENDPOINTS.CART, { method: "GET" });
    cacheSet(CART_CACHE_KEY, response, { ttl: CART_TTL });
    return response;
  },

  addItem: async (variantId, quantity) => {
    const response = await apiRequest(
      `${ENDPOINTS.CART}?variant_id=${variantId}&quantity=${quantity}`,
      { method: "POST", body: {} },
    );
    cacheInvalidate(CART_CACHE_KEY);
    return response;
  },

  updateItem: async (variantId, quantity) => {
    const response = await apiRequest(`${ENDPOINTS.CART}/${variantId}`, {
      method: "POST",
      body: { _method: "PUT", quantity: String(quantity) },
    });
    cacheInvalidate(CART_CACHE_KEY);
    return response;
  },

  deleteItem: async (variantId) => {
    const response = await apiRequest(`${ENDPOINTS.CART}/${variantId}`, {
      method: "POST",
      body: { _method: "DELETE" },
    });
    cacheInvalidate(CART_CACHE_KEY);
    return response;
  },
};

export const orderApi = {
  getOrders: (page = 1) =>
    apiRequest(`${ENDPOINTS.ORDERS}${page > 1 ? `?page=${page}` : ""}`, {
      method: "GET",
    }),

  getOrderDetail: (orderId) =>
    apiRequest(`${ENDPOINTS.ORDERS}/${orderId}`, { method: "GET" }),

  cancelOrder: (orderId) =>
    apiRequest(`${ENDPOINTS.ORDERS}/${orderId}/cancel`, { method: "POST" }),
};
