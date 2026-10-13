import { useEffect, useState } from "react";
import { bannerApi } from "../api/bannerApi";

export default function useCategoryBanners(categoryId) {
  const [state, setState] = useState({
    banners: [],
    slides: [],
    topBanner: null,
    loading: Boolean(categoryId),
  });

  useEffect(() => {
    if (!categoryId) {
      setState({ banners: [], slides: [], topBanner: null, loading: false });
      return undefined;
    }

    let active = true;
    setState((prev) => ({ ...prev, loading: true }));

    bannerApi
      .getCategoryBanners(categoryId)
      .then((data) => {
        if (!active) return;

        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

        const slides = list.map((b) => b?.image).filter(Boolean);
        const topBanner = list[0] ?? null;

        setState({ banners: list, slides, topBanner, loading: false });
      })
      .catch((err) => {
        console.error("useCategoryBanners error:", err);
        if (active) {
          setState({ banners: [], slides: [], topBanner: null, loading: false });
        }
      });

    return () => {
      active = false;
    };
  }, [categoryId]);

  return state;
}
