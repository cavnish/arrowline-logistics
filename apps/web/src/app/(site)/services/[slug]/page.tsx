import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import SmartImage from "@/components/SmartImage";
import FaqList from "@/components/FaqList";
import ServiceSections from "@/components/ServiceSections";
import { sanityFetch } from "@/lib/sanity/client";
import { serviceBySlugQuery, serviceParamsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { ServiceDetail } from "@/lib/types";

export const revalidate = 300;

export async function generateStaticParams() {
  const params = await sanityFetch<Array<{ slug: string; parent?: string | null }>>(serviceParamsQuery);
  if (!params) return [];
  return params.filter((item) => !item.parent).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await sanityFetch<ServiceDetail>(serviceBySlugQuery, { slug });
  return buildMetadata({
    seo: service?.seo,
    fallbackTitle: service?.title || "Service",
    fallbackDescription: service?.shortDescription || undefined,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await sanityFetch<ServiceDetail>(serviceBySlugQuery, { slug });
  if (!service) notFound();

  const subServices = await sanityFetch<Array<{ _id: string; title: string; slug: string; shortDescription?: string }>>(
    /* groq */ `*[_type == "service" && parent->slug.current == $slug && isPublished != false] | order(order asc){ _id, title, "slug": slug.current, shortDescription }`,
    { slug },
  );

  const faqs = (service.faqs || []).map((faq, index) => ({ _id: `${slug}-faq-${index}`, ...faq }));

  return (
    <article>
      <section className="bg-navy-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{service.heroHeadline || service.title}</h1>
          {service.heroSubheadline && <p className="mt-4 max-w-3xl text-slate-200">{service.heroSubheadline}</p>}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          {service.heroImage && (
            <div className="overflow-hidden rounded-2xl">
              <SmartImage value={service.heroImage} width={1200} height={700} className="h-auto w-full" priority sizes="(max-width: 1024px) 100vw, 66vw" />
            </div>
          )}
          {service.fullDescription && <p className="mt-6 leading-relaxed text-slate-700">{service.fullDescription}</p>}

          <ServiceSections service={service} />

          {faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-black text-navy">FAQs</h2>
              <FaqList faqs={faqs} />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          {subServices && subServices.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-orange">Sub-services</h2>
              <ul className="mt-3 space-y-2">
                {subServices.map((sub) => (
                  <li key={sub._id}>
                    <Link href={`/services/${slug}/${sub.slug}`} className="text-sm font-semibold text-navy hover:text-orange">
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Link
            href="/contact"
            className="block rounded-2xl bg-orange px-5 py-4 text-center text-sm font-black uppercase tracking-wide text-white hover:bg-orange-bright"
          >
            Request a quote
          </Link>
        </aside>
      </div>
    </article>
  );
}
