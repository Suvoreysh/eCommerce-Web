import { useEffect, useRef, useState } from "react";
import LazyImage from "../common/LazyImage";
import "./PromoBanner.css";

const INTERVAL = 3500;

export default function PromoBanner({
  image,
  images,
  slides: slidesProp,
  alt = "Promo banner",
  loading = false,
}) {
  const slides = (() => {
    if (Array.isArray(slidesProp) && slidesProp.length) return slidesProp;
    if (Array.isArray(images) && images.length)
      return images
        .map((img) => (typeof img === "string" ? img : img?.image))
        .filter(Boolean);
    if (image) return [image];
    return [];
  })();

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setIndex(0);
  }, [slides.join(",")]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [slides.length, slides.join(",")]);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setIndex(i);
    timerRef.current = setInterval(() => {
      setIndex((cur) => (cur + 1) % slides.length);
    }, INTERVAL);
  };

  if (!loading && slides.length === 0) return null;

  return (
    <section className="promo-banner">
      {loading || slides.length === 0 ? (
        <span className="lazy-img" data-status="loading" aria-hidden="true">
          <span className="lazy-img__skeleton" />
        </span>
      ) : (
        <div className="promo-banner__track">
          {/* Slide strip — moves left/right via translateX */}
          <div
            className="promo-banner__slides-wrap"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((src, i) => (
              <div
                key={src}
                className={`promo-banner__slide${i === index ? " active" : ""}`}
                aria-hidden={i !== index}
              >
                <LazyImage
                  src={src}
                  alt={`${alt}${slides.length > 1 ? ` ${i + 1}` : ""}`.trim()}
                  eager={i === 0}
                />
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <div
              className="promo-banner__dots"
              role="tablist"
              aria-label="Banner slides"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}`}
                  className={`promo-banner__dot${i === index ? " active" : ""}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
