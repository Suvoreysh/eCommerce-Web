import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { homeApi } from "../../api/homeApi";
import "./CategorySection.css";

const SKELETON_COUNT = 4;

export default function CategorySection() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageStatus, setImageStatus] = useState({});

  /* ==========================================
     FETCH CATEGORIES
  ========================================== */

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await homeApi.getHome();

        if (!isMounted) return;

        const categoryData = response?.data?.categories ?? [];

        setCategories(
          Array.isArray(categoryData) ? categoryData.slice(0, 4) : [],
        );

        setImageStatus({});
      } catch (err) {
        if (!isMounted) return;

        console.error("Home API error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load categories.",
        );

        setCategories([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ==========================================
     CATEGORY NAVIGATION
  ========================================== */

  const openCategory = (category) => {
    navigate(`/category/${category.id}`, {
      state: {
        categoryName: category.name,
      },
    });
  };

  /* ==========================================
     IMAGE HANDLERS
  ========================================== */

  const handleImageLoad = (categoryKey) => {
    setImageStatus((previousStatus) => ({
      ...previousStatus,
      [categoryKey]: "loaded",
    }));
  };

  const handleImageError = (categoryKey) => {
    setImageStatus((previousStatus) => ({
      ...previousStatus,
      [categoryKey]: "error",
    }));
  };

  return (
    <section className="category-section">
      <div className="category-inner">
        {/* API loading skeletons */}

        {loading &&
          Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div
              className="category-item category-skeleton"
              key={`category-skeleton-${index}`}
              aria-hidden="true"
            >
              <div className="category-circle skeleton-circle" />
              <div className="skeleton-name" />
            </div>
          ))}

        {/* API error */}

        {!loading && error && (
          <p className="category-message category-error" role="alert">
            {error}
          </p>
        )}

        {/* Categories */}

        {!loading &&
          !error &&
          categories.map((category, index) => {
            const categoryKey = category.id ?? `category-${index}`;
            const status = imageStatus[categoryKey];
            const isImageLoaded = status === "loaded";
            const hasImageError = status === "error";

            return (
              <button
                type="button"
                className="category-item"
                key={categoryKey}
                onClick={() => openCategory(category)}
                aria-label={`View ${category.name} category`}
              >
                <div
                  className={`category-circle ${
                    isImageLoaded ? "image-loaded" : ""
                  } ${hasImageError ? "image-error" : ""}`}
                >
                  {!isImageLoaded && !hasImageError && (
                    <div className="category-image-skeleton" aria-hidden="true">
                      <div className="category-image-shimmer" />
                    </div>
                  )}

                  {!hasImageError && category.image && (
                    <img
                      src={category.image}
                      alt={category.name || "Category"}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => handleImageLoad(categoryKey)}
                      onError={() => handleImageError(categoryKey)}
                    />
                  )}

                  {(hasImageError || !category.image) && (
                    <span
                      className="category-image-fallback"
                      aria-hidden="true"
                    >
                      {category.name?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  )}
                </div>

                <span className="category-name" title={category.name}>
                  {category.name}
                </span>
              </button>
            );
          })}

        {/* Empty categories */}

        {!loading && !error && categories.length === 0 && (
          <p className="category-message">No categories available.</p>
        )}
      </div>
    </section>
  );
}
