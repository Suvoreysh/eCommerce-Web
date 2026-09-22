import LazyImage from "../common/LazyImage";
import "./CategoryOffersGrid.css";

// Offer banners for one category, shown after that category's product
// section. Max 2 columns on desktop, 1 on phones (per design).
export default function CategoryOffersGrid({ category, offers = [] }) {
  if (!offers.length) return null;

  return (
    <section className="cat-offers" aria-label={`${category.name} offers`}>
      <div className="cat-offers__grid">
        {offers.map((offer) => (
          <div className="cat-offers__card" key={offer.id}>
            <LazyImage src={offer.image} alt={offer.title || category.name} eager />
          </div>
        ))}
      </div>
    </section>
  );
}
