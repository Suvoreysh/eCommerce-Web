import "./CustomerReview.css";

import avatar1 from "../../assets/images/airpods-model.png";
import avatar2 from "../../assets/images/airpods-model.png";

const reviews = [
  {
    id: 1,
    name: "Jon N.",
    rating: 5,
    avatar: avatar1,
    text: "Introduces basic document creation, editing, and formatting techniques, such as adjusting line spacing, using the ribbon, and saving files.",
  },
  {
    id: 2,
    name: "Sam R.",
    rating: 4,
    avatar: avatar2,
    text: "Introduces useful features for managing files, formatting content, and improving productivity during everyday work.",
  },
  {
    id: 3,
    name: "Alex M.",
    rating: 5,
    avatar: avatar1,
    text: "A simple and helpful experience with clear instructions, useful features, and an easy-to-understand interface.",
  },
];

export default function CustomerReview() {
  return (
    <section className="customer-review">
      <h2 className="customer-review-title">Customer Review</h2>

      <div className="review-slider">
        <div className="review-row">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div className="review-header">
                <div className="review-user">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="review-avatar"
                  />

                  <p className="review-name">{review.name}</p>
                </div>

                <span className="review-rating">{review.rating} Star</span>
              </div>

              <p className="review-text">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
