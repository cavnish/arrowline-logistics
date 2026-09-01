import { CheckCircle2, ArrowRight, Phone, Award } from "lucide-react";
import { COMPANY_DETAILS } from "../data/logisticsData";
import { buildTel } from "../utils/contactLinks";
import { useSiteContent } from "../hooks/useSiteContent";

interface AboutSectionProps {
  onNavigateToAbout: () => void;
}

export default function AboutSection({ onNavigateToAbout }: AboutSectionProps) {
  const content = useSiteContent();
  const benefits = [
    "Multimodal Connectivity (Sea, Road, Rail & Air)",
    "Pan-India Reach across 500+ Cities & Industrial Zones",
    "Real-Time Cargo Visibility & Live GPS Tracking",
    "Customized Transportation for FTL & Bulk Freight",
    "Seamless Operational Coordination & Port Clearance"
  ];

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background Subtle Route Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Text & Benefits */}
          <div className="lg:col-span-6 space-y-6">

            {/* Small Orange Eyebrow Label */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#EAF3F6] border border-[#062B3A]/20 rounded-full text-[11px] font-extrabold text-[#062B3A] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A]" />
              <span>ABOUT ARROWLINE</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight leading-[1.15]">
              Connecting Ports, Roads, <br />
              <span className="text-[#FF6B1A]">Rail & Businesses.</span>
            </h2>

            {/* Core Paragraph */}
            <p className="text-base text-slate-600 leading-relaxed">
              Arrowline Logistics provides integrated logistics and transportation solutions designed to move cargo efficiently from origin to destination. Strategically centered at <strong className="text-[#062B3A]">Mundra Port, Gujarat</strong>, we coordinate multi-modal networks to bypass bottleneck constraints and optimize freight timelines across India.
            </p>

            {/* 5 Benefits Checklist */}
            <div className="space-y-3 pt-2">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#FF6B1A]/15 flex items-center justify-center text-[#FF6B1A] flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-[#102A36]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Row & Contact Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
              <button
                onClick={onNavigateToAbout}
                className="px-7 py-3.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>ABOUT ARROWLINE</span>
                <ArrowRight className="w-4 h-4 text-[#FF6B1A]" />
              </button>

              <div className="flex items-center space-x-3 p-2.5 bg-[#F5F8FA] border border-slate-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B1A] flex items-center justify-center text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Direct Operations Desk:</span>
                  <a
                    href={buildTel(COMPANY_DETAILS.phone)}
                    className="block text-xs font-black text-[#062B3A] hover:text-[#FF6B1A] transition-colors"
                  >
                    {COMPANY_DETAILS.phone}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Layered Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">

              {/* Primary Large Image (Port & Container Crane) */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={content("about_image", "/images/hero-logistics.jpg")}
                  alt="Mundra port container logistics crane and ship operations"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A]/80 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7A00] block">Mundra Maritime Hub</span>
                  <span className="text-sm font-bold block">Gateway for Northern & Western India Dispatches</span>
                </div>
              </div>

              {/* Overlapping Secondary Image (Fleet in Yard) */}
              <div className="absolute -bottom-8 -left-6 sm:-left-8 w-1/2 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden sm:block aspect-[4/3]">
                <img
                  src="/images/truck-fleet-yard.jpg"
                  alt="Arrowline logistics fleet in transport yard"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Orange Experience Badge */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-gradient-to-br from-[#FF6B1A] to-[#FF8C2A] text-white p-5 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[200px] border-2 border-white">
                <Award className="w-8 h-8 flex-shrink-0" />
                <div>
                  <span className="block text-2xl font-black leading-none">20+</span>
                  <span className="block text-[11px] font-bold mt-1 leading-tight">Years Combined Logistics Mastery</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
