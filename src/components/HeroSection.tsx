import { useState, useEffect, type CSSProperties } from "react";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";
import SmartImage from "./ui/SmartImage";

interface HeroSectionProps {
  onOpenQuote: () => void;
  onExploreServices: () => void;
}

const SERVICES = ["Road Transport", "Freight Forwarding", "Multimodal Logistics", "Container Cargo", "Project Cargo", "Custom Clearance"];

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
    const iv = setInterval(() => setActiveService(p => (p + 1) % SERVICES.length), 2200);
    return () => clearInterval(iv);
  }, []);

  const scrollDown = () => {
    const el = document.getElementById("services-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else onExploreServices();
  };

  return (
    <section
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── BG photo + overlays ── */}
      <div className="absolute inset-0 z-0">
        <SmartImage
          src={content("hero_image", "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg")}
          alt="Arrowline Logistics — India's premier multimodal network"
          className="w-full h-full object-cover object-center"
          style={{
            transform: loaded ? "scale(1)" : "scale(1.07)",
            transition: "transform 2.2s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03212D]/95 via-[#03212D]/75 to-[#03212D]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03212D] via-transparent to-[#03212D]/50" />
        {/* Orange accent glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF6B1A]/5 blur-3xl pointer-events-none" />
      </div>

      {/* ── Animated grid lines ── */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-dark opacity-40" />

      {/* ── Floating particles ── */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute z-0 rounded-full bg-[#FF6B1A]/20 blur-sm pointer-events-none"
          style={{
            width: `${8 + i * 4}px`,
            height: `${8 + i * 4}px`,
            top: `${10 + i * 14}%`,
            left: `${5 + i * 12}%`,
            animation: `floatParticle ${4 + i * 0.7}s ease-in-out ${i * 0.5}s infinite alternate`,
          }}
        />
      ))}

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-6 flex flex-col justify-center">
        <div className="w-full flex items-center">

          {/* ── LEFT: Text ── */}
          <div className="w-full max-w-4xl space-y-6">

            {/* Eyebrow pill */}
            <div style={anim(loaded, 0)}>
              <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#FF6B1A] animate-pulse" />
                Pan-India Logistics &amp; Transportation
              </span>
            </div>

            {/* Headline */}
            <div style={anim(loaded, 120)}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.06] text-white tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] via-[#FF8C3A] to-[#FFAA5A]">{content("hero_title", "Logistics & Transportation Services Across India")}</span>
              </h1>
            </div>

            {/* Tagline */}
            <div style={anim(loaded, 220)}>
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-12 bg-gradient-to-r from-[#FF6B1A] to-[#FF8C3A] rounded-full" />
                <p className="text-base sm:text-lg font-semibold text-white/90 italic">
                  Moving Possibilities. Delivering Trust.
                </p>
              </div>
            </div>

            {/* Description */}
            <div style={anim(loaded, 300)}>
              <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-lg">
                Arrowline Logistics provides FTL transportation, container transportation, multimodal logistics, project cargo and customs clearance services from Mundra, Gujarat, serving businesses across India.
              </p>
            </div>

            {/* Rotating service ticker */}
            <div style={anim(loaded, 360)}>
              <div className="flex flex-wrap items-center gap-2 text-sm text-white/50">
                <span>We specialize in</span>
                <span
                  key={activeService}
                  className="inline-block px-3 py-1 bg-[#FF6B1A] text-white text-xs font-bold rounded-md"
                  style={{ animation: "fadeUp 0.35s ease forwards" }}
                >
                  {SERVICES[activeService]}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1" style={anim(loaded, 430)}>
              <button
                onClick={onOpenQuote}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6B1A] hover:bg-[#E55A0D] text-white font-bold text-sm rounded-xl shadow-[0_8px_30px_rgba(255,107,26,0.45)] hover:shadow-[0_12px_40px_rgba(255,107,26,0.65)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                {content("hero_cta", "Get a Free Quote")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setVideoModal(true)}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </span>
                Watch Our Operations
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ── Scroll down arrow ── */}
      <div className="relative z-10 flex justify-center pb-6" style={anim(loaded, 700)}>
        <button
          onClick={scrollDown}
          className="flex flex-col items-center gap-1.5 text-white/40 hover:text-[#FF6B1A] transition-colors group cursor-pointer"
          aria-label="Scroll to services"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">Explore</span>
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" style={{ animation: "bounceDown 1.8s ease-in-out infinite" }} />
        </button>
      </div>

      {/* ── Video modal ── */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setVideoModal(false)}
        >
          <div className="relative bg-[#062B3A] rounded-3xl overflow-hidden w-full max-w-3xl shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setVideoModal(false)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm flex items-center justify-center transition-colors cursor-pointer">✕</button>
            <div className="aspect-video flex items-center justify-center bg-[#03212D]">
              <div className="text-center text-white/40 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FF6B1A]/20 flex items-center justify-center mx-auto">
                  <Play className="w-7 h-7 text-[#FF6B1A] fill-[#FF6B1A] ml-1" />
                </div>
                <p className="text-sm">Operations video coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes floatParticle {
          from { transform: translateY(0) scale(1); opacity: 0.3; }
          to   { transform: translateY(-20px) scale(1.3); opacity: 0.7; }
        }
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