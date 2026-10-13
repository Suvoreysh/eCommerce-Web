// Delivery status ids from status_master table
const DELIVERY_STATUS_LABELS = {
  1: "Order Placed",
  2: "In Progress",
  3: "Order Processing",
  4: "Order Collected",
  5: "Ready For Move",
  6: "Out For Delivery",
  7: "On The Way",
  8: "Reached Location",
  9: "Delivered",
  10: "Wrong Location",
  11: "Customer Not Found",
  12: "Cancelled",
  13: "Procurement Processing",
  14: "Completed",
  15: "Ready To Deliver",
  16: "Verification Pending",
  17: "Location Not Found",
  18: "Address Not Found",
};

const ORDER_STATUS_LABELS = {
  1: "Pending",
  2: "Confirmed",
  3: "Completed",
  4: "Cancelled",
  5: "Refunded",
  12: "Cancelled",
};

// delivery_status_ids that mean the order is done successfully
const COMPLETED_DELIVERY_IDS = new Set([9, 14]);

// delivery_status_ids that mean the order is cancelled / failed
const CANCELLED_DELIVERY_IDS = new Set([10, 11, 12, 17, 18]);

// order_status_ids that mean cancelled
const CANCELLED_ORDER_IDS = new Set([4, 12]);

// order_status_ids that mean completed
const COMPLETED_ORDER_IDS = new Set([3]);

export function deliveryStatusLabel(id) {
  return DELIVERY_STATUS_LABELS[Number(id)] || `Status #${id}`;
}

export function orderStatusLabel(id) {
  return ORDER_STATUS_LABELS[Number(id)] || `Status #${id}`;
}

export function isCancelled(order) {
  return (
    CANCELLED_DELIVERY_IDS.has(Number(order.delivery_status_id)) ||
    CANCELLED_ORDER_IDS.has(Number(order.order_status_id))
  );
}

export function isDelivered(order) {
  return (
    COMPLETED_DELIVERY_IDS.has(Number(order.delivery_status_id)) ||
    COMPLETED_ORDER_IDS.has(Number(order.order_status_id))
  );
}

// Bucket an order into one of three tabs for the My Orders screen.
// Cancelled takes priority over completed.
export function orderTab(order) {
  if (isCancelled(order)) return "cancelled";
  if (isDelivered(order)) return "completed";
  return "pending";
}
