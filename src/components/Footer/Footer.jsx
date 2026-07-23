import { useState } from "react";
import "./Footer.css";

import {
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiTwitter,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

import isoCert from "../../assets/images/airpods-model.png";

export default function Footer() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [touchOpen, setTouchOpen] = useState(true);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <h2 className="footer-logo">LOGO</h2>

          <p className="footer-tagline">
            Premium devices. Unmatched experience.
          </p>
        </div>

        {/* Products */}
        <div className="footer-section">
          <button
            className="footer-heading"
            onClick={() => setProductsOpen(!productsOpen)}
          >
            <span>Products</span>

            <span className="mobile-arrow">
              {productsOpen ? <FiChevronDown /> : <FiChevronRight />}
            </span>
          </button>

          <ul className={productsOpen ? "show" : ""}>
            <li>Phones</li>
            <li>AirPods</li>
            <li>Accessories</li>
            <li>Watches</li>
            <li>Chargers</li>
          </ul>
        </div>

        {/* Get in Touch */}

        <div className="footer-section">
          <button
            className="footer-heading"
            onClick={() => setTouchOpen(!touchOpen)}
          >
            <span>Get in Touch</span>

            <span className="mobile-arrow">
              {touchOpen ? <FiChevronDown /> : <FiChevronRight />}
            </span>
          </button>

          <ul className={touchOpen ? "show" : ""}>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Shipping Policy</li>
            <li>Return Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Certification */}

        <div className="footer-certification">
          <h3>Certification</h3>

          <div className="cert-box">
            <img src={isoCert} alt="ISO" />

            <span>
              ISO 9001:2015
              <br />
              Certified Company
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#">
            <FiYoutube />
          </a>
          <a href="#">
            <FiFacebook />
          </a>
          <a href="#">
            <FiTwitter />
          </a>
          <a href="#">
            <FiInstagram />
          </a>
        </div>

        <p>*These are company numbers as of September, 2016</p>

        <p>© 2025 Your Company. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
