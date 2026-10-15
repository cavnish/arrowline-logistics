import type { Metadata } from "next";

import SmartImage from "@/components/SmartImage";
import { sanityFetch } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";
import type { SeoFields } from "@/lib/types";

export const revalidate = 300;

interface AboutData {
  heroHeading?: string | null;
  heroSubheading?: string | null;
  heroImage?: any;
  intro?: string | null;
  pillars?: Array<{ icon?: string; title: string; text?: string }> | null;
  milestones?: Array<{ year: string; title: string; text?: string }> | null;
  differentiators?: Array<{ title: string; text?: string }> | null;
  leadershipHeading?: string | null;
  leaders?: Array<{ name: string; role?: string; location?: string; email?: string; bio?: string; image?: any }> | null;
  coreValues?: Array<{ title: string; description?: string }> | null;
  seo?: SeoFields | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const about = await sanityFetch<AboutData>(aboutPageQuery);
  return buildMetadata({ seo: about?.seo, fallbackTitle: "About Us", path: "/about" });
}

export default async function AboutPage() {
  const about = await sanityFetch<AboutData>(aboutPageQuery);

  return (
    <div>
      <section className="bg-navy-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {about?.heroHeading || "About Arrowline Logistics"}
          </h1>
          {about?.heroSubheading && <p className="mt-4 max-w-3xl text-slate-200">{about.heroSubheading}</p>}
        </div>
      </section>

      {about?.heroImage && (
        <div className="mx-auto -mt-0 max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl">
            <SmartImage value={about.heroImage} width={1600} height={700} className="h-auto w-full" priority sizes="100vw" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {about?.intro && <p className="max-w-3xl leading-relaxed text-slate-700">{about.intro}</p>}

        {about?.pillars && about.pillars.length > 0 && (
          <section className="mt-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {about.pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-black text-navy">{pillar.title}</h2>
                  {pillar.text && <p className="mt-2 text-sm text-slate-600">{pillar.text}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {about?.milestones && about.milestones.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-navy">Our Journey</h2>
            <ol className="mt-6 space-y-6 border-l-2 border-orange/30 pl-6">
              {about.milestones.map((milestone) => (
                <li key={`${milestone.year}-${milestone.title}`}>
                  <span className="text-sm font-black text-orange">{milestone.year}</span>
                  <h3 className="text-lg font-bold text-navy">{milestone.title}</h3>
                  {milestone.text && <p className="text-sm text-slate-600">{milestone.text}</p>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {about?.differentiators && about.differentiators.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-navy">Why Arrowline</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {about.differentiators.map((item) => (
                <div key={item.title} className="rounded-2xl bg-cream p-6">
                  <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                  {item.text && <p className="mt-2 text-sm text-slate-600">{item.text}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {about?.leaders && about.leaders.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-navy">{about.leadershipHeading || "Leadership"}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {about.leaders.map((leader) => (
                <div key={leader.name} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-surface">
                    <SmartImage value={leader.image} width={192} height={192} className="h-full w-full object-cover" sizes="96px" />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-navy">{leader.name}</h3>
                  {leader.role && <p className="text-sm font-semibold text-orange">{leader.role}</p>}
                  {leader.bio && <p className="mt-2 text-sm text-slate-600">{leader.bio}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {about?.coreValues && about.coreValues.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-navy">Core Values</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {about.coreValues.map((value) => (
                <div key={value.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-bold text-navy">{value.title}</h3>
                  {value.description && <p className="mt-2 text-sm text-slate-600">{value.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
