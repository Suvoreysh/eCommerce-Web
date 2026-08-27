import { useState, useEffect } from "react";
import { apiRequest, ENDPOINTS } from "../../api/config";
import "./WhyChooseUs.css";

export default function WhyChooseUs() {
  const [items, setItems] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleAccordion = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
  };

  return (
    <section className="why">
      <div className="why-container">
        <h2 className="why-title">Why Choose Us?</h2>

        {loading && (
          <div className="why-accordion-list" aria-busy="true">
            {[0, 1, 2].map((n) => (
              <div className="why-skeleton" key={n}>
                <div className="why-skeleton-header">
                  <span className="why-skeleton-bar why-skeleton-title" />
                  <span className="why-skeleton-icon" />
                </div>
                {n === 0 && (
                  <div className="why-skeleton-body">
                    <div className="why-skeleton-image" />
                    <div className="why-skeleton-points">
                      <span className="why-skeleton-bar" />
                      <span className="why-skeleton-bar" />
                      <span className="why-skeleton-bar why-skeleton-short" />
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
              const isOpen = openIndex === index;

              return (
                <article
                  key={item.id}
                  className={`why-accordion ${isOpen ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="why-accordion-header"
                    onClick={() => handleAccordion(index)}
                    aria-expanded={isOpen}
                    aria-controls={`why-panel-${item.id}`}
                  >
                    <span className="why-accordion-title">{item.question}</span>

                    <span className="why-accordion-icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    id={`why-panel-${item.id}`}
                    className="why-accordion-panel"
                  >
                    <div className="why-accordion-body">
                      {item.image && (
                        <div className="why-product-image">
                          <img src={item.image} alt={item.question} />
                        </div>
                      )}

                      <div className="why-points">
                        <p className="why-answer">{item.answer}</p>

                        {Array.isArray(item.features) &&
                          item.features.map((point, pointIndex) => (
                            <div
                              className="why-point"
                              key={`${item.id}-${pointIndex}`}
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
