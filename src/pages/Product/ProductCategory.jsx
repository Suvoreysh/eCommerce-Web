import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SearchBar from "../../components/SearchBar/SearchBar";
import StoreIntro from "../../components/StoreIntro/StoreIntro";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import FilterBar from "../../components/FilterBar/FilterBar";
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar";
import CategoryProductGrid from "../../components/CategoryProductGrid/CategoryProductGrid";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import OfferCards from "../../components/OfferCards/OfferCards";
import "./ProductCategory.css";
import promo from "../../assets/images/promo.png";
import p1 from "../../assets/images/p1.png";
import p2 from "../../assets/images/p2.png";
import p3 from "../../assets/images/p3.png";
const categoryProducts = {
  phones: {
    title: "Phones",
    products: [
      {
        id: 301,
        name: "iPhone 16 Pro Max",
        price: "1199",
        originalPrice: "1299",
        image: "/assets/products/iphone-white-1.png",
        tag1: "Apple Phone",
        tag2: "1 Year Warranty",
      },
      {
        id: 302,
        name: "iPhone 16 Pro",
        price: "999",
        originalPrice: "1099",
        image: "/assets/products/iphone-white-2.png",
        tag1: "Apple Phone",
        tag2: "1 Year Warranty",
      },
      {
        id: 303,
        name: "iPhone 15 Plus",
        price: "799",
        originalPrice: "899",
        image: "/assets/products/iphone-white-1.png",
        tag1: "Apple Phone",
        tag2: "1 Year Warranty",
      },
      {
        id: 304,
        name: "iPhone 15",
        price: "699",
        originalPrice: "799",
        image: "/assets/products/iphone-white-2.png",
        tag1: "Apple Phone",
        tag2: "1 Year Warranty",
      },
    ],
  },

  tablets: {
    title: "Tablets",
    products: [
      {
        id: 401,
        name: "iPad Pro 13-inch",
        price: "1099",
        originalPrice: "1199",
        image: "/assets/products/ipad-pro.png",
        tag1: "Apple Tablet",
        tag2: "1 Year Warranty",
      },
      {
        id: 402,
        name: "iPad Air 11-inch",
        price: "699",
        originalPrice: "799",
        image: "/assets/products/ipad-air.png",
        tag1: "Apple Tablet",
        tag2: "1 Year Warranty",
      },
      {
        id: 403,
        name: "iPad 10th Generation",
        price: "449",
        originalPrice: "499",
        image: "/assets/products/ipad-10.png",
        tag1: "Apple Tablet",
        tag2: "1 Year Warranty",
      },
      {
        id: 404,
        name: "iPad Mini",
        price: "599",
        originalPrice: "649",
        image: "/assets/products/ipad-mini.png",
        tag1: "Apple Tablet",
        tag2: "1 Year Warranty",
      },
    ],
  },

  airpods: {
    title: "AirPods",
    products: [
      {
        id: 501,
        name: "AirPods Pro",
        price: "249",
        originalPrice: "299",
        image: "/assets/products/airpods-pro.png",
        tag1: "Wireless Audio",
        tag2: "Noise Cancellation",
      },
      {
        id: 502,
        name: "AirPods 4",
        price: "179",
        originalPrice: "199",
        image: "/assets/products/airpods-4.png",
        tag1: "Wireless Audio",
        tag2: "Spatial Audio",
      },
      {
        id: 503,
        name: "AirPods Max",
        price: "549",
        originalPrice: "599",
        image: "/assets/products/airpods-max.png",
        tag1: "Over-Ear Audio",
        tag2: "Noise Cancellation",
      },
      {
        id: 504,
        name: "AirPods 3",
        price: "169",
        originalPrice: "199",
        image: "/assets/products/airpods-3.png",
        tag1: "Wireless Audio",
        tag2: "Spatial Audio",
      },
    ],
  },

  watches: {
    title: "Watches",
    products: [
      {
        id: 601,
        name: "Apple Watch Ultra 2",
        price: "799",
        originalPrice: "899",
        image: "/assets/products/watch-ultra.png",
        tag1: "Smart Watch",
        tag2: "Water Resistant",
      },
      {
        id: 602,
        name: "Apple Watch Series 10",
        price: "399",
        originalPrice: "449",
        image: "/assets/products/watch-series-10.png",
        tag1: "Smart Watch",
        tag2: "Health Tracking",
      },
      {
        id: 603,
        name: "Apple Watch SE",
        price: "249",
        originalPrice: "299",
        image: "/assets/products/watch-se.png",
        tag1: "Smart Watch",
        tag2: "Fitness Tracking",
      },
      {
        id: 604,
        name: "Apple Watch Series 9",
        price: "349",
        originalPrice: "399",
        image: "/assets/products/watch-series-9.png",
        tag1: "Smart Watch",
        tag2: "Health Tracking",
      },
    ],
  },

  accessories: {
    title: "Accessories",
    products: [
      {
        id: 701,
        name: "MagSafe Charger",
        price: "39",
        originalPrice: "49",
        image: "/assets/products/magsafe-charger.png",
        tag1: "Fast Charging",
        tag2: "Apple Certified",
      },
      {
        id: 702,
        name: "iPhone Silicone Case",
        price: "49",
        originalPrice: "59",
        image: "/assets/products/iphone-case.png",
        tag1: "Phone Protection",
        tag2: "MagSafe Support",
      },
      {
        id: 703,
        name: "USB-C Power Adapter",
        price: "29",
        originalPrice: "39",
        image: "/assets/products/usb-adapter.png",
        tag1: "Fast Charging",
        tag2: "Apple Certified",
      },
      {
        id: 704,
        name: "Magic Keyboard",
        price: "299",
        originalPrice: "349",
        image: "/assets/products/magic-keyboard.png",
        tag1: "iPad Accessory",
        tag2: "Backlit Keyboard",
      },
    ],
  },
};

export default function ProductCategory() {
  const { categoryId } = useParams();

  const validCategory = categoryProducts[categoryId] ? categoryId : "phones";

  const [selectedCategory, setSelectedCategory] = useState(validCategory);

  useEffect(() => {
    if (categoryId && categoryProducts[categoryId]) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  const selectedData =
    categoryProducts[selectedCategory] || categoryProducts.phones;
const exclusiveOffers = [
  { id: 1, image: p1, alt: "iPhone 17 Pro offer" },
  { id: 2, image: p2, alt: "MacBook Pro offer" },
];
  return (
    <>
      <Navbar />
      <SearchBar />
      <StoreIntro />
      <PromoBanner image={promo} />
      <FilterBar />

      <div className="category-layout">
        <CategorySidebar
          activeId={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <CategoryProductGrid
          title={selectedData.title}
          products={selectedData.products}
        />
      </div>
      <OfferCards offers={exclusiveOffers} />
      <Footer />
    </>
  );
}
