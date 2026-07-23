import { useParams } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import StoreIntro from "../../components/StoreIntro/StoreIntro";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import FilterBar from "../../components/FilterBar/FilterBar";
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar";
import CategoryProductGrid from "../../components/CategoryProductGrid/CategoryProductGrid";
import OfferCards from "../../components/OfferCards/OfferCards";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
// TODO: replace with a real fetch keyed on categoryId
const iphoneProducts = [
  {
    id: 301,
    name: "Product Name",
    price: "399",
    originalPrice: "499",
    image: "/assets/products/iphone-white-1.png",
  },
  {
    id: 302,
    name: "Product Name",
    price: "399",
    originalPrice: "499",
    image: "/assets/products/iphone-white-2.png",
  },
  // ...more
];

export default function ProductCategory() {
  const { categoryId } = useParams();

  return (
    <>
      <Navbar />
      <SearchBar />
      <StoreIntro />
      <PromoBanner image="/assets/products/promo-iphone-pro.png" />
      <FilterBar />

      <div className="category-layout">
        <CategorySidebar
          onSelect={(id) => console.log("switch category:", id)}
        />
        <CategoryProductGrid title="Iphone's" products={iphoneProducts} />
      </div>

      <OfferCards />
      <Footer />
    </>
  );
}
