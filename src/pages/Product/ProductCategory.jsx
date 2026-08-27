import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import SearchBar from "../../components/SearchBar/SearchBar";
import StoreIntro from "../../components/StoreIntro/StoreIntro";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import FilterBar from "../../components/FilterBar/FilterBar";
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar";
import CategoryProductGrid from "../../components/CategoryProductGrid/CategoryProductGrid";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import OfferCards from "../../components/OfferCards/OfferCards";
import { productApi } from "../../api/productApi";
import "./ProductCategory.css";
import promo from "../../assets/images/promo.png";
import p1 from "../../assets/images/p1.png";
import p2 from "../../assets/images/p2.png";

// Normalizes a /variants (or /products) row into the shape
// CategoryProductGrid expects, tolerating a few different API shapes.
function normalizeProduct(row) {
  const product = row?.product || row;

  const id =
    product?.product_id ??
    product?.product?.id ??
    row?.product_id ??
    product?.id ??
    row?.id;

  const image =
    product?.image ??
    product?.product?.image ??
    row?.image ??
    row?.product?.image;

  const price =
    row?.price ??
    product?.price ??
    product?.price_min ??
    row?.price_min ??
    product?.price_max;

  const originalPrice =
    row?.mrp ?? product?.mrp ?? product?.old_price ?? row?.old_price ?? price;

  return {
    id,
    name: product?.name ?? row?.name ?? "Untitled product",
    price,
    originalPrice,
    image,
    tag1: product?.category?.name,
    tag2: product?.subcategory?.name,
    rating: Number(
      row?.average_rating ?? product?.average_rating ?? row?.rating ?? 0,
    ),
  };
}

// Applies the drawer's sort/price/rating selections client-side, since the
// API doesn't expose those as query params.
function applyFilters(list, filters) {
  let result = [...list];

  if (filters.price) {
    const ranges = {
      "Under ₹1,000": [0, 1000],
      "₹1,000 - 3,000": [1000, 3000],
      "Above - 5,000": [5000, Infinity],
    };
    const [min, max] = ranges[filters.price] || [0, Infinity];
    result = result.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= min && price <= max;
    });
  }

  if (filters.rating) {
    result = result.filter((p) => (p.rating || 0) >= filters.rating);
  }

  if (filters.sort === "Price : Low To High") {
    result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  } else if (filters.sort === "Price : High To Low") {
    result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  } else if (filters.sort === "New Collection") {
    result.sort((a, b) => (b.id || 0) - (a.id || 0));
  }
  // "Popular" / no sort selected: keep API's original order.

  return result;
}

