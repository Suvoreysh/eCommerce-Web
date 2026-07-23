import "./PromoBanner.css";

export default function PromoBanner({ image, alt = "Promo banner" }) {
  if (!image) return null;
  return (
    <div className="promo-banner">
      <img src={image} alt={alt} />
    </div>
  );
}
