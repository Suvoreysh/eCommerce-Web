import { useRef } from "react";
import { FiChevronRight } from "react-icons/fi";
import "./WhyAppleBest.css";

const reasons = [
  {
    id: 1,
    title: "Delivery and Pickup",
    heading: "On Time and Get Flexible Delivery.",
    description: "Get Free Delivery and Pickup at Your Home",
  },
  {
    id: 2,
    title: "Delivery and Pickup",
    heading: "On Time and Get Flexible Delivery.",
    description: "Get Free Delivery and Pickup at Your Home",
  },
  {
    id: 3,
    title: "Easy Payment",
    heading: "Multiple Secure Payment Options.",
    description: "Pay safely using your preferred payment method",
  },
  {
    id: 4,
    title: "Customer Support",
    heading: "Get Help Whenever You Need It.",
    description: "Friendly customer support for every purchase",
  },
];

export default function WhyAppleBest() {
  const sliderRef = useRef(null);

  const scrollNext = () => {
    sliderRef.current?.scrollBy({
      left: 230,
      behavior: "smooth",
    });
  };

  return (
    <section className="why-apple-best">
      <div className="why-apple-heading">
        <h2>
          Why Apple is the best
          <br />
          place to buy Mac
        </h2>
      </div>

      <div className="why-apple-slider" ref={sliderRef}>
        <div className="why-apple-row">
          {reasons.map((item) => (
            <article className="why-apple-card" key={item.id}>
              <p className="why-apple-card-title">{item.title}</p>

              <h3>{item.heading}</h3>

              <p className="why-apple-description">{item.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="why-apple-navigation">
        <div className="why-apple-dots">
          <button
            type="button"
            className="why-dot active"
            aria-label="Slide 1"
          />
          <button type="button" className="why-dot" aria-label="Slide 2" />
          <button type="button" className="why-dot" aria-label="Slide 3" />
          <button type="button" className="why-dot" aria-label="Slide 4" />
        </div>

        <button
          type="button"
          className="why-next-btn"
          onClick={scrollNext}
          aria-label="Show next cards"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
}
