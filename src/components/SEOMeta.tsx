import { useEffect } from "react";
import { getOrganizationSchema, getLocalBusinessSchema } from "../data/logisticsData";

interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export default function SEOMeta({
  title,
  description,
  keywords = "multimodal logistics India, road transport FTL, coastal shipping India, Mundra Port logistics, ODC transport Gujarat, rail freight CONCOR, project cargo India, customs brokerage Mundra, shipping cargo India",
  canonicalUrl = "https://www.arrowlinelogistics.in",
  ogImage = "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg"
}: SEOMetaProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | ARROWLINE LOGISTICS`;

    // Helper function to set or create meta tag
    const setMetaTag = (attribute: "name" | "property", value: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Set Meta Description & Keywords
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);

    // 3. Set Open Graph (OG) tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", window.location.href);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:site_name", "ARROWLINE LOGISTICS");

    // 4. Set Twitter tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 5. Set Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", window.location.href || canonicalUrl);

    // 6. Inject JSON-LD Structured Data for SEO (Organization and LocalBusiness)
    const orgSchema = getOrganizationSchema();
    const localSchema = getLocalBusinessSchema();

    let scriptTag = document.getElementById("seo-structured-data") as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "seo-structured-data";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify([orgSchema, localSchema], null, 2);

    return () => {
      // Optional cleanup if needed (avoiding flickering during navigation)
    };
  }, [title, description, keywords, canonicalUrl, ogImage]);

  return null; // This component doesn't render any visible DOM nodes
}
