import "./PrivacySecurity.css";

import securityImg from "../../assets/images/this.png";
import macImg from "../../assets/images/mac.png";

import lockIcon from "../../assets/icons/Icon-fill/lock1.svg";
import keyIcon from "../../assets/icons/Icon-fill/key.svg";
import pressIcon from "../../assets/icons/Icon-fill/press.svg";

const points = [
  {
    icon: pressIcon,
    title: "Lock Key or Touch ID",
    desc: "The Lock Key wakes and locks your screen and powers your Mac on and off.",
  },
  {
    icon: lockIcon,
    title: "Protected if lost",
    desc: "The Find My app helps you quickly pinpoint where your MacBook Neo is and lock or erase it from afar.",
  },
  {
    icon: keyIcon,
    title: "Stays secure",
    desc: "MacBook Neo has free, built-in antivirus protections.",
  },
];

export default function PrivacySecurity() {
  return (
    <section className="privacy-security">
      <div className="privacy-media">
        <img src={securityImg} alt="MacBook Neo security" />
      </div>

      <div className="privacy-content">
        <p className="privacy-eyebrow">Privacy and Security</p>

        <h2 className="privacy-heading">
          No
          <br />
          compromises.
        </h2>

        <div className="privacy-mac">
          <img src={macImg} alt="MacBook Neo" />
        </div>

        <p className="privacy-intro">
          MacBook Neo is built from the ground up with{" "}
          <span>advanced security</span> protections that come standard on every
          Mac. Automatic data encryption, free antivirus protections and regular
          software updates give you the peace of mind that you and your data
          stay safe online.
        </p>

        <div className="privacy-points">
          {points.map((point) => (
            <article className="privacy-point" key={point.title}>
              <div className="privacy-icon-wrapper">
                <img
                  src={point.icon}
                  alt=""
                  className="privacy-icon"
                  aria-hidden="true"
                />
              </div>

              <div className="privacy-point-content">
                <h4>{point.title}</h4>
                <p>{point.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
