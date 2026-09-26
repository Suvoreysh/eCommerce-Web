import { apiRequest, ENDPOINTS } from "./config";

export const cartApi = {
  // GET /cart
  getCart: () => apiRequest(ENDPOINTS.CART, { method: "GET" }),

  // POST /cart?variant_id=&quantity=  — add item or re-add after delete
  addItem: (variantId, quantity) =>
    apiRequest(
      `${ENDPOINTS.CART}?variant_id=${variantId}&quantity=${quantity}`,
      { method: "POST", body: {} },
    ),

  // POST /cart/:itemId { _method: DELETE }  — fully removes the cart item
  deleteItem: (itemId) =>
    apiRequest(`${ENDPOINTS.CART}/${itemId}`, {
      method: "POST",
      body: { _method: "DELETE" },
    }),
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
