import { useEffect, useState } from "react";

import { homeApi } from "../../api/homeApi";
import "./Hero.css";

export default function Hero() {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
                  Number(first.display_order) - Number(second.display_order),
              )
          : [];

        setBanners(heroBanners);
        setActiveIndex(0);
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

  if (loading) {
    return <section className="hero" />;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="hero">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`hero-slide ${activeIndex === index ? "active" : ""}`}
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

          <div className="hero-content">
            {banner.title && <h1 className="iphone">{banner.title}</h1>}

            {banner.subtitle && <h2 className="number">{banner.subtitle}</h2>}

            <img
              src={banner.image}
              alt={banner.title || "Hero banner"}
              className="phone"
            />
          </div>

          <div className="fade" />
        </div>
      ))}

      {banners.length > 1 && (
        <div
          className="hero-dots"
          aria-label={`${banners.length} hero banners`}
        >
          {banners.map((banner, index) => (
            <button
              type="button"
              key={banner.id}
              className={`hero-dot ${activeIndex === index ? "active" : ""}`}
              aria-label={`Show banner ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
