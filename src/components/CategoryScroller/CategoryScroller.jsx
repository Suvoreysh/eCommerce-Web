import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { productApi } from "../../api/productApi";
import { resolveSubcategoryCategoryId, toList } from "../../utils/catalog";

import LazyImage from "../common/LazyImage";
import "./CategoryScroller.css";

const SKELETON_COUNT = 5;

export default function CategoryScroller() {
  const navigate = useNavigate();
  const trackRef = useRef(null);

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [navError, setNavError] = useState("");

  /* =========================================
     FETCH SUBCATEGORIES
  ========================================= */

  useEffect(() => {
    let mounted = true;

    const fetchSubcategories = async () => {
      try {
        setLoading(true);

        const response = await productApi.getSubcategories();

        if (!mounted) return;

        setSubcategories(toList(response?.data));
      } catch (error) {
        console.error("Subcategories API error:", error);

        if (mounted) {
          setSubcategories([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSubcategories();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================
     OPEN SUBCATEGORY
  ========================================= */

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

  /* =========================================
     SCROLL AMOUNT
  ========================================= */

  const getScrollAmount = () => {
    const track = trackRef.current;

    if (!track) return 300;

    return Math.max(280, track.clientWidth * 0.55);
  };

  /* =========================================
     LEFT SCROLL
  ========================================= */

  const scrollPrev = () => {
    const track = trackRef.current;

    if (!track) return;

    const isAtStart = track.scrollLeft <= 4;

    if (isAtStart) {
      track.scrollTo({
        left: track.scrollWidth,
        behavior: "smooth",
      });

      return;
    }

    track.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth",
    });
  };

  /* =========================================
     RIGHT SCROLL
  ========================================= */

  const scrollNext = () => {
    const track = trackRef.current;

    if (!track) return;

    const isAtEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    if (isAtEnd) {
      track.scrollTo({
        left: 0,
        behavior: "smooth",
      });

      return;
    }

    track.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth",
    });
  };

  /* =========================================
     EMPTY
  ========================================= */

  if (!loading && subcategories.length === 0) {
    return null;
  }

  return (
    <section className="category-scroller" aria-label="Browse by subcategory">
      {/* LEFT BUTTON */}
      <button
        type="button"
        className="category-nav-btn category-prev-btn"
        onClick={scrollPrev}
        aria-label="Show previous subcategories"
      >
        <FiChevronLeft />
      </button>

      {/* TRACK */}
      <div className="category-track" ref={trackRef}>
        {/* SKELETON */}
        {loading &&
          Array.from({
            length: SKELETON_COUNT,
          }).map((_, index) => (
            <div
              className="category-scroll-item category-scroll-skeleton"
              key={`subcategory-skeleton-${index}`}
              aria-hidden="true"
            >
              <div className="category-scroll-circle" />

              <span className="category-scroll-skeleton-name" />
            </div>
          ))}

        {/* CATEGORIES */}
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
                <span className="category-image-inner">
                  <LazyImage
                    src={subcategory.image}
                    alt={subcategory.name || "Category"}
                    fit="contain"
                  />
                </span>
              </span>

              <span className="category-scroll-name" title={subcategory.name}>
                {subcategory.name}
              </span>
            </button>
          ))}
      </div>

      {/* RIGHT BUTTON */}
      <button
        type="button"
        className="category-nav-btn category-next-btn"
        onClick={scrollNext}
        aria-label="Show more subcategories"
      >
        <FiChevronRight />
      </button>

      {/* ERROR */}
      {navError && (
        <p className="category-scroller-error" role="alert">
          {navError}
        </p>
      )}
    </section>
  );
}
