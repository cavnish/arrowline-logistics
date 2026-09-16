import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Star,
  Truck,
  Quote,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getOptimizedImageUrl } from "../utils/imageUrl";
import Reveal from "./Reveal";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  time: string;
  initial: string;
  avatarColor: string;
  photo?: string;
  rating: number;
  isVerified: boolean;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    name: "Rahul Sharma",
    role: "Operations Manager",
    company: "Adani Exports",
    message:
      "Great service by the Arrowline dispatch team. Excellent communication and professional handling of our FTL cargo throughout the entire Mundra to Delhi corridor. Would strongly recommend.",
    time: "4 months ago",
    initial: "R",
    avatarColor: "bg-orange-600",
    rating: 5,
    isVerified: true,
  },
  {
    id: "fallback-2",
    name: "Priya Iyer",
    role: "Supply Chain Director",
    company: "Tata Chemicals",
    message:
      "Recovered my cargo delivery timeline after a shipping delay — good communication over the phone, arrived at the time that was agreed. Highly recommend. The team was professional and responsive.",
    time: "5 months ago",
    initial: "P",
    avatarColor: "bg-emerald-600",
    rating: 5,
    isVerified: true,
  },
  {
    id: "fallback-3",
    name: "Vikram Mehta",
    role: "Logistics Coordinator",
    company: "JSW Steel",
    message:
      "Exceptional service and reliability. The team went above and beyond to ensure our shipment was delivered on time despite challenging circumstances during monsoon season.",
    time: "5 months ago",
    initial: "V",
    avatarColor: "bg-blue-600",
    rating: 5,
    isVerified: true,
  },
  {
    id: "fallback-4",
    name: "Neha Patel",
    role: "Procurement Manager",
    company: "Renewable Energy Solutions",
    message:
      "Arrowline handled our transportation requirements professionally. Communication was clear and the delivery process was smooth from pickup to final destination.",
    time: "6 months ago",
    initial: "N",
    avatarColor: "bg-purple-600",
    rating: 5,
    isVerified: true,
  },
  {
    id: "fallback-5",
    name: "Amit Verma",
    role: "Plant Operations Head",
    company: "Industrial Manufacturing Co.",
    message:
      "Reliable logistics partner with excellent coordination. Their team understood our requirements quickly and executed the shipment exactly as planned.",
    time: "6 months ago",
    initial: "A",
    avatarColor: "bg-slate-700",
    rating: 5,
    isVerified: true,
  },
];

