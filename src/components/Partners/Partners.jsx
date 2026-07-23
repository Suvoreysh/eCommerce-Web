import "./Partners.css";

import hp from "../../assets/icons/brands/hp.png";
import samsung from "../../assets/icons/brands/samsung.png";
import mi from "../../assets/icons/brands/mi.png";
import sony from "../../assets/icons/brands/sony.png";
import huawei from "../../assets/icons/brands/huawei.png";
import lg from "../../assets/icons/brands/lg.png";

const logos = [
  { src: hp, alt: "HP" },
  { src: samsung, alt: "Samsung" },
  { src: mi, alt: "Mi" },
  { src: sony, alt: "Sony" },
  { src: huawei, alt: "Huawei" },
  { src: lg, alt: "LG" },
];

export default function Partners() {
  return (
    <section className="partners">
      <div className="partners-wrapper">
        <h2>Our Partner</h2>

        <div className="partners-grid">
          {logos.map((logo) => (
            <div className="partner-logo" key={logo.alt}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
