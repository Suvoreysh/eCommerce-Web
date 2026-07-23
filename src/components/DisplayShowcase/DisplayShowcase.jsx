import "./DisplayShowcase.css";
import fieldImg from "../../assets/images/v1.png";

export default function DisplayShowcase() {
  return (
    <section className="display-showcase">
      <div className="display-content">
        <p className="display-eyebrow">Display, Camera and Audio</p>

        <h2>
          A feast for
          <br />
          the senses.
        </h2>

        <p className="display-desc">
          Photos and videos pop with rich contrast and sharp detail...
        </p>
      </div>

      <div className="display-media">
        <img src={fieldImg} alt="" />
      </div>

      {/* <div className="display-content">
        <p className="display-caption">
          33.02 cm (13″) Liquid Retina display...
        </p>

        <div className="display-stat">
          <h3>3.3 million</h3>
          <p>pixels for incredible resolution</p>
        </div>
      </div> */}
    </section>
  );
}
