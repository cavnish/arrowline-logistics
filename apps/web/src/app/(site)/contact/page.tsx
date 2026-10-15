import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import { sanityFetch } from "@/lib/sanity/client";
import { contactPageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { SeoFields, SiteSettings } from "@/lib/types";

export const revalidate = 300;

interface ContactData {
  heading?: string | null;
  intro?: string | null;
  formHeading?: string | null;
  mapEmbedUrl?: string | null;
  seo?: SeoFields | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<ContactData>(contactPageQuery);
  return buildMetadata({ seo: page?.seo, fallbackTitle: "Contact Us", path: "/contact" });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    sanityFetch<ContactData>(contactPageQuery),
    sanityFetch<SiteSettings>(siteSettingsQuery),
  ]);

  const phone = settings?.phone || "+91 99222 04446";
  const email = settings?.email || "info@arrowlinelogistics.in";

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">
        {page?.heading || "Contact Arrowline Logistics"}
      </h1>
      {page?.intro && <p className="mt-4 max-w-3xl text-slate-600">{page.intro}</p>}

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <ContactForm formHeading={page?.formHeading} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-black uppercase tracking-wide text-orange">Head office</h2>
            <address className="mt-3 space-y-2 text-sm not-italic text-slate-700">
              {settings?.address && <p>{settings.address}</p>}
              <p>
                <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="font-semibold text-navy hover:text-orange">
                  {phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${email}`} className="font-semibold text-navy hover:text-orange">
                  {email}
                </a>
              </p>
            </address>
          </div>

          {page?.mapEmbedUrl && (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                src={page.mapEmbedUrl}
                title="Arrowline Logistics location"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
