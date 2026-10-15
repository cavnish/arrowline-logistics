import type { Metadata } from "next";

import type { SeoFields } from "@/lib/types";
import { urlFor } from "@/lib/sanity/image";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://arrowlinelogistics.in").replace(/\/+$/, "");

export const DEFAULT_TITLE =
  "Arrowline Logistics | Mundra Port Logistics & Pan-India Transportation Services";
export const DEFAULT_DESCRIPTION =
  "Arrowline Logistics is an authorized multimodal logistics and transportation company headquartered at Mundra Port, Gujarat — container haulage, FTL road freight, rail corridors, ODC heavy haulage and warehousing.";

/** Build Next Metadata from a Sanity `seo` object with sensible site defaults. */
export function buildMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  path,
  keywords,
}: {
  seo?: SeoFields | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const title = seo?.title || fallbackTitle || DEFAULT_TITLE;
  const description = seo?.description || fallbackDescription || DEFAULT_DESCRIPTION;
  const canonical = seo?.canonical || (path ? `${SITE_URL}${path}` : SITE_URL);
  const ogImage = seo?.ogImage ? urlFor(seo.ogImage).width(1200).height(630).url() : undefined;

  return {
    title,
    description,
    keywords: seo?.keywords || (keywords && keywords.length ? keywords : undefined),
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Arrowline Logistics",
      locale: "en_IN",
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/** JSON-LD Organization + LocalBusiness, reused on every page. */
export function organizationJsonLd(settings?: { phone?: string | null; email?: string | null; address?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Arrowline Logistics",
    alternateName: "Arrowline Multimodal Logistics",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    telephone: settings?.phone || undefined,
    email: settings?.email || undefined,
    address: settings?.address
      ? { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "IN" }
      : undefined,
  };
}
