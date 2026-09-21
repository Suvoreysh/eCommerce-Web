import { apiRequest, ENDPOINTS } from "./config";

export const opinionApi = {
  submit: (payload) =>
    apiRequest(ENDPOINTS.OPINION, {
      method: "POST",
      body: payload,
      auth: false,
    }),
};
