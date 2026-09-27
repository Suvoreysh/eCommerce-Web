// api/productApi.js
import { apiRequest, ENDPOINTS, withQuery } from "./config";
import { cacheGet, cacheSet } from "../utils/apiCache";

// Public catalogue data: long TTL (5 min). Product detail/variants: 2 min.
const LONG_TTL    = 5 * 60_000;
const MEDIUM_TTL  = 2 * 60_000;

function cached(key, fetcher, ttl = LONG_TTL) {
  const hit = cacheGet(key);
  if (hit) return Promise.resolve(hit.data);
  return fetcher().then((data) => { cacheSet(key, data, { ttl }); return data; });
}

export const productApi = {
  getAll: (query = "") =>
    apiRequest(`${ENDPOINTS.PRODUCTS}${query}`, { auth: false }),

  getRelated: (id) =>
    cached(`product:related:${id}`, () =>
      apiRequest(ENDPOINTS.PRODUCT_RELATED(id), { auth: false }), MEDIUM_TTL),

  getFeaturedImageSections: (id) =>
    cached(`product:featured-image-sections:${id}`, () =>
      apiRequest(ENDPOINTS.PRODUCT_FEATURED_IMAGE_SECTIONS(id), { auth: false }), MEDIUM_TTL),

  getKeyPoints: (id) =>
    cached(`product:key-points:${id}`, () =>
      apiRequest(ENDPOINTS.PRODUCT_KEY_POINTS(id), { auth: false }), MEDIUM_TTL),

  getKeynoteSections: (id) =>
    cached(`product:keynote-sections:${id}`, () =>
      apiRequest(ENDPOINTS.PRODUCT_KEYNOTE_SECTIONS(id), { auth: false }), MEDIUM_TTL),

  getFeatured: (limit = 6) =>
    cached(`product:featured:${limit}`, () =>
      apiRequest(`${ENDPOINTS.PRODUCTS}?featured=1&limit=${limit}`, { auth: false }), LONG_TTL),

  getById: (id) =>
    cached(`product:detail:${id}`, () =>
      apiRequest(ENDPOINTS.PRODUCT_DETAIL(id), { auth: false }), MEDIUM_TTL),

  getProductVariants: (id) =>
    cached(`product:variants:${id}`, () =>
      apiRequest(ENDPOINTS.PRODUCT_VARIANTS(id), { auth: false }), MEDIUM_TTL),

  getCategories: () =>
    cached("categories", () =>
      apiRequest(ENDPOINTS.CATEGORIES, { auth: false }), LONG_TTL),

  getCategoryProducts: (categoryId, { page = 1 } = {}) => {
    const key = `category:products:${categoryId}:p${page}`;
    return cached(key, () =>
      apiRequest(
        withQuery(ENDPOINTS.CATEGORY_PRODUCTS(categoryId), { page: page > 1 ? page : undefined }),
        { auth: false },
      ), MEDIUM_TTL);
  },

  getSubcategoryProducts: (subcategoryId, { page = 1 } = {}) => {
    const key = `subcategory:products:${subcategoryId}:p${page}`;
    return cached(key, () =>
      apiRequest(
        withQuery(ENDPOINTS.SUBCATEGORY_PRODUCTS(subcategoryId), { page: page > 1 ? page : undefined }),
        { auth: false },
      ), MEDIUM_TTL);
  },

  getProductReviews: (id) =>
    cached(`product:reviews:${id}`, () =>
      apiRequest(ENDPOINTS.PRODUCT_REVIEWS(id), { auth: false }), MEDIUM_TTL),

  getCategorySubcategories: (categoryId) =>
    cached(`category:subcategories:${categoryId}`, () =>
      apiRequest(ENDPOINTS.CATEGORY_SUBCATEGORIES(categoryId), { auth: false }), LONG_TTL),

  getCategoryOffers: (categoryId) =>
    cached(`category:offers:${categoryId}`, () =>
      apiRequest(ENDPOINTS.CATEGORY_OFFERS(categoryId), { auth: false }), LONG_TTL),

  getFeatures: (id, section) =>
    cached(`product:features:${id}:${section || ""}`, () =>
      apiRequest(ENDPOINTS.PRODUCT_FEATURES(id, section), { auth: false }), MEDIUM_TTL),

  getSubcategories: () =>
    cached("subcategories", () =>
      apiRequest(ENDPOINTS.SUBCATEGORIES, { auth: false }), LONG_TTL),

  getSubcategoryDetail: (id) =>
    cached(`subcategory:detail:${id}`, () =>
      apiRequest(ENDPOINTS.SUBCATEGORY_DETAIL(id), { auth: false }), MEDIUM_TTL),

  getVariants: ({ categoryId, subcategoryId } = {}) => {
    const params = new URLSearchParams();
    if (categoryId)    params.append("category_id",    categoryId);
    if (subcategoryId) params.append("subcategory_id", subcategoryId);
    const qs  = params.toString();
    const key = `variants:${qs}`;
    return cached(key, () =>
      apiRequest(`${ENDPOINTS.VARIANTS}${qs ? `?${qs}` : ""}`, { auth: false }), LONG_TTL);
  },

  getVariantDetail: (id) =>
    cached(`variant:detail:${id}`, () =>
      apiRequest(ENDPOINTS.VARIANT_DETAIL(id), { auth: false }), MEDIUM_TTL),
};
