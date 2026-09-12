import { ShieldCheck, Truck, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "../Reveal";

interface ServiceHighlightsProps {
  highlights: string[];
}

export default function ServiceHighlights({ highlights }: ServiceHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  // Icon mapping helpers for visual aesthetics
  const icons = [Truck, ShieldCheck, MapPin, CheckCircle2];

  return (
    <section className="bg-white border-b border-slate-200 py-6 sm:py-8 relative z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {highlights.slice(0, 4).map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Reveal key={index} delay={index * 60}>
                <div className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#F5F8FA] border border-slate-200/90 hover:border-[#FF6B1A]/50 hover:bg-white hover:shadow-md transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:bg-[#FF6B1A] group-hover:text-white group-hover:border-[#FF6B1A] text-[#062B3A] flex items-center justify-center flex-shrink-0 transition-colors shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#FF6B1A]">
                      0{index + 1} • CORE FEATURE
                    </span>
                    <strong className="block text-xs sm:text-sm font-black text-[#062B3A] tracking-tight uppercase truncate">
                      {item}
                    </strong>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
