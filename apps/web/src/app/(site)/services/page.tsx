import type { Metadata } from "next";

import ServiceCard from "@/components/ServiceCard";
import { sanityFetch } from "@/lib/sanity/client";
import { servicesPageQuery, servicesQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { ServiceSummary } from "@/lib/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<{ seo?: any }>(servicesPageQuery);
  return buildMetadata({ seo: page?.seo, fallbackTitle: "Logistics Services", path: "/services" });
}

export default async function ServicesPage() {
  const [page, services] = await Promise.all([
    sanityFetch<{ heading?: string; intro?: string }>(servicesPageQuery),
    sanityFetch<ServiceSummary[]>(servicesQuery),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">
        {page?.heading || "Our Logistics Services"}
      </h1>
      {page?.intro && <p className="mt-4 max-w-3xl text-slate-600">{page.intro}</p>}

      {services && services.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-500">No services published yet.</p>
      )}
    </div>
  );
}
