import Seo from "../components/common/Seo";
import Header from "../components/common/Header";

export default function Placeholder({ title = "Coming Soon" }) {
  return (
    <main className="page">
      <Seo title={title} />
      <Header title={title} />
      <p style={{ color: "var(--color-text-muted)", textAlign: "center", marginTop: "40px" }}>
        This page is coming soon.
      </p>
    </main>
  );
}
