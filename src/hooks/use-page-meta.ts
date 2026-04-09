import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageMetaOptions {
  title: string;
  description?: string;
  /** Override breadcrumb label (defaults to title) */
  breadcrumbLabel?: string;
}

export function usePageMeta(title: string, description?: string, options?: { noindex?: boolean }) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (meta) {
        meta.content = description;
      }
    }

    // Handle noindex for private pages
    const robotsId = "page-robots-meta";
    let robotsMeta = document.getElementById(robotsId) as HTMLMetaElement | null;
    if (options?.noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta") as HTMLMetaElement;
        robotsMeta.id = robotsId;
        robotsMeta.name = "robots";
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.content = "noindex, nofollow";
    } else if (robotsMeta) {
      robotsMeta.remove();
    }

    // Inject BreadcrumbList JSON-LD for sub-pages
    const breadcrumbId = "breadcrumb-jsonld";
    let existing = document.getElementById(breadcrumbId);
    if (existing) existing.remove();

    if (location.pathname !== "/") {
      const script = document.createElement("script");
      script.id = breadcrumbId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://aspenmontessori.in/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title.split("–")[0].trim(),
            item: `https://aspenmontessori.in${location.pathname}`,
          },
        ],
      });
      document.head.appendChild(script);
    }

    return () => {
      document.title = "Aspen Montessori Hyderabad – Preschool & Daycare";
      const el = document.getElementById(breadcrumbId);
      if (el) el.remove();
      const rm = document.getElementById(robotsId);
      if (rm) rm.remove();
    };
  }, [title, description, location.pathname, options?.noindex]);
}
