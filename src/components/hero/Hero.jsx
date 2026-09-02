import { useEffect, useState } from "react";

import { homeApi } from "../../api/homeApi";
import "./Hero.css";

export default function Hero() {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  /* ==========================================
     FETCH HERO BANNERS
  ========================================== */

  useEffect(() => {
    let isMounted = true;

    const fetchHeroBanners = async () => {
      try {
        setLoading(true);

        const response = await homeApi.getHome();

        if (!isMounted) return;

        const heroBanners = Array.isArray(response?.data?.hero_banners)
          ? response.data.hero_banners
              .filter((banner) => Number(banner.status) === 1)
              .sort(
                (first, second) =>
                  Number(first.display_order || 0) -
                  Number(second.display_order || 0),
              )
          : [];

        setBanners(heroBanners);
        setActiveIndex(0);
        setLoadedImages({});
      } catch (error) {
        console.error("Hero banner API error:", error);

        if (isMounted) {
          setBanners([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHeroBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ==========================================
     AUTOMATIC SLIDER
  ========================================== */

  useEffect(() => {
    if (banners.length <= 1) return undefined;

    const sliderInterval = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === banners.length - 1 ? 0 : currentIndex + 1,
      );
    }, 5000);

    return () => {
      window.clearInterval(sliderInterval);
    };
  }, [banners.length]);

  /* ==========================================
     PRELOAD NEXT BANNER
  ========================================== */

  useEffect(() => {
    if (banners.length <= 1) return undefined;

    const nextIndex = activeIndex === banners.length - 1 ? 0 : activeIndex + 1;

    const nextBanner = banners[nextIndex];

    if (!nextBanner?.image) return undefined;

    const bannerKey = nextBanner.id ?? `banner-${nextIndex}`;

    if (loadedImages[bannerKey]) return undefined;

    const image = new Image();

    image.src = nextBanner.image;

    image.onload = () => {
      setLoadedImages((previousImages) => ({
        ...previousImages,
        [bannerKey]: true,
      }));
    };

    image.onerror = () => {
      setLoadedImages((previousImages) => ({
        ...previousImages,
        [bannerKey]: true,
      }));
    };

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [activeIndex, banners, loadedImages]);

  /* ==========================================
     IMAGE LOAD HANDLER
  ========================================== */

  const handleImageLoad = (bannerKey) => {
    setLoadedImages((previousImages) => ({
      ...previousImages,
      [bannerKey]: true,
    }));
  };

  /* ==========================================
     API SKELETON
  ========================================== */

  if (loading) {
    return (
      <section className="hero" aria-label="Loading hero banners">
        <div className="hero-api-skeleton">
          <div className="hero-skeleton-glow" />
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="hero" aria-label="Featured banners">
      {banners.map((banner, index) => {
        const bannerKey = banner.id ?? `banner-${index}`;
        const isImageLoaded = Boolean(loadedImages[bannerKey]);
        const isActive = activeIndex === index;

        return (
          <div
            key={bannerKey}
            className={`hero-slide ${isActive ? "active" : ""}`}
            aria-hidden={!isActive}
          >
            {(banner.discount_text ||
              banner.discount_note ||
              banner.cta_text) && (
              <div className="offer">
                {banner.discount_text && <span>{banner.discount_text}</span>}

                {banner.discount_note && (
                  <>
                    {" "}
                    <span className="old">{banner.discount_note}</span>
                  </>
                )}

                {banner.cta_text && (
                  <>
                    {" "}
                    {banner.cta_link ? (
                      <a href={banner.cta_link}>{banner.cta_text}</a>
                    ) : (
                      <span>{banner.cta_text}</span>
                    )}
                  </>
                )}
              </div>
            )}

            <div
              className={`hero-content ${
                isImageLoaded ? "image-loaded" : "image-loading"
              }`}
            >
              {!isImageLoaded && (
                <div className="hero-image-skeleton" aria-hidden="true">
                  <div className="hero-skeleton-glow" />
                </div>
              )}

              <img
                src={banner.image}
                alt={banner.title || "Hero banner"}
                className="phone"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                onLoad={() => handleImageLoad(bannerKey)}
                onError={() => handleImageLoad(bannerKey)}
              />

              <div className="hero-banner-content">
                {banner.title && <h1 className="iphone">{banner.title}</h1>}

                {banner.subtitle && (
                  <h2 className="number">{banner.subtitle}</h2>
                )}
              </div>
            </div>

            <div className="fade" />
          </div>
        );
      })}

      {banners.length > 1 && (
        <div
          className="hero-dots"
          aria-label={`${banners.length} hero banners`}
        >
          {banners.map((banner, index) => {
            const bannerKey = banner.id ?? `banner-dot-${index}`;

            return (
              <button
                type="button"
                key={bannerKey}
                className={`hero-dot ${activeIndex === index ? "active" : ""}`}
                aria-label={`Show banner ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
