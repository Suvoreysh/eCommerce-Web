import SearchBar from "../../components/SearchBar/SearchBar";
import StoreIntro from "../../components/StoreIntro/StoreIntro";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import CategoryScroller from "../../components/CategoryScroller/CategoryScroller";
import OfferCards from "../../components/OfferCards/OfferCards";
import SaleProductGrid from "../../components/SaleProductGrid/SaleProductGrid";
import TaglineBanner from "../../components/TaglineBanner/TaglineBanner";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

import p1 from "../../assets/images/p1.png";
import p2 from "../../assets/images/p2.png";
import p3 from "../../assets/images/p3.png";

// TODO: replace with real data via apiRequest()
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
  {
    id: 102,
    name: "MacBook Air 13” and 15”",
    price: "₹7,29,900",
    chip: "M5 chip",
    desc: "Thin. Fast. Powerful and portable.",
    image: "/assets/products/macbook-air.png",
    onSale: true,
    ctaLabel: "Add to Cart",
  },
  // ...more
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
  // ...more
];

// Offer banners are plain designed images — p1 (top hero) and p2 (exclusive offers row)
const exclusiveOffers = [
  { id: 1, image: p1, alt: "iPhone 17 Pro offer" },
  { id: 2, image: p2, alt: "MacBook Pro offer" },
];

export default function ProductListing() {
  return (
    <>
      <Navbar />
      <SearchBar />
      <StoreIntro />
      <PromoBanner image={p3} alt="iPhone 17 Pro" />
      <CategoryScroller />
      <OfferCards offers={exclusiveOffers} />
      <SaleProductGrid
        title="MacBook Air 13” and 15”"
        products={macbookAirProducts}
      />
      <SaleProductGrid title="Iphone 17 pro" products={iphoneProducts} />
      <PromoBanner image={p3} alt="iPhone 17 Pro" />
      <TaglineBanner />
      <Footer />
    </>
  );
}
