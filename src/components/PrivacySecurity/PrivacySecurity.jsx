import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PrivacySecurity.css";

import securityImg from "../../assets/images/this.png";
import macImg from "../../assets/images/mac.png";

import lockIcon from "../../assets/icons/Icon-fill/lock1.svg";
import keyIcon from "../../assets/icons/Icon-fill/key.svg";
import pressIcon from "../../assets/icons/Icon-fill/press.svg";
import { productApi } from "../../api/productApi";

const fallbackIcons = [pressIcon, lockIcon, keyIcon];

export default function PrivacySecurity({ productId: passedProductId }) {
  const { id } = useParams();
  const productId = passedProductId ?? id;

  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;

    async function fetchFeatures() {
      setLoading(true);
      setError(null);

      try {
        const res = await productApi.getFeatures(productId, "lower");
        const list = res?.data || [];

        if (!isMounted) return;

        setPoints(
          list
            .sort((a, b) => a.display_order - b.display_order)
            .map((item, idx) => ({
              id: item.id,
              icon: item.icon_url || fallbackIcons[idx % fallbackIcons.length],
              title: item.title,
              desc: item.description,
            })),
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load features");
        setPoints([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchFeatures();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (!productId || (!loading && (error || points.length === 0))) {
    return null;
  }

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
          {loading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <article className="privacy-point" key={`skeleton-${idx}`}>
                <div className="privacy-icon-wrapper">
                  <span className="privacy-skel-icon" />
                </div>

                <div className="privacy-point-content">
                  <span className="privacy-skel-line privacy-skel-line--title" />
                  <span className="privacy-skel-line privacy-skel-line--desc" />
                  <span className="privacy-skel-line privacy-skel-line--desc-2" />
                </div>
              </article>
            ))}

          {!loading &&
            points.map((point) => (
              <article className="privacy-point" key={point.id}>
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