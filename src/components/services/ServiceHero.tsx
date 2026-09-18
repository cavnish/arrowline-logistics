import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, Phone } from "lucide-react";
import Reveal from "../Reveal";
import SmartImage, { FALLBACK_IMAGE } from "../ui/SmartImage";
import { COMPANY_DETAILS } from "../../data/logisticsData";
import { buildTel } from "../../utils/contactLinks";
import { buildImageSrcSet, getOptimizedImageUrl } from "../../utils/imageUrl";

interface ServiceHeroProps {
  badge: string;
  breadcrumb?: string[];
  headline: string;
  subheadline?: string;
  description: string;
  image: string;
  videoUrl?: string;
  fallbackImage?: string;
  imageAlt?: string;
  onOpenQuote: () => void;
}

/* Balanced split into exactly two headline rows (never more than two),
   choosing the word boundary that keeps both rows as close as possible. */
function splitHeadline(text: string): [string, string] {
  const words = text.trim().split(/\s+/);
  if (words.length < 3) {
    return [words.join(" "), ""];
  }
  let best = 1;
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const first = words.slice(0, i).join(" ").length;
    const second = words.slice(i).join(" ").length;
    const score = Math.max(first, second) - Math.min(first, second);
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

export default function ServiceHero({
  badge,
  breadcrumb = [],
  headline,
  description,
  image,
  videoUrl,
  fallbackImage,
  imageAlt,
  onOpenQuote,
}: ServiceHeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const heroMedia = fallbackImage || image || FALLBACK_IMAGE;
  const heroSrc = getOptimizedImageUrl(heroMedia, { width: 1920 });
  const heroSrcSet = buildImageSrcSet(heroMedia, [640, 960, 1280, 1600, 1920]);

  /* Preload the LCP hero image on service pages (removed on unmount). */
  useEffect(() => {
    if (videoUrl && !isVideoError) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroSrc;
    link.fetchPriority = "high";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [heroSrc, videoUrl, isVideoError]);

  const [headlineA, headlineB] = splitHeadline(headline);

  const mediaStyle: CSSProperties = reducedMotion
    ? { opacity: loaded ? 1 : 0, background: "#03121B" }
    : {
        opacity: loaded ? 1 : 0,
        transform: loaded ? "scale(1)" : "scale(1.04)",
        transition:
          "opacity 0.9s ease, transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
        background: "#03121B",
      };

  const crumb = breadcrumb.length > 0 ? breadcrumb : [badge];

  return (
    <section className="relative w-full overflow-hidden bg-[#03121B] text-white">
      {/* ── Background Media Layer (covers the entire hero) ── */}
      <div className="absolute inset-0">
        {videoUrl && !isVideoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroSrc}
            onError={() => setIsVideoError(true)}
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={mediaStyle}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <img
              src={heroSrc}
              alt={imageAlt || headline}
              className="h-full w-full object-cover object-center"
            />
          </video>
        ) : (
          <SmartImage
            src={heroSrc}
            srcSet={heroSrcSet}
            sizes="100vw"
            alt={imageAlt || headline}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[50%_30%] md:object-[55%_center]"
            style={mediaStyle}
          />
        )}

        {/* Layered readability overlays — navy cinematic treatment keeps the
            image clearly visible while text stays extremely legible. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,27,38,0.93)_0%,rgba(3,27,38,0.78)_46%,rgba(3,27,38,0.35)_100%)]"
        />
        {/* Mobile: balanced vertical overlay so text never fights the photo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden bg-[linear-gradient(180deg,rgba(3,27,38,0.35)_0%,rgba(3,27,38,0.6)_48%,rgba(3,27,38,0.82)_100%)]"
        />
        {/* Soft bottom blend into the page background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#03212D]/85 via-transparent to-transparent"
        />
        {/* Subtle orange atmospheric glow, top right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(255,107,26,0.16),transparent_58%)]"
        />
      </div>

      {/* ── Content layer (left-aligned; image subject stays visible on the right) ──
          Content-driven height: mobile clears the fixed header, no 100vh/min-h. */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pb-12 pt-32 sm:px-6 md:pt-36 md:pb-16 lg:px-8 lg:pt-40 lg:pb-20">
        <div
          className="flex max-w-2xl flex-col gap-5 sm:gap-6 md:gap-7"
          style={{ containerType: "inline-size" }}
        >
          {/* Breadcrumb / service label */}
          <Reveal delay={80} direction="up">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#FF9A5B]/95 sm:text-[11px]"
            >
              <span
                aria-hidden="true"
                className="h-px w-8 shrink-0 bg-gradient-to-r from-[#FF6B1A] to-transparent"
              />
              {crumb.map((item, index) => (
                <span key={index} className="flex items-center gap-2.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-white/30">
                      /
                    </span>
                  )}
                  <span className={index === crumb.length - 1 ? "text-white/90" : "text-[#FF9A5B]/85"}>
                    {item}
                  </span>
                </span>
              ))}
            </nav>
          </Reveal>

          {/* H1 — engineered two-row headline with orange accent on the second row */}
          <Reveal delay={160} direction="up">
            <h1 className="whitespace-nowrap text-[clamp(1rem,5.6cqw,3.35rem)] font-black leading-[1.1] tracking-tight text-white">
              <span className="block">{headlineA}</span>
              {headlineB && (
                <span className="block bg-gradient-to-r from-[#FF8A3D] via-[#FF9552] to-[#FFB27D] bg-clip-text text-transparent">
                  {headlineB}
                </span>
              )}
            </h1>
          </Reveal>

          {/* Short supporting description */}
          <Reveal delay={240} direction="up">
            <p className="max-w-xl text-[clamp(0.95rem,1.2vw,1.15rem)] leading-relaxed text-slate-200/95">
              {description}
            </p>
          </Reveal>

          {/* CTA buttons — full-width stacked on mobile, row on desktop */}
          <Reveal delay={320} direction="up">
            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap md:gap-3">
              <button
                type="button"
                onClick={onOpenQuote}
                className="btn-shine relative flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] px-8 text-xs font-black uppercase tracking-[0.14em] text-white shadow-xl shadow-orange-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#E55A0D] hover:to-[#FF7A00] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03121B] sm:w-auto sm:px-9"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <a
                href={buildTel(COMPANY_DETAILS.phone)}
                aria-label={`Talk to our logistics team on ${COMPANY_DETAILS.phone}`}
                className="flex h-[52px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-white/25 bg-white/[0.08] px-8 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#03121B] sm:w-auto sm:px-9"
              >
                <Phone className="h-4 w-4 text-[#FF9A5B]" aria-hidden="true" />
                Talk to Our Logistics Team
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}