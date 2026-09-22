import { useEffect, useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import "./LazyImage.css";

/**
 * Single image primitive used across the storefront so every picture loads
 * the same way: shimmer placeholder -> fade-in -> tidy fallback on error / no
 * image.
 *
 *  - `className`     styles the wrapper (size / radius / background)
 *  - `imgClassName`  styles the <img> itself
 *  - `fit`           object-fit for the <img> ("contain" | "cover")
 *  - `eager`         skip native lazy loading (above-the-fold images)
 *
 * The wrapper is `display:flex` and fills its parent, so drop it inside any
 * fixed-size box (card image area, thumbnail, avatar…) and it just fits.
 */
export default function LazyImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  fit = "contain",
  eager = false,
  fallback = null,
  onLoad,
  onError,
  ...imgProps
}) {
  const imgRef = useRef(null);
  const [status, setStatus] = useState(src ? "loading" : "error");

  // Reset whenever the source changes (variant switch, pagination re-use…).
  useEffect(() => {
    setStatus(src ? "loading" : "error");
  }, [src]);

  // Cached images can be complete before React attaches onLoad.
  useEffect(() => {
    const node = imgRef.current;

    if (node && node.complete && node.naturalWidth > 0) {
      setStatus("loaded");
    }
  }, [src]);

  const handleLoad = (event) => {
    setStatus("loaded");
    onLoad?.(event);
  };

  const handleError = (event) => {
    setStatus("error");
    onError?.(event);
  };

  return (
    <span
      className={`lazy-img ${className}`.trim()}
      data-status={status}
      style={{ "--lazy-fit": fit }}
    >
      {status === "loading" && (
        <span className="lazy-img__skeleton" aria-hidden="true" />
      )}

      {status === "error" ? (
        (fallback ?? (
          <span className="lazy-img__fallback" role="img" aria-label={alt}>
            <FiImage />
          </span>
        ))
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`lazy-img__el ${imgClassName}`.trim()}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          {...imgProps}
        />
      )}
    </span>
  );
}
