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

  // POST /forgot-password { email_id }
  forgotPassword: (payload) =>
    apiRequest(ENDPOINTS.FORGOT_PASSWORD, {
      method: "POST",
      body: payload,
      auth: false,
    }),

  changePassword: (payload) =>
    apiRequest(ENDPOINTS.CHANGE_PASSWORD, {
      method: "POST",
      body: payload,
    }),
};

// Separate export so Profile.jsx can use it directly (multipart, no JSON header)
export async function uploadProfileImageRequest(file) {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");

  const form = new FormData();
  form.append("image", file);

  const { BASE_URL } = await import("./config");
  const res = await fetch(`${BASE_URL}/profile/image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  let json = null;
  try { json = await res.json(); } catch { /* empty */ }

  if (!res.ok) {
    throw new Error(json?.message || json?.error || `Upload failed (${res.status})`);
  }
  return json;
}
