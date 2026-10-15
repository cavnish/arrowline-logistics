import { sanityFetch } from "@/lib/sanity/client";
import { navigationQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import type { Navigation, SiteSettings } from "@/lib/types";
import type { ReactNode } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [navigation, settings] = await Promise.all([
    sanityFetch<Navigation>(navigationQuery),
    sanityFetch<SiteSettings>(siteSettingsQuery),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header navigation={navigation} settings={settings} />
      <main id="main" className="flex-grow">
        {children}
      </main>
      <Footer navigation={navigation} settings={settings} />
    </div>
  );
}
