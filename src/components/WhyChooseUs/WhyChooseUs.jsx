import { useState } from "react";
import "./WhyChooseUs.css";
import phoneImg from "../../assets/images/hero-iphone.png"; // change image

const data = [
  {
    title: "Premium Quality Products",
    points: [
      "Made from high quality materials.",
      "Long lasting durability.",
      "Trusted by thousands of customers.",
    ],
  },
  {
    title: "Fast & Secure Delivery",
    points: [
      "Quick shipping nationwide.",
      "Safe packaging guaranteed.",
      "Live order tracking.",
    ],
  },
  {
    title: "Easy Return Policy",
    points: [
      "7 Days replacement.",
      "No hidden charges.",
      "Simple return process.",
    ],
  },
];

export default function WhyChooseUs() {
  const [open, setOpen] = useState(0);

  return (
    <section className="why">
      <div className="container">
        <h2>Why Choose Us?</h2>

        {data.map((item, index) => (
          <div
            className={`accordion ${open === index ? "active" : ""}`}
            key={index}
          >
            <div
              className="accordion-header"
              onClick={() => setOpen(open === index ? -1 : index)}
            >
              <p>{item.title}</p>

              <span>{open === index ? "−" : "+"}</span>
            </div>

            <div className={`accordion-body ${open === index ? "show" : ""}`}>
              <div className="image">
                <img src={phoneImg} alt="" />
              </div>

              <div className="content">
                {item.points.map((point, i) => (
                  <div className="point" key={i}>
                    <span>{i + 1}</span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
