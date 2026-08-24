import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  BadgeCheck,
  Truck,
  ShieldCheck,
} from "lucide-react";

const testimonials = [
  {
    quote:
      "Great service by the Arrowline dispatch team. Excellent communication and professional handling of our FTL cargo throughout the entire Mundra to Delhi corridor. Would strongly recommend.",
    name: "Rahul Sharma",
    role: "Operations Manager",
    company: "Adani Exports",
    time: "4 months ago",
    initial: "R",
  },
  {
    quote:
      "Recovered my cargo delivery timeline after a shipping delay — good communication over the phone, arrived at the time that was advised. Highly recommend. The team was professional and reliable.",
    name: "Priya Iyer",
    role: "Supply Chain Director",
    company: "Tata Chemicals",
    time: "5 months ago",
    initial: "P",
  },
  {
    quote:
      "Exceptional service and reliability. The team went above and beyond to ensure our shipment was delivered on time despite challenging circumstances during monsoon season.",
    name: "Vikram Mehta",
    role: "Logistics Coordinator",
    company: "JSW Steel",
    time: "5 months ago",
    initial: "V",
  },
  {
    quote:
      "Professional coordination from pickup to final delivery. Arrowline kept our team informed throughout the movement and handled the shipment smoothly.",
    name: "Amit Verma",
    role: "Procurement Manager",
    company: "Larsen & Toubro",
    time: "6 months ago",
    initial: "A",
  },
  {
    quote:
      "The transportation team was responsive, punctual and very professional. We received regular updates and the cargo reached safely as planned.",
    name: "Neha Kapoor",
    role: "Logistics Manager",
    company: "Reliance Industries",
    time: "7 months ago",
    initial: "N",
  },
  {
    quote:
      "Excellent support for our heavy cargo movement. Route planning and execution were handled efficiently by the Arrowline team.",
    name: "Sanjay Patel",
    role: "Plant Operations Head",
    company: "Tata Power",
    time: "8 months ago",
    initial: "S",
  },
];

