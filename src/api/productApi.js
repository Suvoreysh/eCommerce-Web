import { apiRequest, ENDPOINTS } from "./config";

export const productApi = {
  // Products (supports query string e.g. "?featured=1&limit=6")
  getAll: (query = "") =>
    apiRequest(`${ENDPOINTS.PRODUCTS}${query}`, {
      auth: false,
    }),

  getFeatured: (limit = 6) =>
    apiRequest(`${ENDPOINTS.PRODUCTS}?featured=1&limit=${limit}`, {
      auth: false,
    }),

  getById: (id) =>
    apiRequest(ENDPOINTS.PRODUCT_DETAIL(id), {
      auth: false,
    }),

  getProductVariants: (id) =>
    apiRequest(ENDPOINTS.PRODUCT_VARIANTS(id), {
      auth: false,
    }),

  // Categories
  getCategories: () =>
    apiRequest(ENDPOINTS.CATEGORIES, {
      auth: false,
    }),

  getCategorySubcategories: (categoryId) =>
    apiRequest(ENDPOINTS.CATEGORY_SUBCATEGORIES(categoryId), {
      auth: false,
    }),

  // Subcategories
  getSubcategories: () =>
    apiRequest(ENDPOINTS.SUBCATEGORIES, {
      auth: true,
    }),

  getSubcategoryDetail: (id) =>
    apiRequest(ENDPOINTS.SUBCATEGORY_DETAIL(id), {
      auth: false,
    }),

  // Variants
  getVariants: ({ categoryId, subcategoryId } = {}) => {
    const params = new URLSearchParams();
    if (categoryId) params.append("category_id", categoryId);
    if (subcategoryId) params.append("subcategory_id", subcategoryId);
    const qs = params.toString();
    return apiRequest(`${ENDPOINTS.VARIANTS}${qs ? `?${qs}` : ""}`, {
      auth: false,
    });
  },

  getVariantDetail: (id) =>
    apiRequest(ENDPOINTS.VARIANT_DETAIL(id), {
      auth: false,
    }),
};