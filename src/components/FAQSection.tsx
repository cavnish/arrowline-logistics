import { useEffect, useState } from "react";
import axios from "axios";
import { FAQ_ITEMS } from "../data/logisticsData";
import type { FAQItem } from "../data/logisticsData";
import { ChevronDown, HelpCircle, Phone } from "lucide-react";
import { COMPANY_DETAILS } from "../data/logisticsData";
import { buildTel } from "../utils/contactLinks";
import Reveal from "./Reveal";

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQ_ITEMS);
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0]?.id || "");

  useEffect(() => {
    let mounted = true;
    const apiUrl = ((import.meta as any).env?.VITE_API_URL || "").trim().replace(/\/$/, "");
    axios
      .get(`${apiUrl}/api/faqs`)
      .then((response) => {
        const fetched: FAQItem[] = (response.data?.data || [])
          .filter((item: any) => item.question && item.answer)
          .map((item: any): FAQItem => ({
            id: String(item.id),
            question: item.question,
            answer: item.answer,
            category: item.category || "",
          }));
        if (!mounted || fetched.length === 0) return;
        setFaqs(fetched);
        setOpenFaqId((current) => (fetched.some((item) => item.id === current) ? current : fetched[0].id));
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? "" : id));
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F5F8FA] relative overflow-hidden">
      {/* Background Technical Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Column: Title & Contact Help (Matching Reference Image) */}
          <Reveal direction="left" className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#FF6B1A] tracking-widest uppercase shadow-sm">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight leading-tight">
                Do you have any question? <br />
                <span className="text-[#FF6B1A]">Find answer here</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Clear answers regarding our multimodal routes, Mundra Port clearance processes, freight billing, and pan-India transit tracking.
              </p>
            </div>

            {/* Assistance Card */}
            <div className="bg-[#062B3A] text-white p-6 rounded-3xl space-y-4 shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00] block">
                Direct Consultation
              </span>
              <h3 className="text-lg font-bold">
                Have a customized cargo inquiry not listed here?
              </h3>
              <p className="text-xs text-slate-300">
                Our logistics coordinators in Mundra are available 24/7 to structure custom tariff schedules.
              </p>
              <a
                href={buildTel(COMPANY_DETAILS.phone)}
                className="inline-flex items-center space-x-2 px-5 py-3 bg-[#FF6B1A] hover:bg-[#FF7A00] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Call {COMPANY_DETAILS.phone}</span>
              </a>
            </div>
          </Reveal>

          {/* Right Column: Accordion List (Matching Reference Image) */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((item, index) => {
              const isOpen = openFaqId === item.id;
              return (
                <Reveal key={item.id} delay={index * 50} duration={400}>
                <div
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${isOpen
                      ? "bg-white border-[#FF6B1A] shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-[#062B3A]">
                      {item.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isOpen ? "bg-[#FF6B1A] text-white rotate-180" : "bg-[#EAF3F6] text-[#062B3A]"
                        }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                      {item.answer}
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
