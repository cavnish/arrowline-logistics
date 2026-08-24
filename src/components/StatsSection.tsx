import { LOGISTICS_STATS } from "../data/logisticsData";
import CountUp from "./CountUp";
import { MapPin, Truck, Clock, ShieldCheck } from "lucide-react";

export default function StatsSection() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "MapPin": return <MapPin className="w-6 h-6 text-[#FF6B1A]" />;
      case "Truck": return <Truck className="w-6 h-6 text-[#062B3A]" />;
      case "Clock": return <Clock className="w-6 h-6 text-[#FF6B1A]" />;
      case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-[#062B3A]" />;
      default: return <Truck className="w-6 h-6 text-[#FF6B1A]" />;
    }
  };

  return (
    <section className="bg-white py-14 lg:py-18 text-[#062B3A] border-y border-slate-200/90 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {LOGISTICS_STATS.map((stat, i) => {
            const isFloat = stat.number.includes(".");
            const numPart = parseFloat(stat.number.replace(/[^0-9.]/g, ""));
            const suffix = stat.number.includes("+") ? "+" : stat.number.includes("%") ? "%" : "";

            return (
              <div
                key={i}
                className="bg-[#F5F8FA] border border-slate-200/80 hover:border-[#FF6B1A]/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:bg-white hover:shadow-xl group hover:-translate-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-[#FF6B1A]/40 flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
                    {getIcon(stat.iconName)}
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B1A]/30 group-hover:bg-[#FF6B1A] transition-colors" />
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-tight">
                  {stat.number === "24/7" ? (
                    <span>24/7</span>
                  ) : isFloat ? (
                    <span>{stat.number}</span>
                  ) : (
                    <CountUp end={numPart} suffix={suffix} />
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#062B3A] mt-2 leading-snug">
                  {stat.label}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {stat.sublabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
