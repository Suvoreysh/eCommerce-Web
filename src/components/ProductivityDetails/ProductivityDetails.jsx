import { useEffect, useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useParams } from "react-router-dom";

import { productApi } from "../../api/productApi";
import "./ProductivityDetails.css";

const SECTION_KEY = "Productivity Details";

export default function ProductivityDetails() {
  const { id: productId } = useParams();
  const latestRequest = useRef(0);
  const [panels, setPanels] = useState([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [sectionHeading, setSectionHeading] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return undefined;

    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;

    const fetchSection = async () => {
      try {
        setLoading(true);
        setPanels([]);
        setFeaturedImage("");
        setSectionHeading("");
        setImageLoaded(false);
        setOpenIndex(0);

        const [keyPointsResponse, featuredResponse] = await Promise.all([
          productApi.getKeyPoints(productId),
          productApi.getFeaturedImageSections(productId),
        ]);

        if (latestRequest.current !== requestId) return;

        const keyPoints = Array.isArray(keyPointsResponse?.data)
          ? keyPointsResponse.data
          : [];
        const activePanels = keyPoints
          .filter((panel) => Number(panel.status) === 1)
          .sort(
            (first, second) =>
              Number(first.display_order) - Number(second.display_order),
          )
          .map((panel) => ({
            id: panel.id,
            title: panel.title || "Product details",
            description: panel.description || "",
            items: Array.isArray(panel.items)
              ? [...panel.items]
                  .sort(
                    (first, second) =>
                      Number(first.display_order) -
                      Number(second.display_order),
                  )
                  .map((item) => item.item_text)
                  .filter(Boolean)
              : [],
          }));

        const sections = Array.isArray(featuredResponse?.data)
          ? featuredResponse.data
          : [];
        const targetSection =
          sections.find(
            (section) =>
              section.heading?.trim().toLowerCase() ===
              SECTION_KEY.toLowerCase(),
          ) || sections[0];
        const firstImage = Array.isArray(targetSection?.items)
          ? targetSection.items.find(
              (item) => item.image_url || item.thumbnail_url,
            )
          : null;

        setPanels(activePanels);
        setSectionHeading(targetSection?.heading?.trim() || "");
        setFeaturedImage(
          firstImage?.image_url || firstImage?.thumbnail_url || "",
        );
      } catch (error) {
        if (latestRequest.current !== requestId) return;
        console.error("Get productivity details failed:", error);
        setPanels([]);
        setFeaturedImage("");
        setSectionHeading("");
      } finally {
        if (latestRequest.current === requestId) setLoading(false);
      }
    };

    fetchSection();
    return () => {
      if (latestRequest.current === requestId) latestRequest.current += 1;
    };
  }, [productId]);

  const handleToggle = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
  };

  // Do not leave an empty static section on products with no API content.
  if (!loading && !sectionHeading && !featuredImage && panels.length === 0) {
    return null;
  }

  return (
    <section
      className="productivity-details"
      aria-busy={loading || !imageLoaded}
    >
      <h2 className="productivity-heading">
        {sectionHeading || (loading ? "Loading..." : "")}
      </h2>

      <div className="productivity-media">
        {(loading || (featuredImage && !imageLoaded)) && (
          <div className="productivity-image-skeleton" aria-hidden="true" />
        )}

        {featuredImage && (
          <img
            src={featuredImage}
            alt={sectionHeading || "Product details"}
            loading="lazy"
            decoding="async"
            className={imageLoaded ? "is-loaded" : ""}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        )}
      </div>

      <div className="productivity-panels">
        {loading &&
          Array.from({ length: 2 }).map((_, index) => (
            <div
              className="productivity-panel productivity-skeleton"
              key={index}
            >
              <div className="panel-toggle">
                <span className="productivity-skeleton-line" />
              </div>
            </div>
          ))}

        {!loading &&
          panels.map((panel, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={panel.id}
                className={`productivity-panel ${isOpen ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="panel-toggle"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="panel-title">
                    <FiChevronRight
                      className={`panel-arrow ${isOpen ? "rotated" : ""}`}
                    />
                    <span className="terminal-symbol">_</span>
                    <span>{panel.title}</span>
                  </span>
                </button>

                <div className={`panel-content ${isOpen ? "open" : ""}`}>
                  {panel.description && (
                    <p className="panel-description">{panel.description}</p>
                  )}
                  {panel.items.length > 0 && (
                    <ul className="panel-items">
                      {panel.items.map((item, itemIndex) => (
                        <li key={`${panel.id}-${itemIndex}`}>
                          <FiChevronRight />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
