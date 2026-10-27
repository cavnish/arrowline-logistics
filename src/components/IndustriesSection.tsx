import { INDUSTRIES_SERVED } from "../data/logisticsData";
import { Car, ShoppingBag, Cog, ShieldAlert, FlaskConical, HardHat, Sun, Layers, ArrowRight } from "lucide-react";

interface IndustriesSectionProps {
  onOpenQuote: () => void;
}

export default function IndustriesSection({ onOpenQuote }: IndustriesSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Car": return <Car className="w-5 h-5 text-[#FF6B1A]" />;
      case "ShoppingBag": return <ShoppingBag className="w-5 h-5 text-[#FF6B1A]" />;
      case "Cog": return <Cog className="w-5 h-5 text-[#FF6B1A]" />;
      case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-[#FF6B1A]" />;
      case "FlaskConical": return <FlaskConical className="w-5 h-5 text-[#FF6B1A]" />;
      case "HardHat": return <HardHat className="w-5 h-5 text-[#FF6B1A]" />;
      case "Sun": return <Sun className="w-5 h-5 text-[#FF6B1A]" />;
      case "Layers": return <Layers className="w-5 h-5 text-[#FF6B1A]" />;
      default: return <Cog className="w-5 h-5 text-[#FF6B1A]" />;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16 border-b border-slate-200 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#062B3A] tracking-widest uppercase">
              <span>SPECIALIZED SECTORS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              Industries <span className="text-[#FF6B1A]">We Serve</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Tailored freight solutions engineered for the specific handling, timing, and regulatory demands of India's key industrial segments.
            </p>
          </div>

          <button
            onClick={onOpenQuote}
            className="px-6 py-3.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto"
          >
            <span>CUSTOM INDUSTRY QUOTE</span>
            <ArrowRight className="w-4 h-4 text-[#FF6B1A]" />
          </button>
        </div>

        {/* 4-Column Grid for Industries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES_SERVED.map((ind) => (
            <div
              key={ind.id}
              className="bg-[#F5F8FA] border border-slate-200 hover:border-[#FF6B1A]/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:bg-white hover:shadow-xl group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-[#FF6B1A]/40 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {getIcon(ind.icon)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-snug">
                    {ind.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Typical Cargo:</span>
                <div className="flex flex-wrap gap-1">
                  {ind.cargoTypes.map((cargo, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 text-[#062B3A] px-2 py-0.5 rounded font-medium">
                      {cargo}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
