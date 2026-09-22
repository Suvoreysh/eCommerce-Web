import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

import { productApi } from "../../api/productApi";
import {
  resolveSubcategoryCategoryId,
  toList,
} from "../../utils/catalog";
import LazyImage from "../common/LazyImage";
import "./CategoryScroller.css";

const SKELETON_COUNT = 4;

export default function CategoryScroller() {
  const navigate = useNavigate();
  const trackRef = useRef(null);

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [navError, setNavError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const response = await productApi.getSubcategories();

        if (mounted) setSubcategories(toList(response?.data));
      } catch (error) {
        console.error("Subcategories API error:", error);

        if (mounted) setSubcategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Subcategory -> find its parent category -> /category/:id with that
  // subcategory pre-selected.
  const openSubcategory = async (subcategory) => {
    if (busyId !== null) return;

    setNavError("");
    setBusyId(subcategory.id);

    try {
      const categoryId = await resolveSubcategoryCategoryId(subcategory);

      navigate(`/category/${categoryId}?sub=${subcategory.id}`);
    } catch (error) {
      console.error("Resolve subcategory failed:", error);
      setNavError(
        error?.message || "Unable to open this subcategory. Please try again.",
      );
    } finally {
      setBusyId(null);
    }
  };

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

  if (!loading && subcategories.length === 0) return null;

  return (
    <section className="category-scroller" aria-label="Browse by subcategory">
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
          subcategories.map((subcategory) => (
            <button
              type="button"
              className="category-scroll-item"
              key={subcategory.id}
              disabled={busyId === subcategory.id}
              aria-busy={busyId === subcategory.id}
              onClick={() => openSubcategory(subcategory)}
            >
              <span className="category-scroll-circle">
                <LazyImage
                  src={subcategory.image}
                  alt=""
                  fit="contain"
                />
              </span>
              <span title={subcategory.name}>{subcategory.name}</span>
            </button>
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

      {navError && (
        <p className="category-scroller-error" role="alert">
          {navError}
        </p>
      )}
    </section>
  );
}
