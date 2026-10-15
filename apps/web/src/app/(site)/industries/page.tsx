import type { Metadata } from "next";

import SmartImage from "@/components/SmartImage";
import { sanityFetch } from "@/lib/sanity/client";
import { industriesQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { Industry } from "@/lib/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ fallbackTitle: "Industries We Serve", path: "/industries" });
}

export default async function IndustriesPage() {
  const industries = await sanityFetch<Industry[]>(industriesQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">Industries We Serve</h1>
      <p className="mt-4 max-w-3xl text-slate-600">
        From chemicals and textiles to heavy engineering and agriculture, our multimodal network moves industry-critical
        cargo with the discipline each sector demands.
      </p>

      {industries && industries.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <div key={industry._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="relative aspect-[16/9] bg-surface">
                <SmartImage value={industry.image} width={800} height={450} className="h-full w-full object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-black text-navy">{industry.title}</h2>
                {industry.description && <p className="mt-2 text-sm text-slate-600">{industry.description}</p>}
                {industry.cargoTypes && industry.cargoTypes.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {industry.cargoTypes.map((cargo) => (
                      <li key={cargo} className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-navy">
                        {cargo}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-500">Industries will appear here once published in the CMS.</p>
      )}
    </div>
  );
}
