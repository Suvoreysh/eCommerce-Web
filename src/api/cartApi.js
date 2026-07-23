import { apiRequest, ENDPOINTS } from "./config";

export const cartApi = {
  getCart: () => apiRequest(ENDPOINTS.CART, { method: "GET" }),
  addItem: (payload) => apiRequest(ENDPOINTS.CART, { method: "POST", body: payload }),
  updateItem: (itemId, payload) => apiRequest(`${ENDPOINTS.CART}/${itemId}`, { method: "PUT", body: payload }),
  removeItem: (itemId) => apiRequest(`${ENDPOINTS.CART}/${itemId}`, { method: "DELETE" }),
};

export const orderApi = {
  checkout: (payload) => apiRequest(ENDPOINTS.CHECKOUT, { method: "POST", body: payload }),
  getOrders: (status = "") => apiRequest(`${ENDPOINTS.ORDERS}${status ? `?status=${status}` : ""}`, { method: "GET" }),
};
