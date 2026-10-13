import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import useCategoryBanners from "../../hooks/useCategoryBanners";
import { productApi } from "../../api/productApi";

import {
  applyProductFilters,
  loadCatalog,
  normalizeListResponse,
  searchProducts,
  toList,
} from "../../utils/catalog";

import CategoryProductGrid from "../../components/CategoryProductGrid/CategoryProductGrid";
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar";
import FilterBar from "../../components/FilterBar/FilterBar";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import StoreIntro from "../../components/StoreIntro/StoreIntro";

import "./ProductCategory.css";

const ALL_SUBCATEGORY_ID = "all";

export default function ProductCategory() {
  const { categoryId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  /* ============================================================
     URL DATA
  ============================================================ */

  const selectedCategory = categoryId ? Number(categoryId) : null;

  const query = searchParams.get("q") || "";

  const subFromUrl = searchParams.get("sub");

  /* ============================================================
     CATEGORY
  ============================================================ */

  const [categoryName, setCategoryName] = useState(
    location.state?.categoryName ?? "",
  );

  const [categoryImage, setCategoryImage] = useState(
    location.state?.categoryImage ?? "",
  );

  /* ============================================================
     SUBCATEGORIES
  ============================================================ */

  const [subcategories, setSubcategories] = useState([]);

  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subFromUrl ? Number(subFromUrl) : ALL_SUBCATEGORY_ID,
  );

  const [subcategoriesLoading, setSubcategoriesLoading] = useState(
    Boolean(selectedCategory),
  );

  /* ============================================================
     PRODUCTS
  ============================================================ */

  const [products, setProducts] = useState([]);

  const [productsLoading, setProductsLoading] = useState(true);

  const [error, setError] = useState("");

  /* ============================================================
     FILTERS
  ============================================================ */

  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    price: null,
    rating: null,
  });

  /* ============================================================
     BANNERS — /categories/{id}/banners
     slides = all banner images as carousel
     topBanner = first banner (title / subtitle for StoreIntro)
  ============================================================ */

  const {
    slides: bannerSlides,
    topBanner,
    loading: bannersLoading,
  } = useCategoryBanners(selectedCategory);

  /* ============================================================
     RESET SELECTED SUBCATEGORY WHEN CATEGORY CHANGES
  ============================================================ */

  useEffect(() => {
    setSelectedSubcategory(
      subFromUrl ? Number(subFromUrl) : ALL_SUBCATEGORY_ID,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  /* ============================================================
     GET CURRENT CATEGORY
  ============================================================ */

  useEffect(() => {
    if (query || !selectedCategory) {
      return undefined;
    }

    let active = true;

    const fetchCategory = async () => {
      try {
        const response = await productApi.getCategories();

        if (!active) return;

        const categories = toList(response?.data);

        const match = categories.find(
          (category) => Number(category.id) === selectedCategory,
        );

        setCategoryName(
          location.state?.categoryName || match?.name || "Products",
        );

        const image =
          location.state?.categoryImage ||
          match?.image ||
          match?.image_original ||
          match?.category_image ||
          match?.thumbnail ||
          "";

        setCategoryImage(image);
      } catch (err) {
        console.error("Get categories failed:", err);

        if (active) {
          setCategoryName(location.state?.categoryName || "Products");
          setCategoryImage(location.state?.categoryImage || "");
        }
      }
    };

    fetchCategory();

    return () => {
      active = false;
    };
  }, [
    selectedCategory,
    query,
    location.state?.categoryName,
    location.state?.categoryImage,
  ]);

  /* ============================================================
     GET SUBCATEGORIES
  ============================================================ */

  useEffect(() => {
    if (query || !selectedCategory) {
      return undefined;
    }

    let active = true;

    const fetchSubcategories = async () => {
      try {
        setSubcategoriesLoading(true);

        const response =
          await productApi.getCategorySubcategories(selectedCategory);

        if (!active) return;

        const data = toList(response?.data);

        setSubcategories(data);
      } catch (err) {
        console.error("Get subcategories failed:", err);

        if (active) {
          setSubcategories([]);
        }
      } finally {
        if (active) {
          setSubcategoriesLoading(false);
        }
      }
    };

    fetchSubcategories();

    return () => {
      active = false;
    };
  }, [selectedCategory, query]);

  /* ============================================================
     GET PRODUCTS
  ============================================================ */

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setProductsLoading(true);
      setError("");

      try {
        if (query) {
          const { products: catalogProducts } = await loadCatalog();
          if (!active) return;
          setProducts(searchProducts(catalogProducts, query));
          return;
        }

        if (!selectedCategory) {
          setProducts([]);
          return;
        }

        let response;

        if (selectedSubcategory === ALL_SUBCATEGORY_ID) {
          response = await productApi.getCategoryProducts(selectedCategory);
        } else {
          response =
            await productApi.getSubcategoryProducts(selectedSubcategory);
        }

        if (!active) return;

        const normalized = normalizeListResponse(response);
        setProducts(normalized.items);
      } catch (err) {
        if (!active) return;
        console.error("Get products failed:", err);
        setError(err.message || "Unable to load products.");
        setProducts([]);
      } finally {
        if (active) {
          setProductsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedSubcategory, query]);

  /* ============================================================
     SIDEBAR ITEMS
  ============================================================ */

  const sidebarItems = useMemo(() => {
    if (subcategories.length === 0) {
      return [];
    }

    return [
      {
        id: ALL_SUBCATEGORY_ID,
        label: "All",
        image: categoryImage,
      },
      ...subcategories.map((item) => ({
        id: item.id,
        label: item.name || item.label || "Subcategory",
        image:
          item.image ||
          item.image_original ||
          item.subcategory_image ||
          item.thumbnail ||
          categoryImage,
      })),
    ];
  }, [subcategories, categoryImage]);

  /* ============================================================
     SELECT SUBCATEGORY
  ============================================================ */

  const selectSubcategory = (id) => {
    setSelectedSubcategory(id);

    if (id === ALL_SUBCATEGORY_ID) {
      navigate(`/category/${selectedCategory}`, {
        replace: true,
        state: { categoryName, categoryImage },
      });
      return;
    }

    navigate(`/category/${selectedCategory}?sub=${id}`, {
      replace: true,
      state: { categoryName, categoryImage },
    });
  };

  /* ============================================================
     ACTIVE PAGE TITLE
  ============================================================ */

  const activeTitle = useMemo(() => {
    if (query) return `Results for "${query}"`;

    if (selectedSubcategory === ALL_SUBCATEGORY_ID) {
      return categoryName || "Products";
    }

    const selected = subcategories.find(
      (item) => String(item.id) === String(selectedSubcategory),
    );

    return selected?.name || categoryName || "Products";
  }, [query, selectedSubcategory, subcategories, categoryName]);

  /* ============================================================
     FILTER PRODUCTS
  ============================================================ */

  const displayProducts = useMemo(
    () => applyProductFilters(products, activeFilters),
    [products, activeFilters],
  );

  /* ============================================================
     STORE INTRO — title/subtitle from first category banner
  ============================================================ */

  const storeTitle = query
    ? "Search"
    : topBanner?.title || categoryName || "Store";

  const storeSubtitle =
    topBanner?.subtitle || topBanner?.description || undefined;

  /* ============================================================
     UI
  ============================================================ */

  return (
    <>
      <Navbar />

      <StoreIntro title={storeTitle} subtitle={storeSubtitle} />

      {!query && (
        <PromoBanner
          slides={bannerSlides}
          alt={topBanner?.title || categoryName || "Category banner"}
          loading={bannersLoading}
        />
      )}

      <div className="filter-bar-sticky-wrap">
        <FilterBar
          onFiltersApply={setActiveFilters}
          categoryName={query ? "" : categoryName}
        />
      </div>

      <div className="category-layout">
        {!query && (
          <CategorySidebar
            items={sidebarItems}
            activeId={selectedSubcategory}
            loading={subcategoriesLoading}
            onSelect={selectSubcategory}
            categoryImage={categoryImage}
          />
        )}

        {productsLoading ? (
          <p className="category-page-message">Loading products...</p>
        ) : error ? (
          <p className="category-page-message category-page-error">{error}</p>
        ) : (
          <CategoryProductGrid title={activeTitle} products={displayProducts} />
        )}
      </div>

      <Footer />
    </>
  );
}
