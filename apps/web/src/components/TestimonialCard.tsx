import { Star, BadgeCheck } from "lucide-react";

import SmartImage from "@/components/SmartImage";
import type { Testimonial } from "@/lib/types";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {typeof testimonial.rating === "number" && (
        <div className="mb-3 flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={index < testimonial.rating! ? "h-4 w-4 fill-orange text-orange" : "h-4 w-4 text-slate-300"}
              aria-hidden
            />
          ))}
        </div>
      )}
      <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
        “{testimonial.testimonial}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <div className="h-11 w-11 overflow-hidden rounded-full bg-surface">
          <SmartImage value={testimonial.photo} width={88} height={88} className="h-full w-full object-cover" sizes="44px" />
        </div>
        <div>
          <p className="flex items-center gap-1 text-sm font-bold text-navy">
            {testimonial.customerName}
            {testimonial.isVerified && <BadgeCheck className="h-4 w-4 text-orange" aria-label="Verified" />}
          </p>
          {(testimonial.position || testimonial.company) && (
            <p className="text-xs text-slate-500">
              {[testimonial.position, testimonial.company].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
