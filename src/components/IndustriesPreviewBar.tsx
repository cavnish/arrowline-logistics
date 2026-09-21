import { INDUSTRIES_SERVED } from "../data/logisticsData";
import { Car, ShoppingBag, Cog, ShieldAlert, FlaskConical, HardHat, Sun, Layers, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

interface IndustriesPreviewBarProps {
  onNavigateToIndustries: () => void;
}

export default function IndustriesPreviewBar({ onNavigateToIndustries }: IndustriesPreviewBarProps) {
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
    <section className="py-14 lg:py-18 bg-white border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Strip */}
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#062B3A] tracking-tight">
              Tailored Transportation for <span className="text-[#FF6B1A]">India's Core Industries</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              From Just-In-Time automotive linehaul to high-velocity FMCG distribution and heavy solar cargo, explore dedicated logistics solutions designed for your sector.
            </p>
          </div>

          <a
            href="/industries"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToIndustries();
            }}
            className="px-6 py-3.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>VIEW ALL INDUSTRIES & SPECIFICATIONS</span>
            <ArrowRight className="w-4 h-4 text-[#FF6B1A]" />
          </a>
        </Reveal>

        {/* Quick Industry Grid (Preview) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {INDUSTRIES_SERVED.slice(0, 6).map((ind, index) => (
            <Reveal key={ind.id} delay={index * 60} duration={450}>
            <div
              key={ind.id}
              onClick={onNavigateToIndustries}
              className="bg-[#F5F8FA] border border-slate-200 hover:border-[#FF6B1A]/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:bg-white hover:shadow-md cursor-pointer group text-left"
            >
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-[#FF6B1A]/40 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  {getIcon(ind.icon)}
                </div>
                <h3 className="text-xs font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-snug line-clamp-1">
                  {ind.title.split(" &")[0]}
                </h3>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-[#FF6B1A]">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
