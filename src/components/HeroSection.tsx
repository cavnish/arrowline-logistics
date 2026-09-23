import { useState, useEffect, type CSSProperties } from "react";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import SmartImage from "./ui/SmartImage";
import HeroVideo from "./ui/HeroVideo";
import { buildImageSrcSet } from "../utils/imageUrl";
import { cn } from "../utils/cn";

interface HeroSectionProps {
  onOpenQuote: () => void;
  onExploreServices: () => void;
}

const SERVICES = ["Road Transport", "Freight Forwarding", "Multimodal Logistics", "Container Cargo", "Project Cargo", "Custom Clearance"];

const HERO_IMAGE_FALLBACK =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg";

export default function HeroSection({ onOpenQuote, onExploreServices }: HeroSectionProps) {
  const content = useSiteContent();
  const [loaded, setLoaded] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [videoModal, setVideoModal] = useState(false);

  /* Stagger-in on mount */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  /* Rotating service word */
  useEffect(() => {
    const iv = setInterval(() => setActiveService(p => (p + 1) % SERVICES.length), 2400);
    return () => clearInterval(iv);
  }, []);

  const scrollDown = () => {
    const el = document.getElementById("services-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else onExploreServices();
  };

  /* Heading keeps a single orange accent phrase while the whole string stays
     CMS-driven — the orange highlight is only applied when the text ends with
     the exact brand phrase so custom copy never breaks the layout.
     The headline is always forced into exactly two rows ("Logistics &
     Transportation" / "Services Across India") so the brand phrase never
     spills into 3–4 awkward wrapped lines. */
  const headingFull = content("hero_title", "Logistics & Transportation Services Across India");
  const ACCENT = "Across India";
  const splitAt = headingFull.indexOf("Services");
  const row1 = splitAt > 0 ? headingFull.slice(0, splitAt).trim() : "Logistics & Transportation";
  const row2 = splitAt > 0 ? headingFull.slice(splitAt).trim() : "Services Across India";
  const hasAccent = row2.endsWith(` ${ACCENT}`);
  const row2Lead = hasAccent ? row2.slice(0, row2.length - ACCENT.length - 1).trim() : row2;

  const heroImg = content("hero_image", HERO_IMAGE_FALLBACK);
  const heroVideo = content("hero_video", "");

  /* Preload the home LCP hero image (route-specific; the static index.html
     preload was removed so service pages don't waste bandwidth on it). */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroImg;
    link.fetchPriority = "high";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [heroImg]);

  return (
    <section
      aria-label="Arrowline Logistics — Pan-India logistics and transportation"
      className="hero-min relative flex w-full flex-col overflow-hidden bg-[#03212D]"
    >
      {/* ── BG photo + overlays ── */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <SmartImage
          src={heroImg}
          alt="Arrowline Logistics container terminal operations at Mundra Port, Gujarat"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1080}
          srcSet={buildImageSrcSet(heroImg, [640, 960, 1280, 1600, 1920])}
          sizes="100vw"
          className={cn(
            "h-full w-full object-cover object-[50%_35%] sm:object-center will-change-transform",
            loaded && "hero-bg-zoom"
          )}
          style={{
            transform: loaded ? "scale(1)" : "scale(1.08)",
            transition: "transform 2.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        {/* Admin-uploaded hero video (full-bleed, muted/looping) — the image
            above doubles as the poster + fallback until/unless it plays. */}
        {heroVideo && (
          <HeroVideo
            src={heroVideo}
            poster={heroImg}
            className="absolute inset-0 h-full w-full object-cover object-[50%_35%] sm:object-center"
          />
        )}

        {/* Navy → transparent sweep (mobile full-strength, tablet/desktop left-heavy) */}
        <div className="absolute inset-0 bg-[linear-gradient(168deg,rgba(4,26,36,0.6)_0%,rgba(4,26,36,0.8)_45%,rgba(4,26,36,0.93)_100%)] md:bg-[linear-gradient(105deg,rgba(5,31,42,0.92)_0%,rgba(5,31,42,0.8)_38%,rgba(5,31,42,0.42)_68%,rgba(5,31,42,0.15)_100%)] lg:hidden lg:bg-none" />

        {/* Navy → transparent horizontal sweep (desktop, image stays rich on the right) */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(110deg,rgba(5,30,41,0.97)_0%,rgba(5,30,41,0.88)_30%,rgba(5,30,41,0.5)_64%,rgba(5,30,41,0.16)_86%,rgba(5,30,41,0)_100%)] lg:block" />

        {/* Subtle warm/orange atmospheric gradient, top right */}
        <div className="absolute inset-0 bg-[radial-gradient(58%_52%_at_86%_16%,rgba(255,107,26,0.16),transparent_72%)]" />

        {/* Vertical readability: shade under header + guard bottom text area */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,26,36,0.5)_0%,rgba(4,26,36,0)_26%,rgba(4,26,36,0)_60%,rgba(4,26,36,0.28)_80%,rgba(4,26,36,0.55)_100%)]" />

        {/* Bottom brand fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#03212D]/95 via-[#03212D]/55 to-transparent sm:h-28" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pb-3 pt-32 sm:px-6 sm:pt-36 md:flex-1 md:justify-center md:pb-1 lg:px-8 lg:pt-40">
        <div className="max-w-[880px] space-y-3.5 md:space-y-5 lg:space-y-6" style={{ containerType: "inline-size" }}>
          {/* Badge */}
          <div style={anim(loaded, 40)}>
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-[#03212D]/40 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#FFB27D] backdrop-blur-sm sm:text-[11px] sm:tracking-[0.18em] sm:px-3.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B1A] shadow-[0_0_8px_rgba(255,107,26,0.9)]" aria-hidden="true" />
              Pan-India Logistics &amp; Transportation
            </span>
          </div>

          {/* Heading — exactly two rows, fluid sized to the heading container */}
          <div style={anim(loaded, 140)}>
            <h1 className="max-w-[880px] whitespace-nowrap text-[clamp(1.25rem,6.6cqw,3.55rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              <span className="block">
                {row1}
              </span>
              <span className="block">
                {row2Lead}
                {hasAccent && (
                  <>
                    {" "}
                    <span className="bg-gradient-to-r from-[#FF8A3D] via-[#FF9552] to-[#FFB27D] bg-clip-text text-transparent">
                      {ACCENT}
                    </span>
                  </>
                )}
              </span>
            </h1>
          </div>

          {/* Tagline with orange accent line */}
          <div style={anim(loaded, 240)}>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-10 shrink-0 rounded-full bg-gradient-to-r from-[#FF6B1A] to-[#FF9552]" aria-hidden="true" />
              <p className="text-sm font-semibold text-white/90 sm:text-base lg:text-lg">
                Moving Possibilities. Delivering Trust.
              </p>
            </div>
          </div>

          {/* Description */}
          <div style={anim(loaded, 320)}>
            <p className="max-w-[640px] text-[15px] leading-relaxed text-white/70 sm:text-base lg:text-[17px]">
              Arrowline Logistics provides FTL transportation, container transportation, multimodal logistics, project cargo and customs clearance services from Mundra, Gujarat, serving businesses across India.
            </p>
          </div>

          {/* Specialization */}
          <div style={anim(loaded, 400)}>
            <p
              className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-sm text-white/60 sm:text-[15px]"
              aria-label={`We specialize in ${SERVICES[activeService]}`}
            >
              <span className="font-semibold text-white/70">We specialize in</span>
              <span
                key={activeService}
                className="inline-flex items-center justify-center rounded-md bg-[#FF6B1A] px-3 py-1 text-xs font-bold text-white shadow-[0_4px_14px_-4px_rgba(255,107,26,0.7)] sm:text-[13px]"
                style={{ animation: "fadeUp 0.35s ease forwards" }}
                aria-hidden="true"
              >
                {SERVICES[activeService]}
              </span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex w-full flex-col gap-2.5 pt-1 sm:w-auto sm:flex-row sm:flex-wrap md:gap-3" style={anim(loaded, 480)}>
            <button
              type="button"
              onClick={onOpenQuote}
              className="group relative inline-flex h-[50px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-b from-[#FF7A2F] to-[#FF6B1A] px-7 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(255,107,26,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#E55A0D] hover:to-[#FF7A00] hover:shadow-[0_16px_38px_-10px_rgba(255,107,26,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB27D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03212D] active:translate-y-0 sm:w-auto sm:px-8 md:h-[54px]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.22),transparent)] translate-x-[-140%] transition-transform duration-700 group-hover:translate-x-[160%]"
              />
              <span className="relative flex items-center gap-2.5">
                {content("hero_cta", "Get a Free Quote")}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setVideoModal(true)}
              className="group inline-flex h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-white/25 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03212D] active:translate-y-0 sm:w-auto sm:px-8 md:h-[54px]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B1A]/25 transition-colors duration-200 group-hover:bg-[#FF6B1A]/40" aria-hidden="true">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-white text-white" />
              </span>
              Watch Our Operations
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll down indicator (desktop only — removed on mobile to keep the hero compact) ── */}
      <div className="relative z-10 hidden md:mt-8 md:flex md:justify-center md:pb-5" style={anim(loaded, 720)}>
        <button
          type="button"
          onClick={scrollDown}
          className="group flex flex-col items-center gap-1.5 text-white/45 transition-colors hover:text-[#FFB27D] cursor-pointer"
          aria-label="Scroll to services"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.24em]">Explore</span>
          <ChevronDown
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
            style={{ animation: "bounceDown 2s ease-in-out infinite" }}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ── Video modal ── */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Arrowline operations video"
          onClick={() => setVideoModal(false)}
        >
          <div className="relative bg-[#062B3A] rounded-3xl overflow-hidden w-full max-w-3xl shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setVideoModal(false)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm flex items-center justify-center transition-colors cursor-pointer" aria-label="Close video">✕</button>
            <div className="aspect-video flex items-center justify-center bg-[#03212D]">
              <div className="text-center text-white/40 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FF6B1A]/20 flex items-center justify-center mx-auto">
                  <Play className="w-7 h-7 text-[#FF6B1A] fill-[#FF6B1A] ml-1" aria-hidden="true" />
                </div>
                <p className="text-sm">Operations video coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
      `}</style>
    </section>
  );
}

/* Helper: stagger-in style */
function anim(loaded: boolean, delay: number): CSSProperties {
  return {
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  };
}