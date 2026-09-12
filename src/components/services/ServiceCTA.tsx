import { Sparkles, ArrowRight, Phone } from "lucide-react";
import Reveal from "../Reveal";
import { COMPANY_DETAILS } from "../../data/logisticsData";
import { buildTel } from "../../utils/contactLinks";

interface ServiceCTAProps {
  headline?: string;
  onOpenQuote: () => void;
  onNavigateToContact?: () => void;
}

export default function ServiceCTA({
  headline = "Move Your Cargo With Confidence",
  onOpenQuote,
  onNavigateToContact,
}: ServiceCTAProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#03212D] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-gradient-to-r from-[#062B3A] via-[#0C4A60] to-[#062B3A] rounded-3xl overflow-hidden shadow-2xl p-7 sm:p-10 lg:p-14 border border-white/15">
          
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,26,0.3),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Content */}
            <div className="lg:col-span-8 space-y-4">
              <Reveal>
                <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black text-[#FF7A00] tracking-widest uppercase backdrop-blur">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>READY TO MOVE YOUR FREIGHT?</span>
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {headline}
                </h2>
              </Reveal>

              <Reveal delay={140}>
                <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
                  Get customized tariffs from Mundra Port to any destination across India. Our logistics coordinators respond within 2 hours.
                </p>
              </Reveal>

              {/* Action Buttons */}
              <Reveal delay={200}>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="px-7 py-3.5 bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] hover:from-[#E55A0D] hover:to-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>GET A FREE QUOTE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={buildTel(COMPANY_DETAILS.phone)}
                    className="px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Contact Our Logistics Team</span>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Side Stat Badge */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Reveal direction="right">
                <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md max-w-sm space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9A5B] block">
                    Pan-India Operations Desk
                  </span>
                  <p className="text-sm font-bold text-white">
                    Mundra Port Clearance & Dispatch
                  </p>
                  <p className="text-xs text-slate-300">
                    Direct communication with on-ground port coordinators and trip managers.
                  </p>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
