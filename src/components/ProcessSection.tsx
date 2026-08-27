import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MessageSquare, ClipboardCheck, Package, Truck, Eye, CheckCircle2 } from "lucide-react";

const STEPS = [
  { n: "01", label: "Requirement", desc: "Share your weight, dimensions & timeline with our planning team", icon: MessageSquare },
  { n: "02", label: "Planning", desc: "We design custom routes and coordinate port/custom clearance", icon: ClipboardCheck },
  { n: "03", label: "Pickup", desc: "Laden or empty container stuffing and chassis allocation at port", icon: Package },
  { n: "04", label: "Transportation", desc: "Safe, trackable movement via our road, rail or coastal carriers", icon: Truck },
  { n: "05", label: "Tracking", desc: "Continuous GPS telemetry and automatic trip milestones", icon: Eye },
  { n: "06", label: "Delivery", desc: "On-time arrival at your factory gate with signed proof-of-delivery", icon: CheckCircle2 },
];

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [dotProgress, setDotProgress] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let raf: number;
    const start = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDotProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView]);

  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden" ref={containerRef}>
      {/* Background routing curves */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1400 600" preserveAspectRatio="none">
          <path d="M-100 100 Q 300 400 700 200 T 1500 500" fill="none" stroke="#FF6B1A" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF3F6] text-[#062B3A] text-[10px] font-bold tracking-widest uppercase rounded-full">
            WORKFLOW SYNERGY
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#062B3A] leading-tight">
            We Follow a <span className="text-[#FF6B1A]">Better Way</span> of Moving Cargo
          </h2>
          <p className="text-sm text-slate-600">
            A standardized six-stage process keeping your supply chain predictable, visible, and fully optimized.
          </p>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block relative pt-6 pb-2">
          {/* Main route line */}
          <div className="absolute left-[8%] right-[8%] top-[46px] h-[3px] bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] origin-left"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Traveling orange dot (Signature Animation) */}
          {isInView && (
            <div
              className="absolute top-[41px] w-3.5 h-3.5 rounded-full bg-[#FF6B1A] border-2 border-white shadow-[0_0_0_4px_rgba(255,107,26,0.25)] z-10"
              style={{
                left: `calc(8% + ${dotProgress * 84}%)`,
                transition: "none",
              }}
            />
          )}

          <div className="grid grid-cols-6 gap-4 relative">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-10 h-10 mx-auto bg-white border border-slate-200 group-hover:border-[#FF6B1A]/40 rounded-full flex items-center justify-center mb-3 relative z-10 shadow-sm transition-colors duration-300">
                    <Icon className="w-4.5 h-4.5 text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors" strokeWidth={2.2} />
                  </div>
                  <div className="text-[9px] font-black text-[#FF6B1A] tracking-widest uppercase mb-1">
                    0{i + 1}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#062B3A] mb-1 leading-snug">{s.label}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug max-w-[150px] mx-auto">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet vertical timeline */}
        <div className="lg:hidden relative pl-8">
          {/* vertical line */}
          <div className="absolute left-3.5 top-2 bottom-2 w-[3px] bg-slate-200 overflow-hidden rounded-full">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-[#FF6B1A] to-[#FF8C2A] origin-top"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* traveling dot */}
          {isInView && (
            <div
              className="absolute left-[11px] w-3 h-3 rounded-full bg-[#FF6B1A] border-2 border-white shadow-[0_0_0_3px_rgba(255,107,26,0.25)] z-10"
              style={{ top: `calc(${dotProgress * 100}% - 6px)` }}
            />
          )}

          <div className="space-y-6 sm:space-y-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative flex gap-4 items-start"
                >
                  <div className="absolute -left-[27px] top-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center z-10 shadow-sm">
                    <Icon className="w-3.5 h-3.5 text-[#062B3A]" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-black text-[#FF6B1A] tracking-widest uppercase mb-0.5">
                      STAGE {s.n}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#062B3A] mb-1">{s.label}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
