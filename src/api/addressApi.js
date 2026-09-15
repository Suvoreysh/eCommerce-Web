import { apiRequest, ENDPOINTS } from "./config";

// All address endpoints require auth (a logged-in user's own address book),
// so every call below relies on apiRequest's default `auth: true` and the
// Bearer token config.js already attaches from localStorage("authToken").

export const addressApi = {
  // GET /addresses — list every saved address for the current user
  list: () => apiRequest(ENDPOINTS.ADDRESSES, { method: "GET" }),

  // GET /addresses/:id
  getById: (id) => apiRequest(ENDPOINTS.ADDRESS_DETAIL(id), { method: "GET" }),

  // GET /addresses/default
  getDefault: () => apiRequest(ENDPOINTS.ADDRESS_DEFAULT, { method: "GET" }),

  // POST /addresses
  create: (payload) =>
    apiRequest(ENDPOINTS.ADDRESSES, { method: "POST", body: payload }),

  // POST /addresses/:id/update — method-override style POST, matching the
  // set-default/delete endpoints rather than a real PUT/PATCH verb.
  update: (id, payload) =>
    apiRequest(ENDPOINTS.ADDRESS_UPDATE(id), { method: "POST", body: payload }),

  // POST /addresses/:id/set-default
  setDefault: (id) =>
    apiRequest(ENDPOINTS.ADDRESS_SET_DEFAULT(id), { method: "POST", body: {} }),

  // POST /addresses/:id/delete
  remove: (id) =>
    apiRequest(ENDPOINTS.ADDRESS_DELETE(id), { method: "POST", body: {} }),
};
