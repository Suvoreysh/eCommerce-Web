import "./StoreIntro.css";

export default function StoreIntro({ title = "Store", subtitle = "" }) {
  return (
    <div className="store-intro">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
