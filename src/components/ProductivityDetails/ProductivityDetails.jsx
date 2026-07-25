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
      "Libs for Python/JavaScript/Go",
      "Offline API (no internet required)",
      "Self-hosted cloud control",
      "USB Virtual LAN",
      "Apps for macOS, iOS and Android",
    ],
  },
];

export default function ProductivityDetails() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
  };

  return (
    <section className="productivity-details">
      <h2 className="productivity-heading">Productivity Details</h2>

      <div className="productivity-media">
        <img src={productImg} alt="Laptop showing productivity features" />
      </div>

      <div className="productivity-panels">
        {panels.map((panel, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              className={`productivity-panel ${isOpen ? "active" : ""}`}
              key={panel.title}
            >
              <button
                type="button"
                className="panel-toggle"
                onClick={() => handleToggle(index)}
                aria-expanded={isOpen}
              >
                <span className="panel-title">
                  <FiChevronRight
                    className={`panel-arrow ${isOpen ? "rotated" : ""}`}
                  />

                  <span className="terminal-symbol">_</span>

                  <span>{panel.title}</span>
                </span>
              </button>

              {isOpen && (
                <div className="panel-content">
                  <p className="panel-description">{panel.description}</p>

                  <ul className="panel-items">
                    {panel.items.map((item) => (
                      <li key={item}>
                        <FiChevronRight />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
