// Best-known mapping for the order/delivery status ids the API returns.
// Anything outside these falls back to a generic "Status #<id>" label so the
// UI never breaks on an id we haven't seen yet.
const DELIVERY_STATUS_LABELS = {
  1: "Order Placed",
  2: "Processing",
  3: "Shipped",
  4: "Out for Delivery",
  5: "Delivered",
};

const ORDER_STATUS_LABELS = {
  1: "Pending",
  2: "Confirmed",
  3: "Completed",
  4: "Cancelled",
  5: "Refunded",
};

export function deliveryStatusLabel(id) {
  return DELIVERY_STATUS_LABELS[Number(id)] || `Status #${id}`;
}

export function orderStatusLabel(id) {
  return ORDER_STATUS_LABELS[Number(id)] || `Status #${id}`;
}

export function isCancelled(order) {
  return Number(order.order_status_id) === 4;
}

export function isDelivered(order) {
  return Number(order.delivery_status_id) === 5;
}

// Bucket an order into one of three tabs for the My Orders screen.
export function orderTab(order) {
  if (isCancelled(order)) return "cancelled";
  if (isDelivered(order)) return "completed";
  return "pending";
}
