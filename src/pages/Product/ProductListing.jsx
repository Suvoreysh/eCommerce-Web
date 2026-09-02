import { useEffect, useState } from "react";
import { bannerApi } from "../../api/bannerApi";
import SearchBar from "../../components/SearchBar/SearchBar";
import StoreIntro from "../../components/StoreIntro/StoreIntro";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import CategoryScroller from "../../components/CategoryScroller/CategoryScroller";
import OfferCards from "../../components/OfferCards/OfferCards";
import SaleProductGrid from "../../components/SaleProductGrid/SaleProductGrid";
import TaglineBanner from "../../components/TaglineBanner/TaglineBanner";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/navbar/Navbar";

const macbookAirProducts = [
  {
    id: 101,
    name: "MacBook Air 13” and 15”",
    price: "₹7,29,900",
    chip: "M5 chip",
    desc: "Thin. Fast. Powerful and portable.",
    image: "/assets/products/macbook-air.png",
    onSale: true,
    ctaLabel: "View More",
  },
];
const iphoneProducts = [
  {
    id: 201,
    name: "Iphone 17 pro Cosmic Orange",
    price: "₹7,29,900",
    chip: "",
    desc: "Thin. Fast. Powerful and portable.",
    image: "/assets/products/iphone-orange.png",
    onSale: true,
    ctaLabel: "Add to Cart",
  },
];

export default function ProductListing() {
  const [topBanner, setTopBanner] = useState(null);
  const [exclusiveOffers, setExclusiveOffers] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchBanners = async () => {
      try {
        const response = await bannerApi.getBanners();
        const banners = Array.isArray(response?.data) ? response.data : [];
        const sorted = [...banners].sort(
          (a, b) => Number(a.display_order || 0) - Number(b.display_order || 0),
        );
        if (!mounted) return;
        setTopBanner(
          sorted.find((banner) => banner.placement === "all_products_top") ||
            null,
        );
        setExclusiveOffers(
          sorted.filter((banner) => banner.placement === "exclusive_offers"),
        );
      } catch (error) {
        console.error("Banners API error:", error);
      } finally {
        if (mounted) setLoadingBanners(false);
      }
    };
    fetchBanners();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <SearchBar />
      <StoreIntro
        title="Store"
        subtitle={
          topBanner?.title || "The Best location to buy the product you loved."
        }
      />
      <PromoBanner
        image={topBanner?.image}
        alt={topBanner?.title || "Top store banner"}
        loading={loadingBanners}
      />
      <CategoryScroller />
      <OfferCards
        title={exclusiveOffers[0]?.title || "Exclusive Apple Offers"}
        offers={exclusiveOffers}
        loading={loadingBanners}
      />
      <SaleProductGrid
        title="MacBook Air 13” and 15”"
        products={macbookAirProducts}
      />
      <SaleProductGrid title="Iphone 17 pro" products={iphoneProducts} />
      <TaglineBanner />
      <Footer />
    </>
  );
}
