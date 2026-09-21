import { useEffect } from "react";
import { getOrganizationSchema, getLocalBusinessSchema } from "../data/logisticsData";
import { SITE_URL } from "../utils/navigation";

interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const DEFAULT_OG_IMAGE = "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg";

// Shared helper to set or create a meta tag.
export function setMetaTag(attribute: "name" | "property", value: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function SEOMeta({
  title,
  description,
  keywords = "multimodal logistics India, road transport FTL, coastal shipping India, Mundra Port logistics, ODC transport Gujarat, rail freight CONCOR, project cargo India, customs brokerage Mundra, shipping cargo India",
  canonicalUrl = "https://arrowlinelogistics.in",
  ogImage = DEFAULT_OG_IMAGE
}: SEOMetaProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | ARROWLINE LOGISTICS`;

    // Remove potentially duplicate meta tags while keeping the first of each.
    const dedupeMetaTags = () => {
      const seen = new Set<string>();
      const metas = document.querySelectorAll<HTMLMetaElement>("meta[name], meta[property]");
      metas.forEach((el) => {
        const key = `${el.getAttribute("name") || el.getAttribute("property") || ""}`;
        if (seen.has(key)) el.remove();
        else seen.add(key);
      });
      const canonicals = document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]');
      if (canonicals.length > 1) {
        canonicals[0].remove();
      }
      const discs = document.querySelectorAll<HTMLMetaElement>('meta[name="description"]');
      if (discs.length > 1) {
        discs.forEach((el, i) => { if (i === 0) el.remove(); });
      }
    };

    dedupeMetaTags();

    // Determine clean canonical URL (never includes a `#` fragment)
    const cleanCanonical = canonicalUrl.split("#")[0];
    const prefixes = ["https://", "http://"];
    const isAbsolute = prefixes.some((p) => cleanCanonical.startsWith(p));
    const finalCanonical = isAbsolute ? cleanCanonical : `https://arrowlinelogistics.in${cleanCanonical.startsWith("/") ? cleanCanonical : `/${cleanCanonical}`}`;

    // 2. Set Meta Description & Keywords
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "robots", "index, follow");

    // 3. Set Open Graph (OG) tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", finalCanonical);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:site_name", "ARROWLINE LOGISTICS");
    setMetaTag("property", "og:locale", "en_IN");

    // 4. Set Twitter tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);
    setMetaTag("name", "twitter:site", "@arrowline_logistics");

    // 5. Set Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", finalCanonical);

    // 6. Inject JSON-LD Structured Data for SEO (Organization, LocalBusiness, WebSite)
    const orgSchema = getOrganizationSchema();
    const localSchema = getLocalBusinessSchema();
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Arrowline Logistics",
      "alternateName": "Arrowline Logistics India Pvt Ltd",
      "url": finalCanonical,
      "inLanguage": "en-IN"
    };

    let scriptTag = document.getElementById("seo-structured-data") as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "seo-structured-data";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify([websiteSchema, orgSchema, localSchema], null, 2);
  }, [title, description, keywords, canonicalUrl, ogImage]);

  return null; // This component doesn't render any visible DOM nodes
}

// Renders no visible DOM; applies soft-404 metadata (unique "Page Not Found"
// title, noindex + follow, self-canonical) and restores prior head state on
// unmount so subsequent valid pages are not left with leftover noindex tags.
export function NotFoundMeta({ path }: { path?: string }) {
  useEffect(() => {
    const robotsTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const originalTitle = document.title;
    const originalRobots = robotsTag?.getAttribute("content") || "";
    const originalCanonical = canonicalLink?.getAttribute("href") || "";

    document.title = "Page Not Found | Arrowline Logistics";
    setMetaTag("name", "robots", "noindex, follow");

    const cleanPath = (path || window.location.pathname).split("#")[0];
    const canonicalHref = cleanPath.startsWith("http")
      ? cleanPath
      : `${SITE_URL}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.setAttribute("href", canonicalHref);

    return () => {
      document.title = originalTitle;
      const robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (robots) robots.setAttribute("content", originalRobots || "index, follow");
      const canonicalAgain = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (canonicalAgain) canonicalAgain.setAttribute("href", originalCanonical);
    };
  }, [path]);

  return null;
}