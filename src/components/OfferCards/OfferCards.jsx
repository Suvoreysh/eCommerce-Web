import "./OfferCards.css";

export default function OfferCards({ offers = [] }) {
  if (!offers.length) return null;

  return (
    <section className="offer-cards-section">
      <h2>Exclusive Apple Offers</h2>

      <div className="offer-cards-row">
        {offers.map((o, i) => (
          <div className="offer-card" key={o.id || i}>
            <img src={o.image} alt={o.alt || "Offer"} />
          </div>
        ))}
      </div>
    </section>
  );
}
