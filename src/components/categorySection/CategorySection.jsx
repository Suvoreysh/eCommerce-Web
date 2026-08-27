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

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await homeApi.getHome();

        if (!isMounted) return;

        // /home response structure: response.data.categories
        const categoryData = response?.data?.categories ?? [];

        setCategories(
          Array.isArray(categoryData) ? categoryData.slice(0, 4) : [],
        );
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

  const openCategory = (category) => {
    navigate(`/category/${category.id}`, {
      state: {
        categoryName: category.name,
      },
    });
  };

  return (
    <section className="category-section">
      <div className="category-inner">
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

        {!loading && error && (
          <p className="category-message category-error" role="alert">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          categories.map((category) => (
            <button
              type="button"
              className="category-item"
              key={category.id}
              onClick={() => openCategory(category)}
              aria-label={`View ${category.name} category`}
            >
              <div className="category-circle">
                <img src={category.image} alt={category.name} loading="lazy" />
              </div>

              <span title={category.name}>{category.name}</span>
            </button>
          ))}

        {!loading && !error && categories.length === 0 && (
          <p className="category-message">No categories available.</p>
        )}
      </div>
    </section>
  );
}
