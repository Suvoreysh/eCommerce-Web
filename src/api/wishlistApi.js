import { apiRequest, ENDPOINTS } from "./config";

export const wishlistApi = {
  // GET /wishlist -> { items, current_page, last_page, total }
  getWishlist: (page = 1) =>
    apiRequest(`${ENDPOINTS.WISHLIST}${page > 1 ? `?page=${page}` : ""}`, {
      method: "GET",
    }),

  // POST /wishlist { product_id } -> { wishlist_id }
  addToWishlist: (productId) =>
    apiRequest(ENDPOINTS.WISHLIST, {
      method: "POST",
      body: { product_id: productId },
    }),

  // POST /wishlist/:productId with { "_method": "DELETE" } (method-override,
  // same pattern used by cartApi.removeItem)
  removeFromWishlist: (productId) =>
    apiRequest(ENDPOINTS.WISHLIST_ITEM(productId), {
      method: "POST",
      body: { _method: "DELETE" },
    }),

  // POST /wishlist/toggle { product_id } -> { in_wishlist }
  toggleWishlist: (productId) =>
    apiRequest(ENDPOINTS.WISHLIST_TOGGLE, {
      method: "POST",
      body: { product_id: productId },
    }),
};
