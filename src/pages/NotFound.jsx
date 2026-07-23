import { Link } from "react-router-dom";
import Seo from "../components/common/Seo";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <main className="page" style={{ textAlign: "center", paddingTop: "60px" }}>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." />
      <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>404</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "24px" }}>
        We couldn't find the page you were looking for.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </main>
  );
}
