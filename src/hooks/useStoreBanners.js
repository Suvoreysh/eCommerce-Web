import { useEffect, useState } from "react";
import { bannerApi } from "../api/bannerApi";

/**
 * Loads banners per placement and splits into:
 *   topBanner        first active banner whose placement is in `topPlacements`
 *   exclusiveOffers  active "exclusive_offers" banners, in display order
 */
export default function useStoreBanners(topPlacements = ["all_products_top"]) {
  const [state, setState] = useState({
    topBanner: null,
    exclusiveOffers: [],
    loading: true,
  });

  const placementKey = topPlacements.join("|");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const placements = placementKey.split("|");

        const [topResults, offersResult] = await Promise.all([
          Promise.all(placements.map((p) => bannerApi.getBanners(p))),
          bannerApi.getBanners("exclusive_offers"),
        ]);

        if (!active) return;

        const filterActive = (banners) =>
          (Array.isArray(banners) ? banners : [])
            .filter((b) => b.status == null || Number(b.status) === 1)
            .sort(
              (a, b) =>
                Number(a.display_order || 0) - Number(b.display_order || 0),
            );

        const allTopBanners = topResults.flatMap((res) =>
          filterActive(Array.isArray(res?.data) ? res.data : []),
        );

        const offerBanners = filterActive(
          Array.isArray(offersResult?.data) ? offersResult.data : [],
        );

        setState({
          topBanner: allTopBanners[0] || null,
          exclusiveOffers: offerBanners.map((banner) => ({
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
