import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import SmartImage from "@/components/SmartImage";
import FaqList from "@/components/FaqList";
import { sanityFetch } from "@/lib/sanity/client";
import { subServiceQuery, serviceSlugsByParentQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { ServiceDetail } from "@/lib/types";

export const revalidate = 300;

export async function generateStaticParams() {
  // Parent slugs are enumerated at build time; sub-slugs are generated per
  // parent on demand (and cached) so a large catalogue doesn't explode the build.
  const parents = await sanityFetch<Array<{ slug: string; parent?: string | null }>>(
    /* groq */ `*[_type == "service" && defined(slug.current) && !defined(parent) && isPublished != false]{ "slug": slug.current }`,
  );
  if (!parents) return [];
  const params: Array<{ slug: string; subSlug: string }> = [];
  for (const parent of parents) {
    const subs = await sanityFetch<Array<{ slug: string }>>(serviceSlugsByParentQuery, { parentSlug: parent.slug });
    for (const sub of subs || []) params.push({ slug: parent.slug, subSlug: sub.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const service = await sanityFetch<ServiceDetail>(subServiceQuery, { parentSlug: slug, subSlug });
  return buildMetadata({
    seo: service?.seo,
    fallbackTitle: service?.title || "Service",
    fallbackDescription: service?.shortDescription || undefined,
    path: `/services/${slug}/${subSlug}`,
  });
}

export default async function SubServicePage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const { slug, subSlug } = await params;
  const service = await sanityFetch<ServiceDetail>(subServiceQuery, { parentSlug: slug, subSlug });
  if (!service) notFound();

  const faqs = (service.faqs || []).map((faq, index) => ({ _id: `${subSlug}-faq-${index}`, ...faq }));

  return (
    <article>
      <section className="bg-navy-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-slate-300">
            <Link href="/services" className="hover:text-white">Services</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <Link href={`/services/${slug}`} className="hover:text-white">{service.parent?.title || slug}</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-orange">{service.title}</span>
          </nav>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{service.heroHeadline || service.title}</h1>
          {service.heroSubheadline && <p className="mt-4 max-w-3xl text-slate-200">{service.heroSubheadline}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {service.heroImage && (
          <div className="overflow-hidden rounded-2xl">
            <SmartImage value={service.heroImage} width={1200} height={700} className="h-auto w-full" priority sizes="100vw" />
          </div>
        )}
        {service.fullDescription && <p className="mt-6 leading-relaxed text-slate-700">{service.fullDescription}</p>}

        {service.capabilities && service.capabilities.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-black text-navy">Capabilities</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-700">
              {service.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </div>
        )}

        {faqs.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-black text-navy">FAQs</h2>
            <FaqList faqs={faqs} />
          </div>
        )}
      </div>
    </article>
  );
}
