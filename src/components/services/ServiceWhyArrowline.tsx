import { AdvantageItem } from "../../data/servicesData";
import Reveal from "../Reveal";

interface ServiceWhyArrowlineProps {
  serviceName: string;
  items: AdvantageItem[];
}

export default function ServiceWhyArrowline({ serviceName, items }: ServiceWhyArrowlineProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#071C27] text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#FF6B1A]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#00C2CB]/10 blur-[120px]" />
      <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black tracking-widest text-[#FF9A5B] uppercase backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A]" />
              <span>THE ARROWLINE EDGE</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Why Choose Arrowline for <br className="hidden sm:inline" />
              <span className="text-[#FF6B1A]">{serviceName}?</span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Our operational infrastructure combines strategic port access, rigorous telemetry, and certified safety protocols to deliver unmatched reliability.
            </p>
          </Reveal>
        </div>

        {/* 5 Compact Advantage Cards */}
        <div className={`grid gap-6 ${items.length === 5 ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {items.map((item, index) => (
            <Reveal key={index} delay={index * 80}>
              <div className="group h-full p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FF6B1A]/60 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 backdrop-blur-xs">
                <div>
                  <div className="text-xs font-black text-[#FF6B1A] tracking-widest uppercase mb-3 flex items-center justify-between">
                    <span>{item.number}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A]/40 group-hover:bg-[#FF6B1A]" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 leading-snug group-hover:text-[#FF9A5B] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Verified Advantage
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
