import "./AirPodsBanner.css";

import bannerImage from "../../assets/images/airpods-model.png";
import featureImage from "../../assets/icons/category-airpods.jfif";

const features = [
  {
    id: 1,
    title: "Premium Audio",
    image: featureImage,
  },
  {
    id: 2,
    title: "Active Noise Cancellation",
    image: featureImage,
  },
  {
    id: 3,
    title: "30 Hour Battery",
    image: featureImage,
  },
];

export default function AirPodsBanner() {
  return (
    <section className="airpods-banner">
      <div className="airpods-card">
        {/* Heading */}

        <h2 className="airpods-title">Air Pods</h2>

        <p className="airpods-subtitle">Enhance your Sound Experience</p>

        {/* Banner Image */}

        <div className="airpods-image-wrapper">
          <img
            src={bannerImage}
            alt="AirPods"
            className="airpods-banner-image"
          />
        </div>

        {/* About */}

        <div className="about-section">
          <h3>About the Product</h3>

          <p>
            Utrumque satis utrumque audivi audivi nos intellegere quaecum sed
            conferebamus nihil utrumque probarem Attico quorum utrumque.
          </p>
        </div>

        {/* Features */}

        <div className="feature-heading">Product Features</div>

        <div className="feature-grid">
          {features.map((item) => (
            <div className="feature-card" key={item.id}>
              <div className="feature-number">{item.id}</div>

              <div className="feature-image-box">
                <img src={item.image} alt={item.title} />
              </div>

              <h4>Features</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
