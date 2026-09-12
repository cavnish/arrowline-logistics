import { useState, useEffect } from "react";
import { ArrowRight, Phone, Play } from "lucide-react";
import Reveal from "../Reveal";
import ServiceBreadcrumb from "./ServiceBreadcrumb";
import { COMPANY_DETAILS } from "../../data/logisticsData";
import { buildTel } from "../../utils/contactLinks";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface ServiceHeroProps {
  badge: string;
  headline: string;
  subheadline?: string;
  description: string;
  image: string;
  videoUrl?: string;
  fallbackImage?: string;
  breadcrumbItems?: BreadcrumbItem[];
  onOpenQuote: () => void;
  onExploreContent?: () => void;
}

export default function ServiceHero({
  badge,
  headline,
  description,
  image,
  videoUrl,
  fallbackImage,
  breadcrumbItems,
  onOpenQuote,
}: ServiceHeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const heroMediaBg = fallbackImage || image || "/images/hero-logistics.jpg";

  return (
    <section className="relative w-full min-h-[75vh] lg:min-h-[82vh] flex items-center overflow-hidden bg-[#062B3A] text-white">
      {/* ── Background Media Layer ── */}
      <div className="absolute inset-0 z-0">
        {videoUrl && !isVideoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroMediaBg}
            onError={() => setIsVideoError(true)}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <img
              src={heroMediaBg}
              alt={headline}
              className="w-full h-full object-cover object-center"
            />
          </video>
        ) : (
          <img
            src={heroMediaBg}
            alt={headline}
            className="w-full h-full object-cover object-center"
            style={{
              transform: loaded ? "scale(1)" : "scale(1.05)",
              transition: "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        )}

        {/* Cinematic Gradient Overlays (Matching Home/Reference Design) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03212D]/95 via-[#03212D]/80 to-[#03212D]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03212D] via-transparent to-[#03212D]/60" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF6B1A]/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
      </div>

      {/* ── Content Container ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 flex flex-col justify-center">
        <div className="max-w-4xl space-y-6">

          {/* Breadcrumb (for sub-services & navigation) */}
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <ServiceBreadcrumb items={breadcrumbItems} />
          )}

          {/* Eyebrow Badge */}
          <Reveal delay={50}>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-black tracking-widest text-[#FF9A5B] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF6B1A] animate-pulse" />
              <span>{badge}</span>
            </div>
          </Reveal>

          {/* H1 Headline */}
          <Reveal delay={120}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
              {headline}
            </h1>
          </Reveal>

          {/* Description */}
          <Reveal delay={200}>
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-3xl font-medium">
              {description}
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={280}>
            <div className="flex flex-col sm:flex-row gap-3.5 pt-4">
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-7 py-4 bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] hover:from-[#E55A0D] hover:to-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xl shadow-orange-950/40 transition-all hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5"
              >
                <span>GET A FREE QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={buildTel(COMPANY_DETAILS.phone)}
                className="px-7 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#FF6B1A]" />
                <span>Talk to Our Logistics Team</span>
              </a>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
