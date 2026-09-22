import { useEffect, useState } from "react";
import "./BatteryCapacity.css";
import { productApi } from "../../api/productApi";

export default function BatteryCapacity({ productId }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setSections([]);
      setLoading(false);
      return;
    }

    const fetchFeaturedSections = async () => {
      try {
        setLoading(true);

        const response = await productApi.getFeaturedImageSections(productId);

        console.log("Featured Image Sections:", response);

        const data = Array.isArray(response?.data) ? response.data : [];

        setSections(data);
      } catch (error) {
        console.error("Failed to fetch featured image sections:", error);

        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSections();
  }, [productId]);

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Don't render anything if API has no data
  if (!sections.length) {
    return null;
  }

  return (
    <>
      {sections.map((section) => {
        // Skip invalid/empty sections
        if (
          !section ||
          !Array.isArray(section.items) ||
          !section.items.length
        ) {
          return null;
        }

        return (
          <section className="battery-capacity" key={section.id}>
            {/* ================================
                SECTION HEADING
            ================================= */}

            {section.heading && (
              <div className="battery-heading">
                <h2>{section.heading}</h2>
              </div>
            )}

            {/* ================================
                ALL ITEMS
            ================================= */}

            {section.items.map((item) => {
              if (!item) {
                return null;
              }

              return (
                <div className="battery-item" key={item.id}>
                  {/* TITLE */}

                  {item.title && (
                    <p className="battery-tagline">{item.title}</p>
                  )}

                  {/* HIGHLIGHTED TEXT */}

                  {item.highlighted_text && (
                    <div className="battery-highlighted-text">
                      {item.highlighted_text}
                    </div>
                  )}

                  {/* SHORT DESCRIPTION */}

                  {item.short_description && (
                    <p className="battery-desc">{item.short_description}</p>
                  )}

                  {/* IMAGE */}

                  {item.image_url && (
                    <div className="battery-media">
                      <img
                        src={item.image_url}
                        alt={item.title || section.heading || ""}
                      />
                    </div>
                  )}

                  {/* FULL DESCRIPTION */}

                  {item.description && (
                    <div className="battery-description">
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        );
      })}
    </>
  );
}
