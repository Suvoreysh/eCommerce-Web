import { apiRequest, ENDPOINTS } from "./config";

export const authApi = {
  login: (payload) =>
    apiRequest(ENDPOINTS.LOGIN, {
      method: "POST",
      body: payload,
      auth: false,
    }),

  signup: (payload) =>
    apiRequest(ENDPOINTS.SIGNUP, {
      method: "POST",
      body: payload,
      auth: false,
    }),

  verifySignupOtp: (payload) =>
    apiRequest(ENDPOINTS.VERIFY_SIGNUP_OTP, {
      method: "POST",
      body: payload,
      auth: false,
    }),

  requestLoginOtp: (payload) =>
    apiRequest(ENDPOINTS.REQUEST_LOGIN_OTP, {
      method: "POST",
      body: payload,
      auth: false,
    }),

  verifyLoginOtp: (payload) =>
    apiRequest(ENDPOINTS.VERIFY_LOGIN_OTP, {
      method: "POST",
      body: payload,
      auth: false,
    }),

  resendOtp: (payload) =>
    apiRequest(ENDPOINTS.RESEND_OTP, {
      method: "POST",
      body: payload,
      auth: false,
    }),

  getProfile: () =>
    apiRequest(ENDPOINTS.PROFILE, {
      method: "GET",
    }),

  updateProfile: (payload) =>
    apiRequest(ENDPOINTS.PROFILE, {
      method: "PUT",
      body: payload,
    }),
};
