import "./PrivacySecurity.css";
import securityImg from "../../assets/images/this.png";
import mac from "../../assets/images/mac.png";
import { FiLock, FiMapPin, FiShield } from "react-icons/fi";

const points = [
  {
    icon: FiLock,
    title: "Lock Key or Touch ID",
    desc: "The Lock key wakes and locks your screen and powers your Mac on and off.",
  },
  {
    icon: FiMapPin,
    title: "Protected if lost",
    desc: "The Find My app helps you quickly pinpoint where your MacBook Neo is and lock or erase it from afar.",
  },
  {
    icon: FiShield,
    title: "Stays secure",
    desc: "MacBook Neo has free, built-in antivirus protections.",
  },
];

export default function PrivacySecurity() {
  return (
    <section className="privacy-security">
      <div className="privacy-media">
        <img src={securityImg} alt="MacBook Neo" />
      </div>

      <div className="privacy-content">
        <p className="privacy-eyebrow">Privacy and Security</p>

        <h2>
          No
          <br />
          compromises.
        </h2>

        <div className="privacy-mac">
          <img src={mac} alt="MacBook Neo" />
        </div>

        <p className="privacy-intro">
          MacBook Neo is built from the ground
          <br />
          up with <span>advanced security</span> protections
          <br />
          that come standard on every Mac.
          <br />
          Automatic data encryption, free
          <br />
          antivirus protections and regular
          <br />
          software updates give you the peace of
          <br />
          mind that you and your data stay
          <br />
          safe online.
        </p>
        <div className="privacy-points">
          {points.map(({ icon: Icon, title, desc }) => (
            <div className="privacy-point" key={title}>
              <Icon className="privacy-icon" />

              <div>
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