const AVATAR_COLORS = [
  "bg-orange-600",
  "bg-emerald-600",
  "bg-blue-600",
  "bg-purple-600",
  "bg-slate-700",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-amber-600",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  const str = String(name || "");
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatRelativeTime(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

interface ApiRecord {
  id: string;
  customer_name?: string;
  company?: string;
  position?: string;
  testimonial?: string;
  photo?: string | null;
  rating?: number | null;
  is_verified?: boolean;
  created_at?: string;
}

function mapRecord(record: ApiRecord): Testimonial {
  const name = record.customer_name || "Customer";
  return {
    id: String(record.id),
    name,
    role: record.position || "",
    company: record.company || "",
    message: record.testimonial || "",
    time: formatRelativeTime(record.created_at) || "Verified review",
    initial: getInitials(name),
    avatarColor: getAvatarColor(name),
    photo: record.photo || undefined,
    rating: Math.max(1, Math.min(5, Number(record.rating) || 5)),
    isVerified: record.is_verified !== false,
  };
}

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [visibleCards, setVisibleCards] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  /*
   * FETCH CMS TESTIMONIALS
   *
   * API data wins. The hardcoded list above is only used when the
   * backend is unreachable.
   */
  useEffect(() => {
    let mounted = true;
    const apiUrl = String((import.meta as any).env?.VITE_API_URL || "").trim().replace(/\/$/, "");
    const load = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/testimonials`);
        if (!mounted) return;
        if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setTestimonials(response.data.data.map(mapRecord));
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  /*
   * RESPONSIVE CARD COUNT
   *
   * Desktop  >= 1024px → 3 cards
   * Tablet   >= 640px  → 2 cards
   * Mobile   < 640px   → 1 card
   */
  useEffect(() => {
    const updateResponsive = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateResponsive();

    window.addEventListener("resize", updateResponsive);

    return () => {
      window.removeEventListener("resize", updateResponsive);
    };
  }, []);

  /*
   * Measure actual carousel width.
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(element.clientWidth);
    });

    resizeObserver.observe(element);

    setContainerWidth(element.clientWidth);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /*
   * Average rating + review count derived from available data.
   */
  const averageRating = testimonials.length > 0
    ? testimonials.reduce((total, item) => total + item.rating, 0) / testimonials.length
    : 5;
  const reviewCount = testimonials.length;

  /*
   * Maximum possible slide.
   */
  const maxIndex = Math.max(
    0,
    testimonials.length - visibleCards
  );

  /*
   * Reset position when responsive breakpoint changes.
   */
  useEffect(() => {
    setCurrentIndex((index) =>
      Math.min(index, maxIndex)
    );
  }, [maxIndex]);

  /*
   * AUTOMATIC MOVEMENT
   *
   * Every 4 seconds the cards move one position.
   */
  useEffect(() => {
    if (maxIndex === 0) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => {
        if (previous >= maxIndex) {
          return 0;
        }

        return previous + 1;
      });
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [maxIndex]);

  /*
   * Previous.
   */
  const previousSlide = () => {
    setCurrentIndex((previous) => {
      if (previous <= 0) {
        return maxIndex;
      }

      return previous - 1;
    });
  };

  /*
   * Next.
   */
  const nextSlide = () => {
    setCurrentIndex((previous) => {
      if (previous >= maxIndex) {
        return 0;
      }

      return previous + 1;
    });
  };

  /*
   * IMPORTANT FIX:
   *
   * We calculate the movement in PIXELS instead of
   * using percentage on the entire flex track.
   *
   * This makes the carousel actually move correctly.
   */
  const cardWidth =
    containerWidth > 0
      ? containerWidth / visibleCards
      : 0;

  const translateX =
    currentIndex * cardWidth;

  return (
    <section className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <Reveal className="flex items-center justify-between gap-4 mb-5">

          {/* TITLE */}

          <div className="flex items-center gap-2 min-w-0">

            <Truck
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#8CA1BB] shrink-0"
            />

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#24458F] leading-none">
              What Our{" "}
              <span className="text-[#FF7200]">
                Clients Say
              </span>
            </h2>

          </div>

          {/* DESKTOP GOOGLE RATING */}

          <div className="hidden sm:flex items-center gap-3 shrink-0">

            <div className="text-right">

              <div className="flex items-center gap-2">

                <span className="text-3xl lg:text-4xl font-black text-[#24458F]">
                  {averageRating.toFixed(1)}
                </span>

                <div>

                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 fill-[#FF7200] text-[#FF7200]"
                      />
                    ))}
                  </div>

                  <p className="text-[9px] text-slate-500 mt-0.5">
                    Based on {reviewCount} review{(reviewCount === 1 ? "" : "s")}
                  </p>

                </div>

              </div>

            </div>

            {/* ARROWS */}

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous testimonial"
                className="
                  w-9 h-9
                  rounded-full
                  border border-slate-200
                  bg-white
                  flex items-center justify-center
                  text-[#24458F]
                  hover:bg-slate-50
                  hover:border-[#24458F]
                  transition-all
                  shadow-sm
                "
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="
                  w-9 h-9
                  rounded-full
                  border border-slate-200
                  bg-white
                  flex items-center justify-center
                  text-[#24458F]
                  hover:bg-slate-50
                  hover:border-[#24458F]
                  transition-all
                  shadow-sm
                "
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </Reveal>

        {/* =====================================================
            MOBILE RATING
        ====================================================== */}

        <div className="sm:hidden flex items-center justify-between mb-4">

          <div className="flex items-center gap-2">

            <span className="text-2xl font-black text-[#24458F]">
              {averageRating.toFixed(1)}
            </span>

            <div>

              <div className="flex gap-0.5">

                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 fill-[#FF7200] text-[#FF7200]"
                  />
                ))}

              </div>

              <p className="text-[9px] text-slate-500">
                Based on {reviewCount} review{(reviewCount === 1 ? "" : "s")}
              </p>

            </div>

          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={previousSlide}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#24458F]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#24458F]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* =====================================================
            CAROUSEL VIEWPORT
        ====================================================== */}

        <div
          ref={containerRef}
          className="w-full overflow-hidden"
        >

          {/* =================================================
              CAROUSEL TRACK
          ================================================== */}

          <div
            className="
              flex
              transition-transform
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
              will-change-transform
            "
            style={{
              transform: `translate3d(-${translateX}px, 0, 0)`,
            }}
          >

            {testimonials.map((testimonial) => (

              <div
                key={testimonial.id}
                className="shrink-0 px-1.5 sm:px-2"
                style={{
                  width:
                    containerWidth > 0
                      ? `${cardWidth}px`
                      : `${100 / visibleCards}%`,
                }}
              >

                {/* =================================================
                    TESTIMONIAL CARD
                ================================================== */}

                <article
                  className="
                    relative
                    h-[265px]
                    sm:h-[270px]
                    rounded-xl
                    border border-slate-200
                    bg-white
                    p-4
                    sm:p-5
                    shadow-[0_3px_12px_rgba(15,23,42,0.04)]
                    hover:shadow-[0_8px_25px_rgba(15,23,42,0.08)]
                    transition-shadow
                  "
                >

                  {/* QUOTE */}

                  <div className="absolute right-4 -top-3">

                    <div className="
                      w-9
                      h-9
                      rounded-lg
                      bg-[#FF7200]
                      flex
                      items-center
                      justify-center
                      shadow-md
                    ">

                      <Quote
                        className="w-4 h-4 text-white fill-white"
                      />

                    </div>

                  </div>

                  {/* RATING */}

                  <div className="flex items-center justify-between pr-9">

                    <div className="flex gap-0.5">

                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`
                            w-4
                            h-4
                            ${star <= Math.round(testimonial.rating) ? "fill-[#FF7200] text-[#FF7200]" : "fill-slate-200 text-slate-200"}
                          `}
                        />
                      ))}

                    </div>

                    {/* VERIFIED */}

                    {testimonial.isVerified && (
                      <div className="
                        flex
                        items-center
                        gap-1
                        px-2
                        py-0.5
                        rounded-full
                        border
                        border-emerald-200
                        bg-emerald-50
                        text-emerald-600
                      ">

                        <CheckCircle2 className="w-3 h-3" />

                        <span className="text-[8px] font-bold">
                          Verified
                        </span>

                      </div>
                    )}

                  </div>

                  {/* MESSAGE */}

                  <p
                    className="
                      mt-4
                      text-[12px]
                      sm:text-[13px]
                      leading-5
                      sm:leading-[1.45rem]
                      text-slate-600
                      line-clamp-5
                    "
                  >
                    "{testimonial.message}"
                  </p>

                  {/* DIVIDER */}

                  <div className="border-t border-slate-100 my-3.5" />

                  {/* CUSTOMER */}

                  <div className="flex items-center gap-3">

                    {testimonial.photo ? (
                      <img
                        src={getOptimizedImageUrl(testimonial.photo, { width: 96 })}
                        alt={testimonial.name}
                        loading="lazy"
                        decoding="async"
                        className="
                          w-10
                          h-10
                          rounded-full
                          object-cover
                          ring-1
                          ring-slate-200
                          shrink-0
                        "
                      />
                    ) : (
                      <div
                        className={`
                          w-10
                          h-10
                          rounded-full
                          ${testimonial.avatarColor}
                          flex
                          items-center
                          justify-center
                          text-white
                          font-bold
                          text-sm
                          shrink-0
                        `}
                      >
                        {testimonial.initial}
                      </div>
                    )}

                    <div className="min-w-0">

                      <h3 className="
                        text-sm
                        font-bold
                        text-[#24458F]
                        truncate
                      ">
                        {testimonial.name}
                      </h3>

                      <p className="
                        text-[10px]
                        text-slate-500
                        truncate
                      ">
                        {testimonial.role}
                      </p>

                      <p className="
                        text-[10px]
                        text-[#FF7200]
                        font-medium
                        truncate
                      ">
                        {testimonial.company}
                      </p>

                    </div>

                  </div>

                  {/* DATE */}

                  <p className="
                    absolute
                    left-4
                    bottom-4
                    text-[9px]
                    text-[#8CA1BB]
                  ">
                    {testimonial.time}
                  </p>

                </article>

              </div>

            ))}

          </div>

        </div>

        {/* =====================================================
            DOTS
        ====================================================== */}

        <div className="flex justify-center items-center gap-2 mt-4">

          {Array.from({
            length: maxIndex + 1,
          }).map((_, index) => (

            <button
              key={index}
              type="button"
              aria-label={`Show testimonial ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  currentIndex === index
                    ? "w-7 bg-[#FF7200]"
                    : "w-1.5 bg-slate-300"
                }
              `}
            />

          ))}

        </div>

        {/* =====================================================
            GOOGLE STYLE BADGE
        ====================================================== */}

        <div className="flex justify-center mt-4">

          <div className="
            inline-flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-full
            border border-slate-200
            bg-white
            shadow-sm
          ">

            <span className="
              text-[9px]
              sm:text-[10px]
              font-black
              tracking-wider
              text-[#24458F]
            ">
              EXCELLENT
            </span>

            <div className="flex gap-0.5">

              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="
                    w-2.5
                    h-2.5
                    sm:w-3
                    sm:h-3
                    fill-[#FF7200]
                    text-[#FF7200]
                  "
                />
              ))}

            </div>

            <span className="
              text-[9px]
              sm:text-[10px]
              text-slate-500
            ">
              Based on {reviewCount} review{(reviewCount === 1 ? "" : "s")}
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}