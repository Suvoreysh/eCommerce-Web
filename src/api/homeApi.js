import { apiRequest, ENDPOINTS } from "./config";

export const homeApi = {
  getHome: () =>
    apiRequest(ENDPOINTS.HOME, {
      auth: false,
    }),
};