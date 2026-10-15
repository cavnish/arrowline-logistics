import type { Metadata } from "next";

import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCard from "@/components/TestimonialCard";
import FaqList from "@/components/FaqList";
import { sanityFetch } from "@/lib/sanity/client";
import { faqsQuery, homePageQuery, servicesQuery, testimonialsQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { Faq, ServiceSummary, Testimonial } from "@/lib/types";

export const revalidate = 300;

interface HomeData {
  heroBadge?: string | null;
  heroHeadline?: string | null;
  heroSubheadline?: string | null;
  heroImage?: any;
  heroVideo?: string | null;
  primaryCta?: { label?: string; href?: string } | null;
  secondaryCta?: { label?: string; href?: string } | null;
  stats?: Array<{ value: string; label: string; description?: string }> | null;
  servicesHeading?: string | null;
  whyChooseUsHeading?: string | null;
  testimonialsHeading?: string | null;
  faqHeading?: string | null;
  seo?: any;
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await sanityFetch<HomeData>(homePageQuery);
  return buildMetadata({ seo: home?.seo, path: "/" });
}

export default async function HomePage() {
  const [home, services, testimonials, faqs] = await Promise.all([
    sanityFetch<HomeData>(homePageQuery),
    sanityFetch<ServiceSummary[]>(servicesQuery),
    sanityFetch<Testimonial[]>(testimonialsQuery),
    sanityFetch<Faq[]>(faqsQuery),
  ]);

  return (
    <>
      <Hero
        badge={home?.heroBadge}
        headline={home?.heroHeadline}
        subheadline={home?.heroSubheadline}
        image={home?.heroImage}
        videoUrl={home?.heroVideo}
        primaryCta={home?.primaryCta}
        secondaryCta={home?.secondaryCta}
      />

      {home?.stats && home.stats.length > 0 && (
        <section className="border-b border-slate-200 bg-white">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
            {home.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="text-3xl font-black text-orange">{stat.value}</dt>
                <dd className="mt-1 text-sm font-semibold text-navy">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black tracking-tight text-navy sm:text-3xl">
          {home?.servicesHeading || "Our Services"}
        </h2>
        {services && services.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Services will appear here once the Sanity content is connected and published.
          </p>
        )}
      </section>

      {testimonials && testimonials.length > 0 && (
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black tracking-tight text-navy sm:text-3xl">
              {home?.testimonialsHeading || "What our clients say"}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black tracking-tight text-navy sm:text-3xl">
            {home?.faqHeading || "Frequently asked questions"}
          </h2>
          <div className="mt-8">
            <FaqList faqs={faqs} />
          </div>
        </section>
      )}
    </>
  );
}
