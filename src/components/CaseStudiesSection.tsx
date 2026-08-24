import { useState } from "react";
import { CASE_STUDIES, CaseStudy } from "../data/logisticsData";
import { ArrowRight, MapPin, CheckCircle2, ChevronRight, X } from "lucide-react";

interface CaseStudiesSectionProps {
  onOpenQuote: () => void;
}

export default function CaseStudiesSection({ onOpenQuote }: CaseStudiesSectionProps) {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-xs font-bold text-[#062B3A] tracking-widest uppercase">
              <span>PROVEN TRACK RECORD</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#062B3A] tracking-tight">
              Best Case Studies by <span className="text-[#FF6B1A]">Arrowline</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600">
              Examining how our multimodal logistics infrastructure solves complex transportation, compliance, and cost challenges for Indian enterprises.
            </p>
          </div>

          <button
            onClick={onOpenQuote}
            className="px-6 py-3.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto"
          >
            <span>DISCUSS YOUR PROJECT</span>
            <ArrowRight className="w-4 h-4 text-[#FF6B1A]" />
          </button>
        </div>

        {/* 4 Case Studies Cards Grid (Matching Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              onClick={() => setSelectedCase(study)}
              className="bg-[#F5F8FA] border border-slate-200 hover:border-[#FF6B1A]/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1.5"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={study.image}
                  alt={study.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                <span className="absolute top-3 left-3 bg-[#062B3A]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                  {study.badge}
                </span>

                <div className="absolute inset-0 bg-[#062B3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3.5 py-1.5 bg-[#FF6B1A] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg">
                    View Case Analysis
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6B1A] block">
                    {study.service}
                  </span>

                  <h3 className="text-sm sm:text-base font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors leading-snug line-clamp-2">
                    {study.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-normal">
                    {study.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold truncate max-w-[65%]">
                    {study.clientSector}
                  </span>
                  <span className="text-[#FF6B1A] font-bold flex items-center">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Case Study Detail Modal / Lightbox */}
      {selectedCase && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition-all z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/9] w-full relative bg-slate-900">
              <img
                src={selectedCase.image}
                alt={selectedCase.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-[#062B3A]/40 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-black uppercase text-[#FF7A00] tracking-widest bg-black/40 px-2.5 py-1 rounded-full">
                  {selectedCase.service}
                </span>
                <h3 className="text-lg sm:text-xl font-bold">{selectedCase.title}</h3>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>{selectedCase.location}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5 max-h-[50vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#062B3A] mb-1">The Challenge:</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{selectedCase.challenge}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B1A] mb-1">Arrowline Solution:</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{selectedCase.solution}</p>
              </div>

              <div className="p-4 bg-[#EAF3F6] rounded-2xl border border-[#062B3A]/10 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#062B3A] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>The Result & Value Delivered:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{selectedCase.result}</p>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCase(null);
                    onOpenQuote();
                  }}
                  className="px-6 py-3 bg-[#FF6B1A] hover:bg-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Request Similar Project Estimate →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
