import { apiRequest, ENDPOINTS } from "./config";

/**
 * Checkout endpoints (all require the logged-in user's Bearer token, which
 * apiRequest attaches from localStorage("authToken")).
 *
 *   GET  /checkout/user-details      -> { data: { full_name, first_name, last_name, email_id, phone_number, country } }
 *   POST /checkout/delivery-address  -> selects the delivery address for this checkout
 *   GET  /payment-types              -> { data: [{ id, name }] }
 *   POST /checkout/payment-method    -> { _method: "PUT", payment_type_id }
 *   GET  /checkout/order-summary     -> final totals for the chosen address / payment method
 *   POST /checkout/place-order       -> creates the order
 */
export const checkoutApi = {
  getUserDetails: () =>
    apiRequest(ENDPOINTS.CHECKOUT_USER_DETAILS, { method: "GET" }),

  setDeliveryAddress: (addressId) =>
    apiRequest(ENDPOINTS.CHECKOUT_DELIVERY_ADDRESS, {
      method: "POST",
      body: { _method: "PUT", address_id: addressId },
    }),

  getPaymentTypes: () => apiRequest(ENDPOINTS.PAYMENT_TYPES, { method: "GET" }),

  setPaymentMethod: (paymentTypeId) =>
    apiRequest(ENDPOINTS.CHECKOUT_PAYMENT_METHOD, {
      method: "POST",
      body: { _method: "PUT", payment_type_id: paymentTypeId },
    }),

  getOrderSummary: () =>
    apiRequest(ENDPOINTS.CHECKOUT_ORDER_SUMMARY, { method: "GET" }),

  placeOrder: (payload) =>
    apiRequest(ENDPOINTS.CHECKOUT_PLACE_ORDER, {
      method: "POST",
      body: payload,
    }),
};
