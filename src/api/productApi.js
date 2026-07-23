import { apiRequest, ENDPOINTS } from "./config";

export const productApi = {
  getAll: (query = "") => apiRequest(`${ENDPOINTS.PRODUCTS}${query}`, { auth: false }),
  getById: (id) => apiRequest(ENDPOINTS.PRODUCT_DETAIL(id), { auth: false }),
  getCategories: () => apiRequest(ENDPOINTS.CATEGORIES, { auth: false }),
};
// https://app.netlify.com/projects/ecom1123/overview