export default function QuoteCalculatorSection() {
  const [startIndex, setStartIndex] = useState(0);

  /*
   * Desktop:
   * 3 cards visible
   *
   * Mobile:
   * 1 card visible
   *
   * The carousel itself remains horizontal and moves
   * from left to right / right to left.
   */

  const maxIndex = testimonials.length - 3;

  const next = () => {
    setStartIndex((current) =>
      current >= maxIndex ? 0 : current + 1
    );
  };

  const previous = () => {
    setStartIndex((current) =>
      current <= 0 ? maxIndex : current - 1
    );
  };

  return (
    <section className="w-full overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">

          {/* Title */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Truck className="h-5 w-5 text-slate-400 sm:h-6 sm:w-6" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Client Experience
              </span>
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight text-[#24438F] sm:text-4xl lg:text-[46px]">
              What Our{" "}
              <span className="text-[#FF6B1A]">
                Clients Say
              </span>
            </h2>
          </div>

          {/* =================================================
              SMALL GOOGLE RATING
          ================================================== */}
          <div className="flex items-center justify-between gap-4 sm:justify-end">

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">

              {/* Google G */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-lg font-black">
                <span className="text-[#4285F4]">G</span>
              </div>

              <div className="leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-[#24438F]">
                    4.8
                  </span>

                  <div className="flex gap-[1px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]"
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-1 text-[10px] font-medium text-slate-500">
                  Google Reviews
                </p>
              </div>
            </div>

            {/* Desktop arrows */}
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#24438F] shadow-sm transition-all hover:border-[#FF6B1A] hover:text-[#FF6B1A] active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#24438F] shadow-sm transition-all hover:border-[#FF6B1A] hover:text-[#FF6B1A] active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            TESTIMONIAL CAROUSEL
        ====================================================== */}

        <div className="relative">

          {/* Desktop / Tablet carousel */}
          <div className="hidden overflow-hidden md:block">

            <div
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${startIndex} * (33.333333% + 6.67px)))`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <article
                  key={index}
                  className="group relative min-w-[calc(33.333333%-13.333px)] flex-[0_0_calc(33.333333%-13.333px)] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:p-7"
                >

                  {/* Quote icon */}
                  <div className="absolute right-5 top-[-15px] flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B1A] text-white shadow-lg">
                    <span className="text-3xl font-black leading-none">
                      "
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mb-7 flex items-center justify-between pr-8">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-[#FF6B1A] text-[#FF6B1A]"
                        />
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="min-h-[145px] text-sm leading-7 text-slate-600 lg:text-[15px]">
                    "{testimonial.quote}"
                  </p>

                  {/* Divider */}
                  <div className="my-6 h-px bg-slate-200" />

                  {/* Customer */}
                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#24438F] text-base font-black text-white">
                      {testimonial.initial}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black text-[#24438F]">
                        {testimonial.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {testimonial.role}
                        <span className="mx-1 text-slate-300">
                          •
                        </span>
                        <span className="font-semibold text-[#FF6B1A]">
                          {testimonial.company}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-[11px] font-medium text-slate-400">
                    {testimonial.time}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* =================================================
              MOBILE CAROUSEL
          ================================================== */}

          <div className="overflow-hidden md:hidden">

            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${startIndex * 100}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <article
                  key={index}
                  className="relative min-w-full flex-[0_0_100%] px-1"
                >
                  <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    {/* Quote */}
                    <div className="absolute right-5 top-[-12px] flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B1A] text-white shadow-md">
                      <span className="text-2xl font-black">
                        "
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="mb-6 flex items-center justify-between pr-7">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-[#FF6B1A] text-[#FF6B1A]"
                          />
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                        <BadgeCheck className="h-3 w-3" />
                        Verified
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="min-h-[190px] text-sm leading-7 text-slate-600">
                      "{testimonial.quote}"
                    </p>

                    <div className="my-6 h-px bg-slate-200" />

                    {/* Customer */}
                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#24438F] text-sm font-black text-white">
                        {testimonial.initial}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-[#24438F]">
                          {testimonial.name}
                        </h3>

                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                          {testimonial.role}
                          <span className="mx-1 text-slate-300">
                            •
                          </span>
                          <span className="font-semibold text-[#FF6B1A]">
                            {testimonial.company}
                          </span>
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-[10px] text-slate-400">
                      {testimonial.time}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        <div className="mt-6 flex items-center justify-center gap-4 md:hidden">

          <button
            type="button"
            onClick={previous}
            aria-label="Previous review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#24438F] shadow-sm active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setStartIndex(index)}
                aria-label={`Show review ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  startIndex === index
                    ? "w-7 bg-[#FF6B1A]"
                    : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next review"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#24438F] shadow-sm active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* =====================================================
            BOTTOM TRUST STATS
        ====================================================== */}

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-6 border-t border-slate-100 pt-8 sm:gap-10">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
              <Star className="h-5 w-5 fill-[#FF6B1A] text-[#FF6B1A]" />
            </div>

            <div>
              <p className="text-lg font-black leading-none text-[#24438F]">
                4.8/5
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-500">
                Average Rating
              </p>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <BadgeCheck className="h-5 w-5 text-emerald-500" />
            </div>

            <div>
              <p className="text-lg font-black leading-none text-[#24438F]">
                284+
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-500">
                Verified Reviews
              </p>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
            </div>

            <div>
              <p className="text-lg font-black leading-none text-[#24438F]">
                99%
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-500">
                Client Satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            SMALL GOOGLE REVIEW BADGE
        ====================================================== */}

        <div className="mt-7 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">

            <span className="text-[10px] font-black uppercase tracking-wider text-[#24438F]">
              Excellent
            </span>

            <div className="flex gap-[1px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-[#FF8A00] text-[#FF8A00]"
                />
              ))}
            </div>

            <span className="text-[10px] text-slate-500">
              Google Reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}