export default function ProductCategory() {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedCategory = categoryId ? Number(categoryId) : null;

  const [categoryName, setCategoryName] = useState(
    location.state?.categoryName ?? "",
  );

  // Keep the displayed category name in sync with the URL/nav state on
  // every navigation, not just the first mount.
  useEffect(() => {
    if (location.state?.categoryName) {
      setCategoryName(location.state.categoryName);
    }
  }, [selectedCategory, location.state]);

  // All top-level categories, for the switcher row (independent from
  // FilterBar, which now only *displays* the active one).
  const [allCategories, setAllCategories] = useState([]);

  // Sidebar = SUBCATEGORIES of the current category (per the API), not the
  // top-level category list. Category switching happens from Home's
  // CategorySection or a breadcrumb, not from this sidebar.
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    location.state?.subcategoryId ?? null,
  );

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    price: null,
    rating: null,
  });

  // Resolve the category's display name (in case we arrived via a direct
  // link with no location.state) and load the full category list for the
  // switcher row.
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await productApi.getCategories();
        if (!isMounted) return;
        const data = Array.isArray(response?.data) ? response.data : [];
        setAllCategories(data);

        if (location.state?.categoryName) {
          // Trust the name passed in from wherever we navigated from.
          setCategoryName(location.state.categoryName);
        } else {
          const match = data.find((c) => c.id === selectedCategory);
          if (match) setCategoryName(match.name);
        }
      } catch (err) {
        console.error("Get categories failed:", err);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, location.state]);

  // Load subcategories for the sidebar.
  useEffect(() => {
    let isMounted = true;

    const fetchSubcategories = async () => {
      if (!selectedCategory) return;

      try {
        setSubcategoriesLoading(true);
        const response =
          await productApi.getCategorySubcategories(selectedCategory);
        if (!isMounted) return;

        const list = Array.isArray(response?.data) ? response.data : [];
        setSubcategories(list);

        // Pre-select whatever the dropdown chose (if any); otherwise
        // auto-select the first subcategory so the sidebar isn't left
        // with nothing highlighted and no products showing.
        setSelectedSubcategory(
          location.state?.subcategoryId ?? list[0]?.id ?? null,
        );
      } catch (err) {
        console.error("Get subcategories failed:", err);
        if (isMounted) setSubcategories([]);
      } finally {
        if (isMounted) setSubcategoriesLoading(false);
      }
    };

    fetchSubcategories();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, location.state]);

  // Load the variants (i.e. purchasable products) for the active
  // category/subcategory.
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      if (!selectedCategory) return;

      try {
        setProductsLoading(true);
        setError("");

        const response = await productApi.getVariants({
          categoryId: selectedCategory,
          subcategoryId: selectedSubcategory,
        });

        if (!isMounted) return;

        const rows = Array.isArray(response?.data) ? response.data : [];
        const normalized = rows.map(normalizeProduct).filter((p) => p.id);

        // Fall back to the general products list if this category has no
        // variants of its own yet.
        if (normalized.length === 0) {
          const fallback = await productApi.getAll();
          if (!isMounted) return;
          const fallbackRows = Array.isArray(fallback?.data)
            ? fallback.data
            : [];
          setProducts(fallbackRows.map(normalizeProduct).filter((p) => p.id));
        } else {
          setProducts(normalized);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Get category products failed:", err);
        setError(err.message || "Unable to load products.");
        setProducts([]);
      } finally {
        if (isMounted) setProductsLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSubcategory]);

  const filteredProducts = useMemo(
    () => applyFilters(products, activeFilters),
    [products, activeFilters],
  );

  const sidebarItems = useMemo(
    () =>
      subcategories.map((sub) => ({
        id: sub.id,
        label: sub.name,
        image: sub.image,
      })),
    [subcategories],
  );

  const activeTitle =
    subcategories.find((sub) => sub.id === selectedSubcategory)?.name ??
    location.state?.subcategoryName ??
    categoryName ??
    "Products";

  const exclusiveOffers = [
    { id: 1, image: p1, alt: "Featured offer" },
    { id: 2, image: p2, alt: "Featured offer" },
  ];

  return (
    <>
      <Navbar />
      <SearchBar />
      <StoreIntro />
      <PromoBanner image={promo} />
      <FilterBar
        onFiltersApply={setActiveFilters}
        categoryName={categoryName}
      />

      {/* {allCategories.length > 0 && (
        <div className="category-switcher">
          {allCategories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`category-switcher-chip ${
                category.id === selectedCategory ? "active" : ""
              }`}
              onClick={() =>
                navigate(`/category/${category.id}`, {
                  state: { categoryName: category.name },
                })
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      )} */}

      <div className="category-layout">
        <CategorySidebar
          items={sidebarItems}
          activeId={selectedSubcategory}
          loading={subcategoriesLoading}
          onSelect={(id) =>
            setSelectedSubcategory((prev) => (prev === id ? null : id))
          }
        />

        {productsLoading ? (
          <p style={{ textAlign: "center", padding: "40px 0", width: "100%" }}>
            Loading products...
          </p>
        ) : error ? (
          <p
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "red",
              width: "100%",
            }}
          >
            {error}
          </p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px 0", width: "100%" }}>
            No products match the selected filters.
          </p>
        ) : (
          <CategoryProductGrid
            title={activeTitle}
            products={filteredProducts}
          />
        )}
      </div>
      <OfferCards offers={exclusiveOffers} />
      <Footer />
    </>
  );
}
