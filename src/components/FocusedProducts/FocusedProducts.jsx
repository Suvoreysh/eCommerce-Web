import { useEffect, useState } from "react";
import { homeApi } from "../../api/homeApi";
import "./FocusedProducts.css";

const SKELETON_COUNT = 3;

export default function FocusedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const response = await homeApi.getHome();
        const data = response?.data?.data ?? response?.data ?? response;
        const banners = Array.isArray(data?.about_banners)
          ? data.about_banners
          : [];
        if (mounted)
          setProducts(
            banners
              .filter(
                (item) =>
                  item.placement === "home_focused_products_list" &&
                  Number(item.status) === 1,
              )
              .sort(
                (a, b) =>
                  Number(a.display_order || 0) - Number(b.display_order || 0),
              ),
          );
      } catch (error) {
        console.error("Focused products API error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const markImage = (id, state) =>
    setImages((old) => ({ ...old, [id]: state }));
  if (!loading && !products.length) return null;

  return (
    <section className="focused-products">
      {loading &&
        Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <div
            className={`focused-skeleton ${index ? "split-skeleton" : "center-skeleton"}`}
            key={index}
          >
            <i />
            <i />
            <i />
            <b />
          </div>
        ))}
      {!loading &&
        products.map((product, index) => {
          const id = product.id ?? index;
          const layout =
            product.layout === "image_left" || product.layout === "image_right"
              ? product.layout
              : "center";
          const loaded = images[id] === "loaded";
          const failed = images[id] === "failed";
          const [buyText = "Buy Now", learnText = "Learn More"] = (
            product.cta_text || "Buy Now|Learn More"
          ).split("|");
          const image = product.image && !failed && (
            <div className={`focused-image ${loaded ? "image-loaded" : ""}`}>
              {!loaded && <span className="focused-image-skeleton" />}
              <img
                src={product.image}
                alt={product.title || "Product"}
                loading="lazy"
                decoding="async"
                onLoad={() => markImage(id, "loaded")}
                onError={() => markImage(id, "failed")}
              />
            </div>
          );
          const copy = (
            <div className="focused-copy">
              <h2>{product.title}</h2>
              {product.subtitle && (
                <p className="focused-subtitle">{product.subtitle}</p>
              )}
              {product.description && (
                <div
                  className="focused-description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
              {product.cta_link && (
                <div className="focused-actions">
                  <a
                    className="focused-button focused-buy"
                    href={product.cta_link}
                  >
                    <span className="button-buy-text">{buyText}</span>
                    <span className="button-learn-text">{learnText}</span>
                  </a>
                </div>
              )}
            </div>
          );
          return layout === "center" ? (
            <article className="focused-center" key={id}>
              {copy}
              {image}
            </article>
          ) : (
            <article className={`focused-split ${layout}`} key={id}>
              {layout === "image_left" ? (
                <>
                  {image}
                  {copy}
                </>
              ) : (
                <>
                  {copy}
                  {image}
                </>
              )}
            </article>
          );
        })}
    </section>
  );
}
