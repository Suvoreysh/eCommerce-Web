import { useEffect, useState } from "react";
import { bannerApi } from "../api/bannerApi";

/**
 * Loads /banners once and splits it into the pieces the store screens use:
 *   topBanner        first active banner whose placement is in `topPlacements`
 *   exclusiveOffers  active "exclusive_offers" banners, in display order
 */
export default function useStoreBanners(topPlacements = ["all_products_top"]) {
  const [state, setState] = useState({
    topBanner: null,
    exclusiveOffers: [],
    loading: true,
  });

  // Placements are a tiny static list; join so the effect doesn't re-run on a
  // new array identity every render.
  const placementKey = topPlacements.join("|");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await bannerApi.getBanners();

        if (!active) return;

        const banners = (Array.isArray(response?.data) ? response.data : [])
          .filter(
            (banner) => banner.status == null || Number(banner.status) === 1,
          )
          .sort(
            (a, b) =>
              Number(a.display_order || 0) - Number(b.display_order || 0),
          );

        const placements = placementKey.split("|");

        setState({
          topBanner:
            banners.find((banner) => placements.includes(banner.placement)) ||
            null,
          exclusiveOffers: banners
            .filter((banner) => banner.placement === "exclusive_offers")
            .map((banner) => ({
              id: banner.id,
              image: banner.image,
              title: banner.title || "Exclusive offer",
            })),
          loading: false,
        });
      } catch (error) {
        console.error("Get banners failed:", error);

        if (active) {
          setState({ topBanner: null, exclusiveOffers: [], loading: false });
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [placementKey]);

  return state;
}
