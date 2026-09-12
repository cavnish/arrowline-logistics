import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardCheck, Package, Truck, Eye, CheckCircle2, MessageSquare } from "lucide-react";
import { ProcessStepItem } from "../../data/servicesData";
import Reveal from "../Reveal";

interface ServiceProcessProps {
  serviceName: string;
  steps: ProcessStepItem[];
}

export default function ServiceProcess({ serviceName, steps }: ServiceProcessProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [dotProgress, setDotProgress] = useState(0);

  const defaultIcons = [MessageSquare, ClipboardCheck, Package, Truck, Eye, CheckCircle2];

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

  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden border-t border-slate-200" ref={containerRef}>
      {/* Background routing curves */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1400 600" preserveAspectRatio="none">
          <path d="M-100 100 Q 300 400 700 200 T 1500 500" fill="none" stroke="#FF6B1A" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
              <span>WORKFLOW SYNERGY</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#062B3A] leading-tight">
              How Our <span className="text-[#FF6B1A]">{serviceName}</span> Works
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              A standardized six-stage process keeping your supply chain predictable, visible, and fully optimized.
            </p>
          </Reveal>
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
            {steps.map((s, i) => {
              const Icon = defaultIcons[i % defaultIcons.length];
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
                    {s.step || `0${i + 1}`}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#062B3A] mb-1 leading-snug">{s.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug max-w-[150px] mx-auto">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet vertical grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:hidden">
          {steps.map((s, i) => {
            const Icon = defaultIcons[i % defaultIcons.length];
            return (
              <div key={i} className="flex gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#FF6B1A] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#FF6B1A] uppercase tracking-wider block">
                    {s.step || `0${i + 1}`}
                  </span>
                  <h3 className="text-sm font-bold text-[#062B3A]">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
