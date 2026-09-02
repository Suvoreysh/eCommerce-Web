import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { bannerApi } from "../../api/bannerApi";
import { productApi } from "../../api/productApi";
import CategoryProductGrid from "../../components/CategoryProductGrid/CategoryProductGrid";
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar";
import FilterBar from "../../components/FilterBar/FilterBar";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import OfferCards from "../../components/OfferCards/OfferCards";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import SearchBar from "../../components/SearchBar/SearchBar";
import StoreIntro from "../../components/StoreIntro/StoreIntro";
import "./ProductCategory.css";

function normalizeProduct(row) {
  const product = row?.product || row;
  return {
    id:
      product?.product_id ??
      product?.product?.id ??
      row?.product_id ??
      product?.id ??
      row?.id,
    name: product?.name ?? row?.name ?? "Untitled product",
    image:
      product?.image ??
      product?.product?.image ??
      row?.image ??
      row?.product?.image,
    price:
      row?.price ??
      product?.price ??
      product?.price_min ??
      row?.price_min ??
      product?.price_max,
    originalPrice:
      row?.mrp ??
      product?.mrp ??
      product?.old_price ??
      row?.old_price ??
      row?.price ??
      product?.price,
    tag1: product?.category?.name,
    tag2: product?.subcategory?.name,
    rating: Number(
      row?.average_rating ?? product?.average_rating ?? row?.rating ?? 0,
    ),
  };
}

function applyFilters(list, filters) {
  let result = [...list];
  const ranges = {
    "Under ₹1,000": [0, 1000],
    "₹1,000 - 3,000": [1000, 3000],
    "Above - 5,000": [5000, Infinity],
  };

  if (filters.price) {
    const [min, max] = ranges[filters.price] || [0, Infinity];
    result = result.filter((product) => {
      const price = Number(product.price) || 0;
      return price >= min && price <= max;
    });
  }
  if (filters.rating)
    result = result.filter((product) => product.rating >= filters.rating);
  if (filters.sort === "Price : Low To High")
    result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  if (filters.sort === "Price : High To Low")
    result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  if (filters.sort === "New Collection")
    result.sort((a, b) => (b.id || 0) - (a.id || 0));
  return result;
}

export default function ProductCategory() {
  const { categoryId } = useParams();
  const location = useLocation();
  const selectedCategory = Number(categoryId) || null;
  const [categoryName, setCategoryName] = useState(
    location.state?.categoryName ?? "",
  );
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    location.state?.subcategoryId ?? null,
  );
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    price: null,
    rating: null,
  });
  const [topBanner, setTopBanner] = useState(null);
  const [exclusiveOffers, setExclusiveOffers] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchBanners = async () => {
      try {
        setBannersLoading(true);
        const response = await bannerApi.getBanners();
        if (!active) return;
        const banners = (Array.isArray(response?.data) ? response.data : [])
          .filter(
            (banner) => banner.status == null || Number(banner.status) === 1,
          )
          .sort((a, b) => Number(a.display_order) - Number(b.display_order));

        setTopBanner(
          banners.find((banner) =>
            ["category_top", "all_products_top"].includes(banner.placement),
          ) || null,
        );
        setExclusiveOffers(
          banners
            .filter((banner) => banner.placement === "exclusive_offers")
            .map((banner) => ({
              id: banner.id,
              image: banner.image,
              alt: banner.title || "Exclusive offer",
            })),
        );
      } catch (err) {
        console.error("Get category banners failed:", err);
        if (active) {
          setTopBanner(null);
          setExclusiveOffers([]);
        }
      } finally {
        if (active) setBannersLoading(false);
      }
    };
    fetchBanners();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadCategory = async () => {
      try {
        const response = await productApi.getCategories();
        if (!active) return;
        const match = (response?.data || []).find(
          (category) => Number(category.id) === selectedCategory,
        );
        setCategoryName(
          location.state?.categoryName || match?.name || "Products",
        );
      } catch (err) {
        console.error("Get categories failed:", err);
      }
    };
    loadCategory();
    return () => {
      active = false;
    };
  }, [selectedCategory, location.state]);

  useEffect(() => {
    let active = true;
    const loadSubcategories = async () => {
      if (!selectedCategory) return;
      try {
        setSubcategoriesLoading(true);
        const response =
          await productApi.getCategorySubcategories(selectedCategory);
        if (!active) return;
        const list = Array.isArray(response?.data) ? response.data : [];
        setSubcategories(list);
        setSelectedSubcategory(
          location.state?.subcategoryId ?? list[0]?.id ?? null,
        );
      } catch (err) {
        if (active) setSubcategories([]);
      } finally {
        if (active) setSubcategoriesLoading(false);
      }
    };
    loadSubcategories();
    return () => {
      active = false;
    };
  }, [selectedCategory, location.state]);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      if (!selectedCategory) return;
      try {
        setProductsLoading(true);
        setError("");
        const response = await productApi.getVariants({
          categoryId: selectedCategory,
          subcategoryId: selectedSubcategory,
        });
        if (!active) return;
        setProducts(
          (Array.isArray(response?.data) ? response.data : [])
            .map(normalizeProduct)
            .filter((product) => product.id),
        );
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load products.");
          setProducts([]);
        }
      } finally {
        if (active) setProductsLoading(false);
      }
    };
    loadProducts();
    return () => {
      active = false;
    };
  }, [selectedCategory, selectedSubcategory]);

  const sidebarItems = useMemo(
    () =>
      subcategories.map((item) => ({
        id: item.id,
        label: item.name,
        image: item.image,
      })),
    [subcategories],
  );
  const activeTitle =
    subcategories.find((item) => item.id === selectedSubcategory)?.name ||
    categoryName ||
    "Products";
  const filteredProducts = useMemo(
    () => applyFilters(products, activeFilters),
    [products, activeFilters],
  );
  const offersTitle = exclusiveOffers[0]?.alt
    ? `Exclusive ${exclusiveOffers[0].alt} Offers`
    : "Exclusive Offers";

  return (
    <>
      <Navbar />
      <SearchBar />
      <StoreIntro title={topBanner?.title || "Store"} />
      <PromoBanner
        image={topBanner?.image}
        alt={topBanner?.title || "Category banner"}
        loading={bannersLoading}
      />
      <FilterBar
        onFiltersApply={setActiveFilters}
        categoryName={categoryName}
      />
      <div className="category-layout">
        <CategorySidebar
          items={sidebarItems}
          activeId={selectedSubcategory}
          loading={subcategoriesLoading}
          onSelect={setSelectedSubcategory}
        />
        {productsLoading ? (
          <p className="category-page-message">Loading products...</p>
        ) : error ? (
          <p className="category-page-message category-page-error">{error}</p>
        ) : (
          <CategoryProductGrid
            title={activeTitle}
            products={filteredProducts}
          />
        )}
      </div>
      <OfferCards
        title={offersTitle}
        offers={exclusiveOffers}
        loading={bannersLoading}
      />
      <Footer />
    </>
  );
}
