import { apiRequest, ENDPOINTS } from "./config";

export const bannerApi = {
  getBanners: () =>
    apiRequest(ENDPOINTS.BANNERS, {
      auth: false,
    }),

  // GET /categories/:id/offers -> { data: [{ id, image, title, ... }] }
  getCategoryOffers: (categoryId) =>
    apiRequest(ENDPOINTS.CATEGORY_OFFERS(categoryId), {
      auth: false,
    }),
};
