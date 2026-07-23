import "./CustomerReview.css";
import { FiStar } from "react-icons/fi";
import avatar1 from "../../assets/images/airpods-model.png";
import avatar2 from "../../assets/images/airpods-model.png";

const reviews = [
  {
    name: "Jon N.",
    rating: 5,
    avatar: avatar1,
    text: "Introduces basic document editing, and formatting techniques, such as adjusting text spacing, using the ribbon, and saving files.",
  },
  {
    name: "Sam R.",
    rating: 4,
    avatar: avatar2,
    text: "Fantastic battery life and the screen is gorgeous for everyday work and browsing.",
  },
];

export default function CustomerReview() {
  return (
    <section className="customer-review">
      <h2>Customer Review</h2>

      <div className="review-row">
        {reviews.map((r) => (
          <div className="review-card" key={r.name}>
            <div className="review-header">
              <img src={r.avatar} alt={r.name} />
              <div>
                <p className="review-name">{r.name}</p>
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className={i < r.rating ? "filled" : ""} />
                  ))}
                </div>
              </div>
            </div>
            <p className="review-text">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
