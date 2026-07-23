import "./KeepExploring.css";
import macAir13 from "../../assets/images/airpods-model.png";
import macAir15 from "../../assets/images/airpods-model.png";

const related = [
  {
    name: 'MacBook Air 13" and 15"',
    price: "₹1,29,900",
    tag: "NEW",
    chip: "M4 chip",
    image: macAir13,
  },
  {
    name: 'MacBook Air 13" and 15"',
    price: "₹1,29,900",
    tag: "NEW",
    chip: "M4 chip",
    image: macAir15,
  },
];

export default function KeepExploring() {
  return (
    <section className="keep-exploring">
      <div className="keep-exploring-header">
        <h2>Keep Exploring Mac Pro</h2>
        <a href="#" className="explore-more-link">
          Exploring More <span>&raquo;</span>
        </a>
      </div>

      <div className="keep-exploring-row">
        {related.map((item, i) => (
          <div className="explore-card" key={i}>
            <span className="explore-tag">{item.tag}</span>
            <img src={item.image} alt={item.name} />
            <p className="explore-name">{item.name}</p>
            <p className="explore-meta">
              Price ₹1,29,900 <span className="explore-chip">{item.chip}</span>
            </p>
            <button type="button" className="explore-btn">
              View more
            </button>
          </div>
        ))}
      </div>

      <div className="explore-dots">
        <span className="dot active" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </section>
  );
}
