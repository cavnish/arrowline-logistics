import { useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { FALLBACK_IMAGE } from "../ui/SmartImage";
import { COMPANY_DETAILS } from "../../data/logisticsData";
import { buildTel } from "../../utils/contactLinks";
import { buildImageSrcSet, getOptimizedImageUrl } from "../../utils/imageUrl";
import { AL_EASE } from "../motion/primitives";
import ServiceTrustStrip from "./ServiceTrustStrip";

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

/* Full-bleed background: walks the candidate list (service heroImage →
   branded fallback) and advances on load error so the hero never shows a
   broken image. Fills the whole hero with background-size: cover behaviour. */
function HeroBackdrop({
  srcs,
  position,
}: {
  srcs: string[];
  position: string;
}) {
  const [stage, setStage] = useState(0);
  const reduceMotion = useReducedMotion();
  const raw = srcs[Math.min(stage, srcs.length - 1)];
  const src = getOptimizedImageUrl(raw, { width: 1920 });
  const srcSet = buildImageSrcSet(raw, [640, 960, 1280, 1600, 1920]) || undefined;
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: AL_EASE }}
      className="absolute inset-0"
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes="100vw"
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onError={() => setStage((s) => Math.min(s + 1, srcs.length - 1))}
        style={{ objectPosition: position }}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}

export default function ServiceHero({
  headline,
  description,
  image,
  fallbackImage,
  onOpenQuote,
}: ServiceHeroProps) {
  const [headlineA, headlineB] = splitHeadline(headline);
  const reduceMotion = useReducedMotion();
  const heroMedia = fallbackImage || image || FALLBACK_IMAGE;
  const backdropSrcs = [heroMedia, FALLBACK_IMAGE]
    .filter((s): s is string => Boolean(s))
    .filter((s, i, arr) => arr.indexOf(s) === i);

  return (
    <section className="service-hero-min relative flex w-full flex-col overflow-hidden bg-[#062B3A] text-white">
      {/* ── Layer 1 — full-bleed photograph + cinematic overlays ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <HeroBackdrop
          srcs={backdropSrcs}
          position="center"
        />

        {/* Navy scrim → transparent. Dark enough only behind the copy on the
            left for white text readability, and near-clear on the right so the
            photograph keeps its original look, colours and exposure. */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,43,58,0.82)_0%,rgba(6,43,58,0.56)_36%,rgba(6,43,58,0.2)_64%,rgba(6,43,58,0.04)_86%)]" />
        {/* Mobile/tablet readability veil — the copy spans the full width on
            small screens, so a soft even navy veil keeps the text readable
            without hiding the photograph (desktop stays nearly veil-free). */}
        <div className="absolute inset-0 bg-[#062B3A]/35 md:hidden" />
        {/* Warm orange atmospheric light — kept very subtle so it does not
            shift the photograph's colours noticeably. */}
        <div className="absolute inset-0 bg-[radial-gradient(1100px_at_78%_16%,rgba(255,122,45,0.1),transparent_62%)]" />
        {/* Soft bottom scrim so the trust band sits on a stable base */}
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(4,13,20,0)_0%,rgba(4,13,20,0.28)_100%)]" />
      </div>

      {/* ── Layer 2 — copy over the photograph ── */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-4 pb-16 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:pt-32 lg:px-8 lg:pb-8 lg:pt-36">
        <div className="max-w-[620px]">
          {/* Main heading — white, accent row in brand orange */}
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: AL_EASE, delay: 0.15 }}
            className="text-[clamp(1.8rem,4.5vw,3.9rem)] font-black leading-[1.02] tracking-tight text-white [text-wrap:balance]"
          >
            <span className="block">{headlineA}</span>
            {headlineB && (
              <span className="block bg-gradient-to-r from-[#FF8C2A] via-[#FF7A1F] to-[#FF6B1A] bg-clip-text text-transparent">
                {headlineB}
              </span>
            )}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: AL_EASE, delay: 0.3 }}
            className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.6] text-white/[0.88] sm:mt-4 sm:text-[1.05rem]"
          >
            {description}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: AL_EASE, delay: 0.45 }}
            className="mt-5 flex w-full flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center md:gap-3.5"
          >
            <motion.button
              type="button"
              onClick={onOpenQuote}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] px-6 text-[13px] font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_24px_-10px_rgba(255,107,26,0.55)] transition-shadow duration-300 hover:shadow-[0_18px_34px_-10px_rgba(255,107,26,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#062B3A] sm:h-[52px] sm:w-auto sm:px-8"
            >
              Get a Free Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </motion.button>

            <motion.a
              href={buildTel(COMPANY_DETAILS.phone)}
              aria-label={`Talk to our logistics team on ${COMPANY_DETAILS.phone}`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border border-white/40 bg-white/90 px-6 text-[13px] font-black uppercase tracking-[0.14em] text-[#062B3A] shadow-[0_12px_24px_-14px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-shadow duration-300 hover:bg-white hover:shadow-[0_18px_34px_-14px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#062B3A] sm:h-[52px] sm:w-auto sm:px-8"
            >
              <Phone className="h-4 w-4 text-[#FF6B1A]" aria-hidden="true" />
              Talk to Our Logistics Team
            </motion.a>
          </motion.div>

          {/* ── Credibility line — small, left-aligned, directly under the
               CTAs (starts immediately below the buttons, never pinned to the
               bottom edge of the hero) ── */}
          <ServiceTrustStrip />
        </div>
      </div>
    </section>
  );
}