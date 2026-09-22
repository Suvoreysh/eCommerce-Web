import { useEffect, useState } from "react";
import LazyImage from "../common/LazyImage";
import "./PromoBanner.css";

export default function PromoBanner({
  image,
  alt = "Promo banner",
  loading = false,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [image]);

  if (!loading && (!image || failed)) return null;

  return (
    <section className="promo-banner">
      {loading || !image ? (
        <span className="lazy-img" data-status="loading" aria-hidden="true">
          <span className="lazy-img__skeleton" />
        </span>
      ) : (
        <LazyImage
          src={image}
          alt={alt}
          eager
          onError={() => setFailed(true)}
        />
      )}
    </section>
  );
}
