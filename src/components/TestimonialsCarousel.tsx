import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck, CheckCircle2, Truck } from "lucide-react";
import { cn } from "../utils/cn";

interface Testimonial {
  id: string;
  rating: number;
  text: string;
  name: string;
  role: string;
  company: string;
  companyColor?: string;
  timeAgo: string;
  verified: boolean;
  initial: string;
  initialBg: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    rating: 5,
    text: "Great service by the Arrowline dispatch team. Excellent communication and professional handling of our FTL cargo throughout the entire Mundra to Delhi corridor. Would strongly recommend.",
    name: "Rahul Sharma",
    role: "Operations Manager",
    company: "Adani Exports",
    companyColor: "text-[#FF7A00]",
    timeAgo: "4 months ago",
    verified: true,
    initial: "R",
    initialBg: "bg-amber-700",
  },
  {
    id: "t2",
    rating: 5,
    text: "Recovered my cargo delivery timeline after a shipping delay — good communication over the phone, arrived at the time that was advised. Highly recommend. The team was professional and...",
    name: "Priya Iyer",
    role: "Supply Chain Director",
    company: "Tata Chemicals",
    companyColor: "text-[#FF7A00]",
    timeAgo: "5 months ago",
    verified: true,
    initial: "P",
    initialBg: "bg-emerald-700",
  },
  {
    id: "t3",
    rating: 5,
    text: "Exceptional service and reliability. The team went above and beyond to ensure our shipment was delivered on time despite challenging circumstances during monsoon season.",
    name: "Vikram Mehta",
    role: "Logistics Coordinator",
    company: "JSW Steel",
    companyColor: "text-[#FF7A00]",
    timeAgo: "5 months ago",
    verified: true,
    initial: "V",
    initialBg: "bg-blue-700",
  },
  {
    id: "t4",
    rating: 5,
    text: "Arrowline handled our 85-ton ODC power transformer move from Mundra to Salem flawlessly. Full route survey, police escorts, and zero damage. Truly professional operators.",
    name: "Anil Krishnan",
    role: "Project Head",
    company: "BHEL India",
    companyColor: "text-[#FF7A00]",
    timeAgo: "6 months ago",
    verified: true,
    initial: "A",
    initialBg: "bg-purple-700",
  },
  {
    id: "t5",
    rating: 5,
    text: "Their coastal shipping solution saved us 35% on freight costs versus long-haul trucking. Weekly loops from Mundra to Chennai are now our backbone for South India distribution.",
    name: "Meera Nair",
    role: "Head of Supply Chain",
    company: "UltraTech Cement",
    companyColor: "text-[#FF7A00]",
    timeAgo: "7 months ago",
    verified: true,
    initial: "M",
    initialBg: "bg-rose-700",
  },
  {
    id: "t6",
    rating: 5,
    text: "The custom clearance team at Mundra is top-notch. Our import containers clear within 24-48 hours consistently. Saved us lakhs in demurrage charges over the year.",
    name: "Sanjay Patel",
    role: "Import Manager",
    company: "Reliance Industries",
    companyColor: "text-[#FF7A00]",
    timeAgo: "8 months ago",
    verified: true,
    initial: "S",
    initialBg: "bg-cyan-700",
  },
];

const PER_PAGE = 3;

export default function TestimonialsCarousel() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(TESTIMONIALS.length / PER_PAGE);

  const visibleTestimonials = TESTIMONIALS.slice(
    page * PER_PAGE,
    page * PER_PAGE + PER_PAGE
  );

  const goPrev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  const goNext = () => setPage((p) => (p === totalPages - 1 ? 0 : p + 1));

  return (
    <section className="relative py-8">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-slate-400" />
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A] leading-tight">
              What Our <span className="text-[#FF7A00]">Clients Say</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 5.0 rating badge */}
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl font-black text-[#1E3A8A]">5.0</span>
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-slate-500">Based on 6 reviews</span>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-[#FF7A00] hover:bg-[#FEF9F0] text-[#1E3A8A] flex items-center justify-center transition-all active:scale-95 shadow-sm"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:border-[#FF7A00] hover:bg-[#FEF9F0] text-[#1E3A8A] flex items-center justify-center transition-all active:scale-95 shadow-sm"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Testimonial cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleTestimonials.map((t) => (
          <div
            key={t.id}
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
          >
            {/* Corner quote badge */}
            <div className="absolute -top-3 right-6 w-10 h-10 bg-gradient-to-br from-[#FF7A00] to-[#E56D00] rounded-lg flex items-center justify-center shadow-md rotate-3 group-hover:rotate-0 transition-transform">
              <Quote className="w-5 h-5 text-white fill-white" />
            </div>

            {/* Top row: stars + verified */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF7A00] text-[#FF7A00]" />
                ))}
              </div>
              {t.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-emerald-200 bg-emerald-50 rounded-full text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            {/* Testimonial text */}
            <p className="text-[13px] text-slate-700 leading-relaxed mb-6 min-h-[100px]">
              "{t.text}"
            </p>

            {/* Divider */}
            <div className="h-px bg-slate-200 mb-4" />

            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
                  t.initialBg
                )}
              >
                {t.initial}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-[#1E3A8A] leading-tight">
                  {t.name}
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {t.role} · <span className={t.companyColor}>{t.company}</span>
                </p>
              </div>
            </div>

            {/* Time ago */}
            <p className="text-[10px] text-slate-400 mt-3">{t.timeAgo}</p>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              page === i
                ? "w-8 bg-[#FF7A00]"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            )}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom stats strip */}
      <div className="mt-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FEF9F0] flex items-center justify-center">
            <Star className="w-5 h-5 fill-[#FF7A00] text-[#FF7A00]" />
          </div>
          <div>
            <div className="text-lg font-black text-[#1E3A8A] leading-none">4.8/5</div>
            <div className="text-[10px] text-slate-500 font-semibold">Average Rating</div>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-lg font-black text-[#1E3A8A] leading-none">284+</div>
            <div className="text-[10px] text-slate-500 font-semibold">Verified Reviews</div>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-lg font-black text-[#1E3A8A] leading-none">99%</div>
            <div className="text-[10px] text-slate-500 font-semibold">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Excellent badge */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-5 py-2.5 shadow-sm">
          <span className="text-xs font-black text-[#1E3A8A] tracking-widest">EXCELLENT</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />
            ))}
          </div>
          <span className="text-[11px] text-slate-500">Based on 6 reviews</span>
        </div>
      </div>
    </section>
  );
}
