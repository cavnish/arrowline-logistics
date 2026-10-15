import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import SmartImage from "@/components/SmartImage";
import type { SanityImageValue } from "@/lib/sanity/image";

interface HeroProps {
  badge?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  image?: SanityImageValue | null;
  videoUrl?: string | null;
  primaryCta?: { label?: string; href?: string } | null;
  secondaryCta?: { label?: string; href?: string } | null;
}

export default function Hero({ badge, headline, subheadline, image, videoUrl, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-dark text-white">
      <div className="absolute inset-0 -z-10 opacity-40">
        {videoUrl ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={videoUrl} />
          </video>
        ) : (
          <SmartImage value={image} width={1920} height={1080} className="h-full w-full object-cover" priority sizes="100vw" />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          {badge && (
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange">
              {badge}
            </span>
          )}
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {headline || "Moving Possibilities. Delivering Trust."}
          </h1>
          <p className="mt-5 text-lg text-slate-200">
            {subheadline ||
              "Multimodal logistics from Mundra Port to every corner of India — container haulage, FTL freight, rail corridors, ODC heavy haulage and warehousing."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryCta?.href || "/contact"}
              className="inline-flex items-center gap-2 rounded-xl bg-orange px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-orange-bright"
            >
              {primaryCta?.label || "Get a Quote"} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={secondaryCta?.href || "/services"}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-white/10"
            >
              <Play className="h-4 w-4" aria-hidden /> {secondaryCta?.label || "Our Services"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
