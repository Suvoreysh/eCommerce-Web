import { apiRequest, ENDPOINTS } from "./config";

export const bannerApi = {
  getBanners: () =>
    apiRequest(ENDPOINTS.BANNERS, {
      auth: false,
    }),
};