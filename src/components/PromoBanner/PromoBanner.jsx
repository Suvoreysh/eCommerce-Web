import { useEffect, useState } from "react";
import "./PromoBanner.css";

export default function PromoBanner({
  image,
  alt = "Promo banner",
  loading = false,
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(false), [image]);
  if (!loading && !image) return null;
  return (
    <section className="promo-banner">
      {(loading || !loaded) && (
        <div className="promo-banner-skeleton" aria-hidden="true">
          <span />
        </div>
      )}
      {image && (
        <img
          src={image}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={loaded ? "is-loaded" : ""}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      )}
    </section>
  );
}
