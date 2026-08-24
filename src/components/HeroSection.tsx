import { useState, useEffect, useRef } from "react";
import { ArrowRight, Phone, ChevronDown, Truck, Anchor, Globe, ShieldCheck, Play } from "lucide-react";

interface HeroSectionProps {
  onOpenQuote: () => void;
  onExploreServices: () => void;
}

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);
  return val;
}

const SERVICES = ["Road Transport", "Freight Forwarding", "Multimodal Logistics", "Container Cargo", "Project Cargo", "Custom Clearance"];

export default function HeroSection({ onOpenQuote, onExploreServices }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);
  const [counting, setCounting] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [videoModal, setVideoModal] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const cities = useCountUp(500, 2000, counting);
  const fleet = useCountUp(250, 1800, counting);
  const delivery = useCountUp(994, 2200, counting);

  /* Stagger-in on mount */
  useEffect(() => {
    const t = setTimeout(() => { setLoaded(true); setCounting(true); }, 120);
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
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── BG photo + overlays ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-logistics.jpg"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

          {/* ── LEFT: Text ── */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">

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
                <span className="block">Logistics &amp;</span>
                <span className="block">Transportation</span>
                <span className="block relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B1A] via-[#FF8C3A] to-[#FFAA5A]">
                    Services Across India
                  </span>
                </span>
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
                Arrowline provides reliable road transportation, freight, multimodal logistics and
                specialized cargo solutions for businesses across India — all anchored at Mundra Port, Gujarat.
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
                Get a Free Quote
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

            {/* Contact row */}
            <div style={anim(loaded, 510)} className="flex flex-col sm:flex-row gap-4 pt-1">
              <a
                href="tel:+919021179108"
                className="inline-flex items-center gap-2 text-white/60 hover:text-[#FF6B1A] text-sm transition-colors group"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">+91 90211 79108</span>
              </a>
              <span className="hidden sm:block text-white/20">|</span>
              <a
                href="mailto:mundra@arrowlinelogistics.in"
                className="text-white/60 hover:text-[#FF6B1A] text-sm transition-colors font-medium"
              >
                mundra@arrowlinelogistics.in
              </a>
            </div>
          </div>

          {/* ── RIGHT: Stats + Badge card ── */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4" style={anim(loaded, 200)}>

            {/* Top card — HQ Badge */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B1A]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <div className="relative flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6B1A] flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg shadow-[#FF6B1A]/40">
                  HQ
                </div>
                <div>
                  <p className="text-white font-black text-lg leading-tight">Mundra Port</p>
                  <p className="text-[#FF6B1A] text-xs font-semibold mt-0.5">Deendayal Port, Gujarat, India</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded-full flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Animated route line */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="relative w-3 h-3">
                    <span className="absolute inset-0 rounded-full bg-[#FF6B1A] animate-ping opacity-50" />
                    <span className="relative block w-3 h-3 rounded-full bg-[#FF6B1A]" />
                  </div>
                  <span className="text-[8px] text-white/60 font-bold mt-1">MUNDRA</span>
                </div>
                <div className="flex-1 h-0.5 bg-white/10 relative overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-[#FF6B1A] via-white to-[#FF6B1A] rounded-full"
                    style={{ animation: "routeSlide 2s linear infinite" }} />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-3 h-3 rounded-full bg-[#00C2CB]" />
                  <span className="text-[8px] text-white/60 font-bold mt-1">PAN-INDIA</span>
                </div>
                <div className="flex-1 h-0.5 bg-white/10 relative overflow-hidden rounded-full">
                  <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-[#00C2CB] via-white to-[#00C2CB] rounded-full"
                    style={{ animation: "routeSlide 2s linear infinite 1s" }} />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF6B1A]" />
                  <span className="text-[8px] text-white/60 font-bold mt-1">DEST.</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: cities, suffix: "+", label: "Cities" },
                  { value: fleet, suffix: "+", label: "Fleet" },
                  { value: delivery / 10, suffix: "%", label: "On-Time", fixed: 1 },
                ].map((s, i) => (
                  <div key={i} className="bg-white/8 border border-white/10 rounded-2xl p-3 text-center">
                    <span className="block text-2xl font-black text-white leading-none">
                      {s.fixed ? s.value.toFixed(1) : s.value}{s.suffix}
                    </span>
                    <span className="block text-[10px] text-white/50 mt-1">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom floating service icons */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, label: "Road Transport", sub: "FTL / PTL" },
                { icon: Anchor, label: "Port Logistics", sub: "Mundra Hub" },
                { icon: Globe, label: "Multimodal", sub: "All Modes" },
                { icon: ShieldCheck, label: "Safe Delivery", sub: "Insured Cargo" },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div
                  key={i}
                  className="group bg-white/8 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-[#FF6B1A]/40 rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FF6B1A]/20 group-hover:bg-[#FF6B1A]/30 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-[#FF6B1A]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white truncate">{label}</span>
                    <span className="block text-[10px] text-white/40 mt-0.5">{sub}</span>
                  </div>
                </div>
              ))}
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
        @keyframes routeSlide {
          from { transform: translateX(-200%); }
          to   { transform: translateX(400%); }
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
function anim(loaded: boolean, delay: number): React.CSSProperties {
  return {
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  };
}
