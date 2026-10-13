import { useEffect, useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useParams } from "react-router-dom";

import { productApi } from "../../api/productApi";
import "./ProductivityDetails.css";

function decodeSvg(raw) {
  if (!raw) return null;
  return raw
    .replace(/\\u003C/gi, "<")
    .replace(/\\u003E/gi, ">")
    .replace(/\\u0022/gi, '"')
    .replace(/\\r\\n/g, "")
    .replace(/\\n/g, "");
}

function PanelIcon({ svgString }) {
  const svg = decodeSvg(svgString);
  if (!svg) return null;

  return (
    <span
      className="panel-icon panel-icon--svg"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

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
    if (!productId) {
      setLoading(false);
      return undefined;
    }

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

        const productResponse = await productApi.getById(productId);

        if (latestRequest.current !== requestId) return;

        const product = productResponse?.data;
        const detailBanner = product?.detail_banner;

        if (detailBanner && Number(detailBanner.status) === 1) {
          setSectionHeading(
            detailBanner.title?.trim() || "Productivity Details",
          );
          setFeaturedImage(detailBanner.image || "");
        }

        const keyPointsResponse = await productApi.getKeyPoints(productId);

        if (latestRequest.current !== requestId) return;

        const keyPoints = Array.isArray(keyPointsResponse?.data)
          ? keyPointsResponse.data
          : [];

        const activePanels = keyPoints
          .filter((panel) => Number(panel.status) === 1)
          .sort((a, b) => Number(a.display_order) - Number(b.display_order))
          .map((panel) => ({
            id: panel.id,
            title: panel.title || "Product details",
            description: panel.description || "",
            icon: panel.icon || null,
            items: Array.isArray(panel.items)
              ? [...panel.items]
                  .sort(
                    (a, b) => Number(a.display_order) - Number(b.display_order),
                  )
                  .map((item) => item.item_text)
                  .filter(Boolean)
              : [],
          }));

        setPanels(activePanels);
      } catch (error) {
        if (latestRequest.current !== requestId) return;

        console.error("Get productivity details failed:", error);

        setPanels([]);
        setFeaturedImage("");
        setSectionHeading("");
      } finally {
        if (latestRequest.current === requestId) {
          setLoading(false);
        }
      }
    };

    fetchSection();

    return () => {
      if (latestRequest.current === requestId) {
        latestRequest.current += 1;
      }
    };
  }, [productId]);

  const handleToggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

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

                    <PanelIcon svgString={panel.icon} />

                    {!panel.icon && <span className="terminal-symbol">_</span>}

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
