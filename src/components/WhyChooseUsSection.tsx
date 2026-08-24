import { CORE_VALUES } from "../data/logisticsData";
import { ShieldCheck, TrendingDown, Activity, Workflow, ArrowRight } from "lucide-react";

interface WhyChooseUsSectionProps {
  onOpenQuote: () => void;
}

export default function WhyChooseUsSection({ onOpenQuote }: WhyChooseUsSectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck": return <ShieldCheck className="w-5 h-5 text-[#FF6B1A]" />;
      case "TrendingDown": return <TrendingDown className="w-5 h-5 text-[#FF6B1A]" />;
      case "Activity": return <Activity className="w-5 h-5 text-[#FF6B1A]" />;
      case "Workflow": return <Workflow className="w-5 h-5 text-[#FF6B1A]" />;
      default: return <ShieldCheck className="w-5 h-5 text-[#FF6B1A]" />;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid: Left Arched Visual + Right Connected Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Semicircular / Arched Graphic Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Arched Background Shape */}
              <div className="relative rounded-t-[140px] sm:rounded-t-[200px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-[#062B3A] aspect-[4/4.5]">
                <img
                  src="/images/hero-trucks-city.jpg"
                  alt="Arrowline Logistics fleet and multimodal transport infrastructure"
                  className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-[#062B3A]/40 to-transparent" />

                {/* Overlay Text Inside Arch */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#FF7A00] block">
                    Multimodal Precision
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">
                    Synchronized Sea, Road & Rail Networks
                  </h3>
                  <p className="text-xs text-slate-300">
                    Eliminating bottlenecks across India's premier freight corridors.
                  </p>
                </div>
              </div>

              {/* Floating Pulse Node */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white rounded-full p-2.5 shadow-xl border border-slate-200 flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#FF6B1A] animate-ping" />
                <span className="text-xs font-bold text-[#062B3A] pr-2">Port to Inland Gate</span>
              </div>

            </div>
          </div>

          {/* Right Column: Heading & Connected Feature Nodes */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-[11px] font-extrabold text-[#062B3A] tracking-wider uppercase">
                <span>OUR CORE ADVANTAGES</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight leading-tight">
                Why Corporate India <br />
                <span className="text-[#FF6B1A]">Chooses Arrowline</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Logistics in India demands local port leverage, vetted highway capacity, and total operational transparency. We integrate these factors into high-efficiency supply chain loops.
              </p>
            </div>

            {/* Connected Route Nodes List */}
            <div className="space-y-4 pt-2 relative">
              {/* Vertical connecting line */}
              <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-slate-200 -translate-x-1/2 z-0 hidden sm:block" />

              {CORE_VALUES.map((item, idx) => (
                <div
                  key={idx}
                  className="relative z-10 bg-[#F5F8FA] border border-slate-200 hover:border-[#FF6B1A]/40 rounded-2xl p-4 sm:p-5 flex items-start space-x-4 transition-all duration-200 hover:shadow-md hover:bg-white group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-[#FF6B1A]/40 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Orange Callout Banner (Matching Reference Image) */}
        <div className="mt-14 lg:mt-16 bg-gradient-to-r from-[#FF6B1A] via-[#FF7A00] to-[#FF8C2A] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-black uppercase tracking-widest bg-black/15 px-3 py-1 rounded-full inline-block">
              Immediate Cargo Solution
            </span>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              Need reliable freight movement from Mundra Port?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              Talk directly with our transport dispatchers for dedicated trailers, rail rakes, and prompt customs brokerage.
            </p>
          </div>

          <button
            onClick={onOpenQuote}
            className="px-8 py-4 bg-[#03212D] hover:bg-[#062B3A] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xl hover:-translate-y-0.5 active:scale-98 transition-all flex items-center space-x-2 cursor-pointer flex-shrink-0"
          >
            <span>TALK TO OUR EXPERTS</span>
            <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
          </button>
        </div>

      </div>
    </section>
  );
}
