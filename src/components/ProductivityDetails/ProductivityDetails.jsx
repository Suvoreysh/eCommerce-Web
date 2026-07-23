import { useState } from "react";
import "./ProductivityDetails.css";
import productImg from "../../assets/images/laptop.png";
import { FiChevronRight } from "react-icons/fi";

const panels = [
  {
    title: "Developer-friendly",
    description:
      "Developers can integrate BUSY Bar into any system using Open API",
    items: [
      "Open HTTP API",
      "Libs for Python / JavaScript / Go",
      "Offline API (no internet required)",
      "USB Virtual LAN",
      "Apps for macOS, iOS and Android",
    ],
  },
];

export default function ProductivityDetails() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="productivity-details">
      <h2 className="productivity-heading">Productivity Details</h2>

      <div className="productivity-media">
        <img src={productImg} alt="Laptop" />
      </div>

      <div className="productivity-panels">
        {panels.map((panel, index) => (
          <div className="productivity-panel" key={panel.title}>
            <button
              type="button"
              className="panel-toggle"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <span className="panel-title">
                <FiChevronRight
                  className={openIndex === index ? "rotated" : ""}
                />
                {panel.title}
              </span>
            </button>

            {openIndex === index && (
              <div className="panel-content">
                <p className="panel-description">{panel.description}</p>

                <ul className="panel-items">
                  {panel.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

     
    </section>
  );
}
