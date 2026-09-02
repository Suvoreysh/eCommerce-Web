import { useEffect, useState } from "react";
import { apiRequest, ENDPOINTS } from "../../api/config";
import "./WhyChooseUs.css";

const FAQ_SKELETON_COUNT = 3;

export default function WhyChooseUs() {
  const [items, setItems] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageStatus, setImageStatus] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiRequest(ENDPOINTS.FAQS, {
          method: "GET",
          auth: false,
        });
        if (!isMounted) return;
        setItems(Array.isArray(response?.data) ? response.data : []);
        setImageStatus({});
      } catch (err) {
        if (!isMounted) return;
        console.error("Get FAQs failed:", err);
        setError(err.message || "Unable to load FAQs.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageLoad = (id) =>
    setImageStatus((previous) => ({ ...previous, [id]: "loaded" }));
  const handleImageError = (id) =>
    setImageStatus((previous) => ({ ...previous, [id]: "error" }));
  const handleAccordion = (index) =>
    setOpenIndex((current) => (current === index ? -1 : index));

  return (
    <section className="why">
      <div className="why-container">
        <h2 className="why-title">Why Choose Us?</h2>

        {loading && (
          <div
            className="why-accordion-list"
            aria-busy="true"
            aria-label="Loading frequently asked questions"
          >
            {Array.from({ length: FAQ_SKELETON_COUNT }).map((_, index) => (
              <div
                className={`why-skeleton ${index === 0 ? "is-open" : ""}`}
                key={`faq-skeleton-${index}`}
                aria-hidden="true"
              >
                <div className="why-skeleton-header">
                  <span className="why-shimmer why-skeleton-title" />
                  <span className="why-shimmer why-skeleton-icon" />
                </div>
                {index === 0 && (
                  <div className="why-skeleton-body">
                    <span className="why-shimmer why-skeleton-image" />
                    <div className="why-skeleton-points">
                      <span className="why-shimmer why-skeleton-line" />
                      <span className="why-shimmer why-skeleton-line" />
                      <span className="why-shimmer why-skeleton-line short" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && error && <p className="why-error">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="why-empty">No FAQs to show right now.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="why-accordion-list">
            {items.map((item, index) => {
              const itemKey = item.id ?? `faq-${index}`;
              const isOpen = openIndex === index;
              const hasImage = Boolean(item.image);
              const isImageLoaded = imageStatus[itemKey] === "loaded";
              const imageFailed = imageStatus[itemKey] === "error";

              return (
                <article
                  key={itemKey}
                  className={`why-accordion ${isOpen ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="why-accordion-header"
                    onClick={() => handleAccordion(index)}
                    aria-expanded={isOpen}
                    aria-controls={`why-panel-${itemKey}`}
                  >
                    <span className="why-accordion-title">{item.question}</span>
                    <span className="why-accordion-icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    id={`why-panel-${itemKey}`}
                    className="why-accordion-panel"
                  >
                    <div className="why-accordion-body">
                      {hasImage && !imageFailed && (
                        <div
                          className={`why-product-image ${isImageLoaded ? "image-loaded" : ""}`}
                        >
                          {!isImageLoaded && (
                            <span
                              className="why-image-skeleton why-shimmer"
                              aria-hidden="true"
                            />
                          )}
                          <img
                            src={item.image}
                            alt={item.question || "Product"}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => handleImageLoad(itemKey)}
                            onError={() => handleImageError(itemKey)}
                          />
                        </div>
                      )}

                      <div className="why-points">
                        {item.answer && (
                          <p className="why-answer">{item.answer}</p>
                        )}
                        {Array.isArray(item.features) &&
                          item.features.map((point, pointIndex) => (
                            <div
                              className="why-point"
                              key={`${itemKey}-${pointIndex}`}
                            >
                              <span className="why-point-number">
                                {pointIndex + 1}
                              </span>
                              <p>{point}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
