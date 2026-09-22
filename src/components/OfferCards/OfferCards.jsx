import { useEffect, useState } from "react";
import LazyImage from "../common/LazyImage";
import "./OfferCards.css";

function OfferCard({ offer }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [offer.image]);

  if (failed) return null;

  return (
    <div className="offer-card">
      <LazyImage
        src={offer.image}
        alt={offer.title || "Exclusive offer"}
        eager
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function OfferCards({
  title = "Exclusive Offers",
  offers = [],
  loading = false,
}) {
  if (!loading && !offers.length) return null;

  return (
    <section className="offer-cards-section">
      {title && <h2>{title}</h2>}

      <div className="offer-cards-row">
        {loading &&
          Array.from({ length: 2 }).map((_, index) => (
            <div className="offer-card" key={index} aria-hidden="true">
              <span className="lazy-img" data-status="loading">
                <span className="lazy-img__skeleton" />
              </span>
            </div>
          ))}

        {!loading &&
          offers.map((offer) => <OfferCard offer={offer} key={offer.id} />)}
      </div>
    </section>
  );
}
