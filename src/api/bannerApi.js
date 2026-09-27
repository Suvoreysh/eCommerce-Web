import { apiRequest, ENDPOINTS } from "./config";
import { cacheGet, cacheSet } from "../utils/apiCache";

const TTL = 5 * 60_000;

export const bannerApi = {
  getBanners: () => {
    const hit = cacheGet("banners");
    if (hit) return Promise.resolve(hit.data);
    return apiRequest(ENDPOINTS.BANNERS, { auth: false }).then((data) => {
      cacheSet("banners", data, { ttl: TTL });
      return data;
    });
  },

  getCategoryOffers: (categoryId) => {
    const key = `category:offers:${categoryId}`;
    const hit = cacheGet(key);
    if (hit) return Promise.resolve(hit.data);
    return apiRequest(ENDPOINTS.CATEGORY_OFFERS(categoryId), { auth: false }).then((data) => {
      cacheSet(key, data, { ttl: TTL });
      return data;
    });
  },
};
