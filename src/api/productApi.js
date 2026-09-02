// api/productApi.js
import { apiRequest, ENDPOINTS } from "./config";

export const productApi = {
  getAll: (query = "") =>
    apiRequest(`${ENDPOINTS.PRODUCTS}${query}`, {
      auth: false,
    }),
  getRelated: (id) =>
    apiRequest(ENDPOINTS.PRODUCT_RELATED(id), {
      auth: false,
    }),
  getFeaturedImageSections: (id) =>
    apiRequest(ENDPOINTS.PRODUCT_FEATURED_IMAGE_SECTIONS(id), {
      auth: false,
    }),
  getKeyPoints: (id) =>
    apiRequest(ENDPOINTS.PRODUCT_KEY_POINTS(id), {
      auth: false,
    }),
  getKeynoteSections: (id) =>
    apiRequest(ENDPOINTS.PRODUCT_KEYNOTE_SECTIONS(id), {
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

  getCategories: () =>
    apiRequest(ENDPOINTS.CATEGORIES, {
      auth: false,
    }),
  getProductReviews: (id) =>
    apiRequest(ENDPOINTS.PRODUCT_REVIEWS(id), {
      auth: false,
    }),
  getCategorySubcategories: (categoryId) =>
    apiRequest(ENDPOINTS.CATEGORY_SUBCATEGORIES(categoryId), {
      auth: false,
    }),
  // add to api/productApi.js
  getFeatures: (id, section) =>
    apiRequest(ENDPOINTS.PRODUCT_FEATURES(id, section), {
      auth: false,
    }),
  getSubcategories: () =>
    apiRequest(ENDPOINTS.SUBCATEGORIES, {
      auth: true,
    }),

  getSubcategoryDetail: (id) =>
    apiRequest(ENDPOINTS.SUBCATEGORY_DETAIL(id), {
      auth: false,
    }),

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
