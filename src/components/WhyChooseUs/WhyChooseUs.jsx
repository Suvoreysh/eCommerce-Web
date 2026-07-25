import { useState } from "react";
import "./WhyChooseUs.css";

import phoneImg from "../../assets/images/hero-iphone.png";

const data = [
  {
    id: 1,
    title: "Utrumque satis utrumque audivi audivi nos intellegerem.",
    points: [
      "Utrumque satis utrumque audivi audivi nos intellegerem.",
      "Utrumque satis utrumque audivi audivi nos intellegerem.",
      "Utrumque satis utrumque audivi audivi nos intellegerem.",
    ],
  },
  {
    id: 2,
    title:
      "Utrumque satis utrumque audivi audivi nos intellegerem audivi nos intellegerem.",
    points: [
      "Fast and secure delivery throughout the country.",
      "Safe packaging for every product.",
      "Easy order tracking facility.",
    ],
  },
  {
    id: 3,
    title:
      "Utrumque satis utrumque audivi audivi nos intellegerem audivi nos intellegerem.",
    points: [
      "Simple and easy replacement process.",
      "No unnecessary hidden charges.",
      "Helpful customer support service.",
    ],
  },
];

export default function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleAccordion = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
  };

  return (
    <section className="why">
      <div className="why-container">
        <h2 className="why-title">Why Choose Us?</h2>

        <div className="why-accordion-list">
          {data.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={item.id}
                className={`why-accordion ${isOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className="why-accordion-header"
                  onClick={() => handleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`why-panel-${item.id}`}
                >
                  <span className="why-accordion-title">{item.title}</span>

                  <span className="why-accordion-icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  id={`why-panel-${item.id}`}
                  className="why-accordion-panel"
                >
                  <div className="why-accordion-body">
                    <div className="why-product-image">
                      <img src={phoneImg} alt="Premium smartphone" />
                    </div>

                    <div className="why-points">
                      {item.points.map((point, pointIndex) => (
                        <div
                          className="why-point"
                          key={`${item.id}-${pointIndex}`}
                        >
                          <span className="why-point-number">
                            {pointIndex + 1}
                          </span>

                          <p>{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
