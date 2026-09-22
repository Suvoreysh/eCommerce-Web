import { useEffect, useMemo, useState, useCallback } from "react";
import {
  loadCatalog,
  searchCategories,
  searchProducts,
} from "../utils/catalog";

/**
 * Shared "type to find products/categories" logic used by both the
 * full-screen search modal (mobile) and the inline navbar search (desktop).
 */
export default function useCatalogSearch(query, { limit = 6 } = {}) {
  const [catalog, setCatalog] = useState({
    status: "loading",
    categories: [],
    products: [],
  });

  const fetchCatalog = useCallback((options) => {
    let cancelled = false;

    setCatalog((previous) => ({ ...previous, status: "loading" }));

    loadCatalog(options)
      .then((data) => {
        if (!cancelled) setCatalog({ status: "ready", ...data });
      })
      .catch((error) => {
        console.error("Load catalog failed:", error);
        if (!cancelled) {
          setCatalog({ status: "error", categories: [], products: [] });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => fetchCatalog(), [fetchCatalog]);

  const trimmed = query.trim();

  const productMatches = useMemo(
    () =>
      catalog.status === "ready" && trimmed
        ? searchProducts(catalog.products, trimmed)
        : [],
    [catalog, trimmed],
  );

  const categoryMatches = useMemo(
    () =>
      catalog.status === "ready" && trimmed
        ? searchCategories(catalog.categories, trimmed)
        : [],
    [catalog, trimmed],
  );

  return {
    status: catalog.status,
    categories: catalog.categories,
    trimmed,
    productMatches,
    categoryMatches,
    suggestions: productMatches.slice(0, limit),
    reload: () => fetchCatalog({ force: true }),
  };
}
