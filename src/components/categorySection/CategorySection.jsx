import { useEffect, useState } from "react";

import { productApi } from "../../api/productApi";
import "./CategorySection.css";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await productApi.getCategories();

        if (!isMounted) return;

        const categoryData = Array.isArray(response?.data) ? response.data : [];

        // Display only the first four categories
        setCategories(categoryData.slice(0, 4));
      } catch (err) {
        if (!isMounted) return;

        console.error("Category API error:", err);

        setError(err.message || "Unable to load categories.");
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

  return (
    <section className="category-section">
      <div className="category-inner">
        {loading && <p className="category-message">Loading categories...</p>}

        {!loading && error && (
          <p className="category-message category-error">{error}</p>
        )}

        {!loading &&
          !error &&
          categories.map((category) => (
            <div className="category-item" key={category.id}>
              <div className="category-circle">
                <img src={category.image} alt={category.name} loading="lazy" />
              </div>

              <span title={category.name}>{category.name}</span>
            </div>
          ))}

        {!loading && !error && categories.length === 0 && (
          <p className="category-message">No categories available.</p>
        )}
      </div>
    </section>
  );
}
