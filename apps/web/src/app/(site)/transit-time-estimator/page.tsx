import type { Metadata } from "next";

import TransitEstimatorPage from "@/components/estimator/TransitEstimatorPage";
import { sanityFetch } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { SiteSettings } from "@/lib/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    fallbackTitle:
      "Transit Time Estimator | Road Transit Between Any Two Indian Cities | Arrowline",
    fallbackDescription:
      "Estimate road distance, transit days, and delivery window between any two Indian cities — Mundra, Delhi NCR, Mumbai, Jaipur, Bengaluru & 100+ hubs — for containers, FTL, trailers, ODC & project cargo.",
    keywords: [
      "Mundra to Delhi transit time",
      "Mundra to Mumbai road distance",
      "FTL transit time India",
      "container transport days Mundra",
      "road freight delivery estimate India",
      "logistics transit calculator India",
      "Mundra Port road connectivity",
    ],
    path: "/transit-time-estimator",
  });
}

export default async function TransitTimeEstimatorRoute() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);

  return <TransitEstimatorPage phone={settings?.phone || undefined} whatsapp={settings?.whatsapp || undefined} />;
}
