import { productApi } from "../api/productApi";
import { toNumber } from "./format";

/* ==========================================================================
   Normalisation
   ========================================================================== */

export const toList = (value) => (Array.isArray(value) ? value : []);

/**
 * Row shape returned by
 *   GET /categories/:id/products
 *   GET /subcategories/:id/products
 * { id, name, image, category_id, category_name, subcategory_id,
 *   subcategory_name, price_min, price_max }
 */
export function normalizeListProduct(row) {
  const priceMin = toNumber(row?.price_min);
  const priceMax = toNumber(row?.price_max);

  return {
    id: row?.id ?? row?.product_id ?? null,
    name: row?.name || "Untitled product",
    image: row?.image || "",
    categoryId: row?.category_id ?? null,
    categoryName: row?.category_name || "",
    subcategoryId: row?.subcategory_id ?? null,
    subcategoryName: row?.subcategory_name || "",
    priceMin: priceMin ?? priceMax,
    priceMax: priceMax ?? priceMin,
    rating: toNumber(row?.average_rating) ?? 0,
  };
}

export function normalizeListResponse(response) {
  const meta = response?.meta || {};

  return {
    items: toList(response?.data)
      .map(normalizeListProduct)
      .filter((product) => product.id !== null),
    page: Number(meta.current_page) || 1,
    lastPage: Number(meta.last_page) || 1,
    total: Number(meta.total) || 0,
  };
}

/* ==========================================================================
   Filtering (FilterDrawer options)
   ========================================================================== */

const PRICE_RANGES = {
  "Under ₹1,000": [0, 1000],
  "₹1,000 - 3,000": [1000, 3000],
  "Above - 5,000": [5000, Infinity],
};

export function applyProductFilters(list, filters = {}) {
  let result = [...list];

  if (filters.price && PRICE_RANGES[filters.price]) {
    const [rangeMin, rangeMax] = PRICE_RANGES[filters.price];

    // A product matches when any of its variant prices falls in the range.
    result = result.filter((product) => {
      const low = product.priceMin ?? 0;
      const high = product.priceMax ?? low;
      return high >= rangeMin && low <= rangeMax;
    });
  }

  // The list endpoints don't return ratings, so only filter by rating when
  // the data actually carries it — otherwise every product would disappear.
  if (filters.rating && result.some((product) => product.rating > 0)) {
    result = result.filter((product) => product.rating >= filters.rating);
  }

  const price = (product) => product.priceMin ?? 0;

  if (filters.sort === "Price : Low To High") {
    result.sort((a, b) => price(a) - price(b));
  } else if (filters.sort === "Price : High To Low") {
    result.sort((a, b) => price(b) - price(a));
  } else if (filters.sort === "New Collection") {
    result.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return result;
}

/* ==========================================================================
   Whole-catalogue loader (powers search)

   Built from /categories + every /categories/:id/products page, because
   those responses are the ones that carry category + subcategory names.
   Cached for the session so opening the search modal is instant after the
   first load.
   ========================================================================== */

const CATALOG_TTL_MS = 5 * 60 * 1000;
const MAX_PAGES_PER_CATEGORY = 10;

let catalogCache = { at: 0, promise: null };

async function fetchEveryCategoryProduct(categoryId) {
  const first = await productApi.getCategoryProducts(categoryId);
  const items = normalizeListResponse(first).items;
  const lastPage = Math.min(
    Number(first?.meta?.last_page) || 1,
    MAX_PAGES_PER_CATEGORY,
  );

  if (lastPage <= 1) return items;

  const remaining = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) =>
      productApi
        .getCategoryProducts(categoryId, { page: index + 2 })
        .then((response) => normalizeListResponse(response).items)
        .catch(() => []),
    ),
  );

  return [...items, ...remaining.flat()];
}

