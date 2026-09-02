import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "../../api/productApi";
import "./CustomerReview.css";

const SKELETON_COUNT = 3;

function ReviewAvatar({ review }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [review.image]);

  if (!review.image || failed) {
    return (
      <span className="review-avatar review-avatar-fallback">
        {review.name?.charAt(0)?.toUpperCase() || "U"}
      </span>
    );
  }

  return (
    <span className="review-avatar review-avatar-wrap">
      {!loaded && <i className="review-avatar-skeleton" aria-hidden="true" />}
      <img
        src={review.image}
        alt={review.name || "Customer"}
        className={loaded ? "is-loaded" : ""}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export default function CustomerReview({ productId: passedProductId }) {
  const { id } = useParams();
  const productId = passedProductId ?? id;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await productApi.getProductReviews(productId);
        if (mounted)
          setReviews(
            (Array.isArray(response?.data) ? response.data : []).filter(
              (item) => Number(item.status ?? 1) === 1,
            ),
          );
      } catch (err) {
        if (mounted) setError(err.message || "Unable to load reviews.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (productId) fetchReviews();
    return () => {
      mounted = false;
    };
  }, [productId]);

  if (!productId || (!loading && !error && reviews.length === 0)) return null;

  return (
    <section className="customer-review">
      <h2 className="customer-review-title">Customer Review</h2>
      {error && <p className="review-message">{error}</p>}
      {!error && (
        <div className="review-slider">
          <div className="review-row">
            {loading &&
              Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <article
                  className="review-card review-card-skeleton"
                  key={index}
                >
                  <div className="review-skeleton-header">
                    <span className="review-skeleton-circle" />
                    <span className="review-skeleton-name" />
                    <span className="review-skeleton-rating" />
                  </div>
                  <span className="review-skeleton-line" />
                  <span className="review-skeleton-line" />
                  <span className="review-skeleton-line short" />
                </article>
              ))}
            {!loading &&
              reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-header">
                    <div className="review-user">
                      <ReviewAvatar review={review} />
                      <p className="review-name">{review.name || "Customer"}</p>
                    </div>
                    <span className="review-rating">
                      {Number(review.rating || 0)} Star
                    </span>
                  </div>
                  <p className="review-text">{review.review}</p>
                </article>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
