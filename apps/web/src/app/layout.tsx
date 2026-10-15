import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL, organizationJsonLd } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | Arrowline Logistics" },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Arrowline Logistics",
  authors: [{ name: "Arrowline Logistics" }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#03212D",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Organization JSON-LD is intentionally static; per-page schema is added in pages.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