export function loadCatalog({ force = false } = {}) {
  const isFresh =
    catalogCache.promise && Date.now() - catalogCache.at < CATALOG_TTL_MS;

  if (isFresh && !force) return catalogCache.promise;

  const promise = (async () => {
    const response = await productApi.getCategories();
    const categories = toList(response?.data).map((category) => ({
      id: category.id,
      name: category.name || "",
      image: category.image || "",
    }));

    const settled = await Promise.allSettled(
      categories.map((category) => fetchEveryCategoryProduct(category.id)),
    );

    if (categories.length > 0 && settled.every((r) => r.status === "rejected")) {
      throw settled[0].reason || new Error("Unable to load products.");
    }

    const seen = new Set();
    const products = [];

    settled.forEach((result) => {
      if (result.status !== "fulfilled") return;

      result.value.forEach((product) => {
        if (seen.has(product.id)) return;
        seen.add(product.id);
        products.push(product);
      });
    });

    return { categories, products };
  })();

  catalogCache = { at: Date.now(), promise };

  // Never cache a failure — the next open should retry.
  promise.catch(() => {
    if (catalogCache.promise === promise) {
      catalogCache = { at: 0, promise: null };
    }
  });

  return promise;
}

/* ==========================================================================
   Search
   ========================================================================== */

const fold = (value) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

export function tokenize(query) {
  return fold(query).split(/\s+/).filter(Boolean);
}

function scoreProduct(product, tokens) {
  const name = fold(product.name);
  const subcategory = fold(product.subcategoryName);
  const category = fold(product.categoryName);
  let total = 0;

  for (const token of tokens) {
    let score = 0;

    if (name === token) score = 100;
    else if (name.startsWith(token)) score = 80;
    else if (name.includes(` ${token}`)) score = 60;
    else if (name.includes(token)) score = 40;
    else if (subcategory.includes(token)) score = 20;
    else if (category.includes(token)) score = 10;

    // Every word typed must match somewhere.
    if (score === 0) return 0;

    total += score;
  }

  return total;
}

export function searchProducts(products, query) {
  const tokens = tokenize(query);

  if (tokens.length === 0) return [];

  return products
    .map((product) => ({ product, score: scoreProduct(product, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.product.name.localeCompare(b.product.name),
    )
    .map((entry) => entry.product);
}

export function searchCategories(categories, query) {
  const tokens = tokenize(query);

  if (tokens.length === 0) return [];

  return categories.filter((category) => {
    const name = fold(category.name);
    return tokens.every((token) => name.includes(token));
  });
}

/* ==========================================================================
   Subcategory -> parent category
   ========================================================================== */

const subcategoryParents = new Map();

const pickCategoryId = (source) =>
  source?.category_id ??
  source?.categoryId ??
  (typeof source?.category === "object" ? source.category?.id : undefined) ??
  null;

/**
 * Finds the category a subcategory belongs to so we can land on
 * /category/:categoryId?sub=:subcategoryId.
 *   1. the list row itself, if it carries category_id
 *   2. GET /subcategories/:id
 *   3. scan every category's subcategories
 */
export async function resolveSubcategoryCategoryId(subcategory) {
  const subcategoryId = subcategory?.id;

  if (subcategoryId === undefined || subcategoryId === null) {
    throw new Error("This subcategory is unavailable.");
  }

  const direct = pickCategoryId(subcategory);
  if (direct !== null) return direct;

  if (subcategoryParents.has(String(subcategoryId))) {
    return subcategoryParents.get(String(subcategoryId));
  }

  try {
    const detail = await productApi.getSubcategoryDetail(subcategoryId);
    const found = pickCategoryId(detail?.data ?? detail);

    if (found !== null) {
      subcategoryParents.set(String(subcategoryId), found);
      return found;
    }
  } catch {
    // fall through to the category scan
  }

  const categoriesResponse = await productApi.getCategories();
  const categories = toList(categoriesResponse?.data);

  const lookups = await Promise.all(
    categories.map((category) =>
      productApi
        .getCategorySubcategories(category.id)
        .then((response) => ({
          categoryId: category.id,
          subcategories: toList(response?.data),
        }))
        .catch(() => ({ categoryId: category.id, subcategories: [] })),
    ),
  );

  const match = lookups.find((entry) =>
    entry.subcategories.some((item) => String(item.id) === String(subcategoryId)),
  );

  if (!match) {
    throw new Error("Couldn't find the category for this subcategory.");
  }

  subcategoryParents.set(String(subcategoryId), match.categoryId);
  return match.categoryId;
}
