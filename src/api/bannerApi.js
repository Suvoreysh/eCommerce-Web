import { apiRequest, ENDPOINTS, withQuery } from "./config";
import { cacheGet, cacheSet } from "../utils/apiCache";

const TTL = 5 * 60_000;

export const bannerApi = {
  getBanners: (placement) => {
    const cacheKey = placement ? `banners:${placement}` : "banners";
    const hit = cacheGet(cacheKey);
    if (hit) return Promise.resolve(hit.data);
    const url = placement
      ? withQuery(ENDPOINTS.BANNERS, { placement })
      : ENDPOINTS.BANNERS;
    return apiRequest(url, { auth: false }).then((data) => {
      cacheSet(cacheKey, data, { ttl: TTL });
      return data;
    });
  },

  getCategoryBanners: (categoryId) => {
    const key = `category:banners:${categoryId}`;
    const hit = cacheGet(key);
    if (hit) return Promise.resolve(hit.data);
    return apiRequest(ENDPOINTS.CATEGORY_BANNERS(categoryId), {
      auth: false,
    }).then((data) => {
      cacheSet(key, data, { ttl: TTL });
      return data;
    });
  },

  getCategoryOffers: (categoryId) => {
    const key = `category:offers:${categoryId}`;
    const hit = cacheGet(key);
    if (hit) return Promise.resolve(hit.data);
    return apiRequest(ENDPOINTS.CATEGORY_OFFERS(categoryId), {
      auth: false,
    }).then((data) => {
      cacheSet(key, data, { ttl: TTL });
      return data;
    });
  },
};
