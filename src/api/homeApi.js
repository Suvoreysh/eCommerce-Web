import { apiRequest, ENDPOINTS } from "./config";
import { cacheGet, cacheSet } from "../utils/apiCache";

const TTL = 5 * 60_000;

export const homeApi = {
  getHome: () => {
    const hit = cacheGet("home");
    if (hit) return Promise.resolve(hit.data);
    return apiRequest(ENDPOINTS.HOME, { auth: false }).then((data) => {
      cacheSet("home", data, { ttl: TTL });
      return data;
    });
  },
};
