import { useEffect, useState } from "react";

import { homeApi } from "../../api/homeApi";
import "./AirPodsBanner.css";

export default function AirPodsBanner() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchFocusedProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await homeApi.getHome();
        if (!isMounted) return;

        const responseData = response?.data?.data ?? response?.data ?? response;
        const aboutBanners = Array.isArray(responseData?.about_banners)
          ? responseData.about_banners
          : [];

        const focusedProduct = aboutBanners.find(
          (item) =>
            item.placement === "home_focused_product" &&
            Number(item.status) === 1,
        );

        setProduct(focusedProduct || null);
      } catch (err) {
        if (!isMounted) return;

        console.error("AirPods banner API error:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load product details.",
        );
        setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFocusedProduct();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="airpods-banner" aria-label="Loading focused product">
        <div className="airpods-card airpods-skeleton" aria-hidden="true">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
          <div className="skeleton skeleton-banner-image" />

          <div className="about-section">
            <div className="skeleton skeleton-about-title" />
            <div className="skeleton skeleton-description" />
            <div className="skeleton skeleton-description skeleton-short" />
          </div>

          <div className="skeleton skeleton-feature-heading" />

          <div className="feature-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="feature-card" key={`airpods-skeleton-${index}`}>
                <div className="skeleton skeleton-feature-image" />
                <div className="skeleton skeleton-feature-label" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="airpods-banner">
        <p className="airpods-message airpods-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (!product) return null;

  const features = Array.isArray(product.features)
    ? [...product.features].sort(
        (first, second) =>
          Number(first.display_order || 0) - Number(second.display_order || 0),
      )
    : [];

  return (
    <section className="airpods-banner">
      <div className="airpods-card">
        {product.title && <h2 className="airpods-title">{product.title}</h2>}
        {product.subtitle && (
          <p className="airpods-subtitle">{product.subtitle}</p>
        )}

        {product.image && (
          <div className="airpods-image-wrapper">
            <img
              src={product.image}
              alt={product.title || "Focused product"}
              className="airpods-banner-image"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        )}

        {product.description && (
          <div className="about-section">
            <h3>About the Product</h3>
            <p>{product.description}</p>
          </div>
        )}

        {features.length > 0 && (
          <>
            <div className="feature-heading">Product Features</div>
            <div className="feature-grid">
              {features.map((feature, index) => (
                <div
                  className="feature-card"
                  key={feature.id ?? `feature-${index}`}
                >
                  <div className="feature-number">{index + 1}</div>
                  <div
                    className={`feature-image-box ${!feature.icon ? "feature-image-empty" : ""}`}
                  >
                    {feature.icon && (
                      <img
                        src={feature.icon}
                        alt={feature.label || `Feature ${index + 1}`}
                        loading="eager"
                        decoding="async"
                      />
                    )}
                  </div>
                  <h4>{feature.label || `Feature ${index + 1}`}</h4>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
