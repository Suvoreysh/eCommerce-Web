import { useCallback, useEffect, useRef, useState } from "react";
import { productApi } from "../api/productApi";
import { bannerApi } from "../api/bannerApi";
import { normalizeListResponse, toList } from "../utils/catalog";

/**
 * Store listing data: every category, the first few products of each, and
 * that category's offer banners. Categories load first; each category's
 * products/offers then load independently, so one failing category never
 * blanks the page and sections fill in as they arrive.
 */
export default function useCategorySections(limit = 4) {
  const [state, setState] = useState({
    status: "loading", // loading | ready | error
    error: "",
    categories: [],
    sections: {}, // categoryId -> { status, products, total, message, offers }
  });

  const runRef = useRef(0);

  const setSection = useCallback((categoryId, patch, run) => {
    if (run !== runRef.current) return;

    setState((previous) => ({
      ...previous,
      sections: {
        ...previous.sections,
        [categoryId]: { ...previous.sections[categoryId], ...patch },
      },
    }));
  }, []);

  const loadSection = useCallback(
    async (categoryId, run) => {
      setSection(categoryId, { status: "loading", message: "" }, run);

      const offersPromise = bannerApi
        .getCategoryOffers(categoryId)
        .then((response) => toList(response?.data))
        .catch(() => []);

      try {
        const response = await productApi.getCategoryProducts(categoryId);
        const { items, total } = normalizeListResponse(response);
        const offers = await offersPromise;

        setSection(
          categoryId,
          {
            status: "ready",
            products: items.slice(0, limit),
            total: total || items.length,
            offers,
          },
          run,
        );
      } catch (error) {
        console.error(`Get products for category ${categoryId} failed:`, error);
        const offers = await offersPromise;

        setSection(
          categoryId,
          {
            status: "error",
            products: [],
            offers,
            message: error?.message || "Unable to load products.",
          },
          run,
        );
      }
    },
    [limit, setSection],
  );

  const load = useCallback(async () => {
    const run = ++runRef.current;

    setState({ status: "loading", error: "", categories: [], sections: {} });

    try {
      const response = await productApi.getCategories();

      if (run !== runRef.current) return;

      const categories = toList(response?.data);

      setState({
        status: "ready",
        error: "",
        categories,
        sections: Object.fromEntries(
          categories.map((category) => [
            category.id,
            { status: "loading", products: [], total: 0, message: "" },
          ]),
        ),
      });

      await Promise.allSettled(
        categories.map((category) => loadSection(category.id, run)),
      );
    } catch (error) {
      if (run !== runRef.current) return;

      console.error("Get categories failed:", error);

      setState({
        status: "error",
        error: error?.message || "Unable to load the store.",
        categories: [],
        sections: {},
      });
    }
  }, [loadSection]);

  useEffect(() => {
    load();

    return () => {
      runRef.current += 1; // invalidate in-flight requests on unmount
    };
  }, [load]);

  const retrySection = useCallback(
    (categoryId) => loadSection(categoryId, runRef.current),
    [loadSection],
  );

  return { ...state, reload: load, retrySection };
}
