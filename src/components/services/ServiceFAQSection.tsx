import { useState } from "react";
import { ChevronDown, HelpCircle, Phone } from "lucide-react";
import { FAQItemData } from "../../data/servicesData";
import { COMPANY_DETAILS } from "../../data/logisticsData";
import { buildTel } from "../../utils/contactLinks";
import Reveal from "../Reveal";

interface ServiceFAQSectionProps {
  serviceTitle: string;
  faqs: FAQItemData[];
}

export default function ServiceFAQSection({
  serviceTitle,
  faqs,
}: ServiceFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Heading & Contact Card */}
          <Reveal direction="left" className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight leading-tight">
                {serviceTitle} <br />
                <span className="text-[#FF6B1A]">Questions Answered</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Clear answers regarding our Mundra Port operations, route coverage, cargo specifications, customs clearance coordination, and nationwide transit schedules.
              </p>
            </div>

            {/* Assistance Card */}
            <div className="bg-[#062B3A] text-white p-6 rounded-3xl space-y-4 shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00] block">
                Mundra Operations Desk
              </span>
              <h3 className="text-lg font-bold">
                Need customized tariffs or urgent route placement?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our logistics coordinators at Mundra Port are available 24/7 to structure competitive container, FTL, or heavy haulage schedules for your cargo.
              </p>
              <a
                href={buildTel(COMPANY_DETAILS.phone)}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-[#FF6B1A] hover:bg-[#FF7A00] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {COMPANY_DETAILS.phone}</span>
              </a>
            </div>
          </Reveal>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <Reveal key={idx} delay={idx * 40} duration={350}>
                  <div
                    className={`border rounded-2xl transition-all duration-200 overflow-hidden bg-white/90 backdrop-blur-md ${
                      isOpen
                        ? "border-[#FF6B1A] shadow-md"
                        : "border-slate-200 shadow-sm hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-bold text-[#062B3A]">
                        {faq.q}
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

                    <div
                      className={`grid transition-all duration-200 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-80"
                      }`}
                    >
                      <div className="overflow-hidden min-h-0">
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      </div>
                    </div>
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
