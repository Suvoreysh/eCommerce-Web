import { useEffect, useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { apiRequest, ENDPOINTS } from "../../api/config";
import "./CategoryScroller.css";

const SKELETON_COUNT = 4;

function SubcategoryImage({ category }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [category.image]);

  return (
    <div className="category-scroll-circle">
      {category.image && !loaded && !failed && (
        <span className="category-image-skeleton" aria-hidden="true" />
      )}

      {category.image && !failed && (
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          decoding="async"
          className={loaded ? "is-loaded" : ""}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function CategoryScroller() {
  const trackRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchSubcategories = async () => {
      try {
        const response = await apiRequest(ENDPOINTS.SUBCATEGORIES, {
          method: "GET",
          auth: false,
        });

        if (mounted) {
          setCategories(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Subcategories API error:", error);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSubcategories();

    return () => {
      mounted = false;
    };
  }, []);

  const scrollNext = () => {
    const track = trackRef.current;

    if (!track) return;

    const isAtEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    if (isAtEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    track.scrollBy({
      left: Math.max(280, track.clientWidth * 0.55),
      behavior: "smooth",
    });
  };

  if (!loading && categories.length === 0) return null;

  return (
    <section className="category-scroller">
      <div className="category-track" ref={trackRef}>
        {loading &&
          Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div
              className="category-scroll-item category-scroll-skeleton"
              key={`subcategory-skeleton-${index}`}
              aria-hidden="true"
            >
              <div className="category-scroll-circle" />
              <span />
            </div>
          ))}

        {!loading &&
          categories.map((category) => (
            <div className="category-scroll-item" key={category.id}>
              <SubcategoryImage category={category} />
              <span title={category.name}>{category.name}</span>
            </div>
          ))}
      </div>

      <button
        type="button"
        className="category-next-btn"
        onClick={scrollNext}
        aria-label="Show more subcategories"
      >
        <FiChevronRight />
      </button>
    </section>
  );
}
