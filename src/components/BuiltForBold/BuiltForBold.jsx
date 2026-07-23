import "../AboutProduct/AboutProduct.css";
import phoneImg from "../../assets/images/3.png";
import { FiCpu, FiCamera, FiBatteryCharging, FiShield } from "react-icons/fi";

const features = [
  { icon: FiCpu, label: "Fast chip" },
  { icon: FiCamera, label: "Pro camera" },
  { icon: FiBatteryCharging, label: "All-day battery" },
  { icon: FiShield, label: "Titanium design" },
];

export default function BuiltForBold() {
  return (
    <section className="about-product">
      <div className="about-container">
        <h1>IPHONE 17 PRO</h1>
        <span>256GB</span>

        <img src={phoneImg} alt="iPhone 17 Pro" />

        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>

        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
    </section>
  );
}
