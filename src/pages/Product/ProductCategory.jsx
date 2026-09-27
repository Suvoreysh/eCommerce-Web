import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import useStoreBanners from "../../hooks/useStoreBanners";
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
import OfferCards from "../../components/OfferCards/OfferCards";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import SearchBar from "../../components/SearchBar/SearchBar";
import StoreIntro from "../../components/StoreIntro/StoreIntro";
import "./ProductCategory.css";

const ALL_SUBCATEGORY_ID = "all";

export default function ProductCategory() {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedCategory = categoryId ? Number(categoryId) : null;
  const query = searchParams.get("q") || "";
  const subFromUrl = searchParams.get("sub");

  const [categoryName, setCategoryName] = useState(
    location.state?.categoryName ?? "",
  );
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subFromUrl ? Number(subFromUrl) : ALL_SUBCATEGORY_ID,
  );
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(
    Boolean(selectedCategory),
  );

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    price: null,
    rating: null,
  });

  const { topBanner, exclusiveOffers, loading: bannersLoading } =
    useStoreBanners(["category_top", "all_products_top"]);

  // When the URL's category id changes, reset the sidebar selection unless
  // the URL itself names a subcategory (deep link from CategoryScroller).
  useEffect(() => {
    setSelectedSubcategory(subFromUrl ? Number(subFromUrl) : ALL_SUBCATEGORY_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  /* ---- category name + subcategory list (skipped in search mode) ---- */

  useEffect(() => {
    if (query || !selectedCategory) return undefined;

    let active = true;

    (async () => {
      try {
        const response = await productApi.getCategories();
        if (!active) return;

        const match = toList(response?.data).find(
          (category) => Number(category.id) === selectedCategory,
        );

        setCategoryName(location.state?.categoryName || match?.name || "Products");
      } catch (err) {
        console.error("Get categories failed:", err);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, query]);

  useEffect(() => {
    if (query || !selectedCategory) return undefined;

    let active = true;

    (async () => {
      try {
        setSubcategoriesLoading(true);
        const response = await productApi.getCategorySubcategories(selectedCategory);
        if (!active) return;
        setSubcategories(toList(response?.data));
      } catch {
        if (active) setSubcategories([]);
      } finally {
        if (active) setSubcategoriesLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [selectedCategory, query]);

  /* ---- products: category / subcategory / whole-catalogue search ---- */

  useEffect(() => {
    let active = true;

    (async () => {
      setProductsLoading(true);
      setError("");

      try {
        if (query) {
          // Search mode: query the cached whole-catalogue search index.
          const { products: catalogProducts } = await loadCatalog();
          if (!active) return;
          setProducts(searchProducts(catalogProducts, query));
          return;
        }

        if (!selectedCategory) {
          setProducts([]);
          return;
        }

        const response =
          selectedSubcategory === ALL_SUBCATEGORY_ID
            ? await productApi.getCategoryProducts(selectedCategory)
            : await productApi.getSubcategoryProducts(selectedSubcategory);

        if (!active) return;
        setProducts(normalizeListResponse(response).items);
      } catch (err) {
        if (!active) return;
        console.error("Get products failed:", err);
        setError(err.message || "Unable to load products.");
        setProducts([]);
      } finally {
        if (active) setProductsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedSubcategory, query]);

  const sidebarItems = useMemo(() => {
    if (subcategories.length === 0) return [];
    return [
      { id: ALL_SUBCATEGORY_ID, label: "All", image: null },
      ...subcategories.map((item) => ({
        id: item.id,
        label: item.name,
        image: item.image,
      })),
    ];
  }, [subcategories]);

  const selectSubcategory = (id) => {
    setSelectedSubcategory(id);
    if (id === ALL_SUBCATEGORY_ID) {
      navigate(`/category/${selectedCategory}`, { replace: true });
    } else {
      navigate(`/category/${selectedCategory}?sub=${id}`, { replace: true });
    }
  };

  const activeTitle = query
    ? `Results for “${query}”`
    : sidebarItems.find((item) => item.id === selectedSubcategory)?.label !==
        "All"
      ? subcategories.find((item) => item.id === selectedSubcategory)?.name ||
        categoryName ||
        "Products"
      : categoryName || "Products";

  const displayProducts = useMemo(
    () => applyProductFilters(products, activeFilters),
    [products, activeFilters],
  );

  const offersTitle = exclusiveOffers[0]?.title
    ? `Exclusive ${exclusiveOffers[0].title} Offers`
    : "Exclusive Offers";

  return (
    <>
      <Navbar />
      {/* <SearchBar /> */}
      <StoreIntro title={query ? "Search" : topBanner?.title || "Store"} />

      {!query && (
        <PromoBanner
          image={topBanner?.image}
          alt={topBanner?.title || "Category banner"}
          loading={bannersLoading}
        />
      )}

      {/* replace the bare <FilterBar /> with this */}
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

      {!query && (
        <OfferCards
          title={offersTitle}
          offers={exclusiveOffers}
          loading={bannersLoading}
        />
      )}

      <Footer />
    </>
  );
}
