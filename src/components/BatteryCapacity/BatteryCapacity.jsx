import "./BatteryCapacity.css";
import batteryImg from "../../assets/images/bcpa.png";

export default function BatteryCapacity() {
  return (
    <section className="battery-capacity">
      <p className="battery-top">All day long</p>

      <div className="battery-heading">
        <h2>
          Battery <span>capacity</span>
        </h2>

        <p className="battery-tagline">Your constant companion.</p>

        <p className="battery-desc">
          MacBook Neo is ready to go where you go, from early-morning classes to
          late-night browsing.
        </p>
      </div>

      <div className="battery-media">
        <img src={batteryImg} alt="Using MacBook Neo at night" />
      </div>

      <div className="battery-stat">
        <p className="battery-up">Up to</p>

        <p className="battery-number">16 hr</p>

        <p className="battery-stat-label">
          battery life on
          <br />a single charge†
        </p>
      </div>
    </section>
  );
}
