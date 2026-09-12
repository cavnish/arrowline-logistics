import { useState } from "react";
import { FAQItemData } from "../../data/servicesData";
import { ChevronDown, HelpCircle, Phone } from "lucide-react";
import { COMPANY_DETAILS } from "../../data/logisticsData";
import { buildTel } from "../../utils/contactLinks";
import Reveal from "../Reveal";

interface ServiceFAQProps {
  serviceName: string;
  faqs: FAQItemData[];
}

export default function ServiceFAQ({ serviceName, faqs }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden border-t border-slate-200">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Consultation Assistance Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <Reveal>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>FREQUENTLY ASKED QUESTIONS</span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight leading-tight">
                  Questions About <br />
                  <span className="text-[#FF6B1A]">{serviceName}?</span>
                </h2>
              </Reveal>

              <Reveal delay={140}>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Clear, authoritative answers regarding operational capabilities, route clearances, vehicle types, port coordination, and pan-India transit tracking.
                </p>
              </Reveal>
            </div>

            {/* Assistance Card */}
            <Reveal delay={200}>
              <div className="bg-[#062B3A] text-white p-6 rounded-3xl space-y-4 shadow-xl border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00] block">
                  Direct Operations Desk
                </span>
                <h3 className="text-lg font-bold">
                  Have a customized {serviceName.toLowerCase()} requirement?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our logistics coordinators stationed at Mundra Port are available 24/7 to structure custom tariff proposals.
                </p>
                <a
                  href={buildTel(COMPANY_DETAILS.phone)}
                  className="inline-flex items-center space-x-2 px-5 py-3 bg-[#FF6B1A] hover:bg-[#FF7A00] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {COMPANY_DETAILS.phone}</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <Reveal key={index} delay={index * 50}>
                  <div
                    className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "bg-white border-[#FF6B1A] shadow-md"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-bold text-[#062B3A]">
                        {item.q}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? "bg-[#FF6B1A] text-white rotate-180"
                            : "bg-[#EAF3F6] text-[#062B3A]"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                        {item.a}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
