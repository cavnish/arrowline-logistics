import Link from "next/link";
import { ArrowRight } from "lucide-react";

import SmartImage from "@/components/SmartImage";
import type { ServiceSummary } from "@/lib/types";

export default function ServiceCard({ service }: { service: ServiceSummary }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <SmartImage
          value={service.heroImage}
          width={800}
          height={500}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-black text-navy">{service.title}</h3>
        {service.shortDescription && (
          <p className="mt-2 flex-1 text-sm text-slate-600">{service.shortDescription}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange">
          Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
