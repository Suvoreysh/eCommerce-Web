import { useEffect, useState } from "react";
import "./OfferCards.css";

function OfferCard({ offer }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(false), [offer.image]);
  return (
    <div className="offer-card">
      {!loaded && (
        <div className="offer-image-skeleton" aria-hidden="true">
          <span />
        </div>
      )}
      {offer.image && (
        <img
          src={offer.image}
          alt={offer.title || "Exclusive offer"}
          loading="eager"
          decoding="async"
          className={loaded ? "is-loaded" : ""}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

export default function OfferCards({
  title = "Exclusive Apple Offers",
  offers = [],
  loading = false,
}) {
  if (!loading && !offers.length) return null;
  return (
    <section className="offer-cards-section">
      <h2> {title} </h2>
      <div className="offer-cards-row">
        {loading &&
          Array.from({ length: 2 }).map((_, index) => (
            <div className="offer-card" key={index}>
              <div className="offer-image-skeleton">
                <span />
              </div>
            </div>
          ))}
        {!loading &&
          offers.map((offer) => <OfferCard offer={offer} key={offer.id} />)}
      </div>
    </section>
  );
}
