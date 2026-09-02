import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { productApi } from "../../api/productApi";
import "./WhyAppleBest.css";

const SKELETON_COUNT = 4;

export default function WhyAppleBest({ productId: passedProductId }) {
  const { id } = useParams();
  const productId = passedProductId ?? id;

  const sliderRef = useRef(null);

  const [sectionTitle, setSectionTitle] = useState("");
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    async function fetchKeynotes() {
      setLoading(true);
      setError(null);

      try {
        const res = await productApi.getKeynoteSections(productId);
        const section = res?.data?.[0];

        if (!isMounted) return;

        setSectionTitle(section?.title || "");
        setReasons(section?.keynotes || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load keynote sections");
        setReasons([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchKeynotes();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const scrollNext = () => {
    sliderRef.current?.scrollBy({
      left: 230,
      behavior: "smooth",
    });
  };

  if (!productId || (!loading && (error || reasons.length === 0))) {
    return null;
  }

  return (
    <section className="why-apple-best">
      <div className="why-apple-heading">
        {loading ? (
          <div className="why-apple-skel-heading">
            <span className="why-apple-skel-line why-apple-skel-line--lg" />
            <span className="why-apple-skel-line why-apple-skel-line--md" />
          </div>
        ) : (
          <h2>{sectionTitle}</h2>
        )}
      </div>

      <div className="why-apple-slider" ref={sliderRef}>
        <div className="why-apple-row">
          {loading &&
            Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
              <article
                className="why-apple-card why-apple-card--skeleton"
                key={`skeleton-${idx}`}
              >
                <span className="why-apple-skel-line why-apple-skel-line--title" />
                <span className="why-apple-skel-line why-apple-skel-line--heading" />
                <span className="why-apple-skel-line why-apple-skel-line--heading-2" />
                <span className="why-apple-skel-line why-apple-skel-line--desc" />
                <span className="why-apple-skel-line why-apple-skel-line--desc-2" />
              </article>
            ))}

          {!loading &&
            reasons.map((item) => (
              <article className="why-apple-card" key={item.id}>
                <p className="why-apple-card-title">{item.highlight_note}</p>
                <h3>{item.title}</h3>
                <p className="why-apple-description">{item.description}</p>
              </article>
            ))}
        </div>
      </div>

      <div className="why-apple-navigation">
        <div className="why-apple-dots">
          {(loading ? Array.from({ length: SKELETON_COUNT }) : reasons).map(
            (_, idx) => (
              <button
                key={idx}
                type="button"
                className={`why-dot${idx === 0 ? " active" : ""}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ),
          )}
        </div>

        <button
          type="button"
          className="why-next-btn"
          onClick={scrollNext}
          aria-label="Show next cards"
          disabled={loading}
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
}
