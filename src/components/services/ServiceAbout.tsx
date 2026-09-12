import { CheckCircle2, ArrowRight, Phone, ShieldCheck } from "lucide-react";
import Reveal from "../Reveal";
import { COMPANY_DETAILS } from "../../data/logisticsData";
import { buildTel } from "../../utils/contactLinks";

interface ServiceAboutProps {
  badge: string;
  heading: string;
  description: string;
  bulletPoints: string[];
  image: string;
  onOpenQuote: () => void;
}

export default function ServiceAbout({
  badge,
  heading,
  description,
  bulletPoints,
  image,
  onOpenQuote,
}: ServiceAboutProps) {
  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background Subtle Route Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Text & Bullets */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#EAF3F6] border border-[#062B3A]/20 rounded-full text-[11px] font-extrabold text-[#062B3A] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A]" />
                <span>{badge}</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight leading-[1.15]">
                {heading}
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {description}
              </p>
            </Reveal>

            {/* Checklist Bullets */}
            {bulletPoints && bulletPoints.length > 0 && (
              <Reveal delay={200}>
                <div className="space-y-3 pt-2">
                  {bulletPoints.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-[#FF6B1A]/15 flex items-center justify-center text-[#FF6B1A] flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-[#102A36] leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Action Row */}
            <Reveal delay={260}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="px-7 py-3.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>REQUEST TARIFF QUOTE</span>
                  <ArrowRight className="w-4 h-4 text-[#FF6B1A]" />
                </button>

                <div className="flex items-center space-x-3 p-2.5 bg-[#F5F8FA] border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#FF6B1A] flex items-center justify-center text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Operations Desk:
                    </span>
                    <a
                      href={buildTel(COMPANY_DETAILS.phone)}
                      className="block text-xs font-black text-[#062B3A] hover:text-[#FF6B1A] transition-colors"
                    >
                      {COMPANY_DETAILS.phone}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>

          {/* Right Column: Layered Image Composition */}
          <div className="lg:col-span-6 relative">
            <Reveal direction="right">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Primary Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={image || "/images/hero-logistics.jpg"}
                    alt={heading}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/50 via-transparent to-transparent" />
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute -bottom-6 -left-4 sm:left-6 bg-[#062B3A] border border-white/20 text-white p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-md max-w-[280px] sm:max-w-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FF6B1A]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9A5B]">
                      Verified Standards
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-snug font-medium">
                    Strict adherence to Indian maritime, customs, and national highway transit guidelines.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
