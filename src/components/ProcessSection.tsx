import { PROCESS_STEPS } from "../data/logisticsData";
import { FileSearch, Route, PackageCheck, Truck, Activity, CheckCircle } from "lucide-react";

export default function ProcessSection() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileSearch": return <FileSearch className="w-5 h-5 text-[#FF6B1A]" />;
      case "Route": return <Route className="w-5 h-5 text-[#FF6B1A]" />;
      case "PackageCheck": return <PackageCheck className="w-5 h-5 text-[#FF6B1A]" />;
      case "Truck": return <Truck className="w-5 h-5 text-[#FF6B1A]" />;
      case "Activity": return <Activity className="w-5 h-5 text-[#FF6B1A]" />;
      case "CheckCircle": return <CheckCircle className="w-5 h-5 text-[#FF6B1A]" />;
      default: return <Truck className="w-5 h-5 text-[#FF6B1A]" />;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
            <span>WORK PROCESS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
            We Follow the Highest <span className="text-[#FF6B1A]">Standard of Logistics</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Our disciplined 6-stage execution framework guarantees absolute freight safety, strict compliance, and predictable delivery milestones from origin to destination.
          </p>
        </div>

        {/* 6-Step Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROCESS_STEPS.map((stepItem, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 hover:border-[#FF6B1A]/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Top Photo & Step Badge */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={stepItem.image}
                  alt={stepItem.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Step Number Tag */}
                <div className="absolute top-3.5 left-3.5 w-11 h-11 rounded-2xl bg-[#062B3A] text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-lg">
                  {stepItem.step}
                </div>

                <div className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md">
                  {getIcon(stepItem.icon)}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#FF6B1A] block">
                    {stepItem.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors mt-1">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {stepItem.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Stage {stepItem.step} of 06</span>
                  <span className="text-[#FF6B1A]">Arrowline SLA</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
