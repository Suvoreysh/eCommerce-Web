import { apiRequest, ENDPOINTS } from "./config";

export const cartApi = {
  // GET /cart
  getCart: () => apiRequest(ENDPOINTS.CART, { method: "GET" }),

  // POST /cart?variant_id=&quantity=  (per API: params on the query string, empty body)
  addItem: (variantId, quantity = 1) =>
    apiRequest(
      `${ENDPOINTS.CART}?variant_id=${variantId}&quantity=${quantity}`,
      {
        method: "POST",
        body: {},
      },
    ),

  // Not present in the current API contract yet — kept for when the backend
  // adds an item-level update endpoint (assumed shape: /cart/:itemId).
  updateItem: (itemId, payload) =>
    apiRequest(`${ENDPOINTS.CART}/${itemId}`, { method: "PUT", body: payload }),

  // POST /cart/:itemId with { "_method": "DELETE" } — per Postman collection,
  // the backend expects a method-override POST rather than a real DELETE verb.
  removeItem: (itemId) =>
    apiRequest(`${ENDPOINTS.CART}/${itemId}`, {
      method: "POST",
      body: { _method: "DELETE" },
    }),
};

export const orderApi = {
  checkout: (payload) =>
    apiRequest(ENDPOINTS.CHECKOUT, { method: "POST", body: payload }),
  getOrders: (status = "") =>
    apiRequest(`${ENDPOINTS.ORDERS}${status ? `?status=${status}` : ""}`, {
      method: "GET",
    }),
};
