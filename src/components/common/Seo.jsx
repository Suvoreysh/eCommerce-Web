import { useEffect } from "react";

/**
 * Zero-dependency SEO helper. Updates document title and meta description
 * per page without pulling in react-helmet or any third-party package.
 */
export default function Seo({ title, description }) {
  useEffect(() => {
    const appName = import.meta.env.VITE_APP_NAME || "MyStore";
    document.title = title ? `${title} | ${appName}` : appName;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
