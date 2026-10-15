"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Gauge, CalendarDays, Route, ShieldCheck } from "lucide-react";

import TransitTimeEstimator from "./TransitTimeEstimator";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How accurate is the transit estimate?",
    a: "It starts from Google Maps' real driving route and drive time for the exact lane, then applies vehicle-specific cruising speeds and legal daily driving windows observed on trunk national highways, plus realistic pickup and offload buffers. Actual transit can still shift with traffic, weather, toll stoppages, permits (ODC), and port gate schedules. Use it to plan, then confirm a binding SLA with our desk.",
  },
  {
    q: "Does it include customs clearance time?",
    a: "For port-origin lanes the origin buffer includes a nominal 1–2 day documentation / gate-out allowance. Full ICEGATE customs clearance for imports is a separate schedule — share your Bill of Lading and our Mundra clearance desk will fold it into the exact window.",
  },
  {
    q: "What if my exact location isn't searchable?",
    a: "The origin and destination fields use Google Places, so villages, pin codes, plants, and remote industrial areas are normally found instantly. If a location is still missing from search, pick the nearest Arrowline hub for a planning estimate, then mention the exact pin code in the quote form — our routing architects will produce the precise distance, transit, and tariff for the final address.",
  },
  {
    q: "Can you also plan rail / multimodal or heavy ODC moves?",
    a: "Yes. The road estimate is the planning baseline — for moves over ~500 km we frequently combine WDFC rail rakes or coastal loops with first/last-mile trucking. Select 'Project Cargo' or 'ODC' above and our team will route the best multimodal option.",
  },
];

const METHODOLOGY = [
  {
    icon: Route,
    title: "1. Live route & distance",
    desc: "Google Maps plots the actual driving route between the two chosen locations and returns the real road distance and drive time — no coordinate shortcuts.",
  },
  {
    icon: Gauge,
    title: "2. Vehicle-aware transit",
    desc: "Cruising speed and legal daily driving windows change per class — container chassis, FTL trucks, multi-axle trailers, ODC convoys, and project cargo each get their own profile.",
  },
  {
    icon: CalendarDays,
    title: "3. Delivery window buffers",
    desc: "Origin-side pickup and documentation time plus destination unloading are added on top of driving days, giving a realistic earliest-to-latest delivery range.",
  },
];

function sanitizePhone(phone: string) {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

function whatsappHref(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  const message = "Hello Arrowline 👋, I'd like to request a shipping quote.\n\n📦 Cargo type:\n📍 Pickup:\n📍 Destination:\n📅 Preferred date:";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-sm">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left sm:px-5"
            >
              <span className="text-sm font-black text-navy">{item.q}</span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-navy transition-transform duration-300 ${
                  isOpen ? "rotate-180 bg-orange text-white" : ""
                }`}
              >
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </span>
            </button>
            {isOpen && <div className="px-4 pb-4 text-xs leading-relaxed text-slate-600 sm:px-5">{item.a}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default function TransitEstimatorPage({
  phone = "+91 99222 04446",
  whatsapp,
}: {
  phone?: string;
  whatsapp?: string;
}) {
  const whatsappNumber = whatsapp || phone;

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-16 sm:space-y-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Link href="/" className="transition-colors hover:text-navy">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-navy">Transit Time Estimator</span>
        </nav>
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-orange">
            <Route className="h-3.5 w-3.5" aria-hidden />
            Transit Planning Tool · Live Google Routing
          </span>
          <h1 className="text-2xl font-black leading-tight tracking-tight text-navy sm:text-4xl">
            Transit Time Estimator — <span className="text-orange">any two Indian origins, any vehicle</span>
          </h1>
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            Google Maps plots the real driving route between any two locations — ports, plants, pin codes, or hubs —
            then Arrowline converts distance and drive time into an on-road transit window calibrated to its
            operational data across <strong className="text-navy">100+ cities and industrial hubs</strong>. Then send the
            exact route to our Mundra clearance desk for a binding tariff within 2 hours.
          </p>
        </div>
      </section>

      {/* Widget */}
      <section aria-label="Transit time estimator">
        <div className="mx-auto max-w-5xl">
          <TransitTimeEstimator variant="page" />
        </div>
      </section>

      {/* Methodology */}
      <section className="space-y-6" aria-label="How estimates are calculated">
        <div className="space-y-1.5">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-orange">Methodology</span>
          <h2 className="text-xl font-black tracking-tight text-navy sm:text-2xl">How the estimate is built</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {METHODOLOGY.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-orange">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-sm font-black text-navy">{step.title}</h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-5" aria-label="Transit estimator FAQ">
        <div className="space-y-1.5">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-orange">FAQ</span>
          <h2 className="text-xl font-black tracking-tight text-navy sm:text-2xl">Planning questions, answered</h2>
        </div>
        <FaqAccordion items={FAQ_ITEMS} />
      </section>

      {/* Assurance strip */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-navy-dark px-5 py-6 text-white sm:flex-row sm:items-center sm:px-8 sm:py-7">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <span className="block text-sm font-black">Need a binding SLA instead of an estimate?</span>
            <span className="mt-0.5 block text-[11px] text-slate-300">
              Our dispatch desk at Mundra Port confirms exact tariffs and slot times within 2 hours — all lanes, all
              cargo classes.
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a href={`tel:${sanitizePhone(phone)}`} className="text-xs font-black tracking-wide text-white transition-colors hover:text-orange" aria-label={`Call ${phone}`}>
            {phone}
          </a>
          <a
            href={whatsappHref(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-lg bg-[#25D366] px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white transition-colors hover:bg-[#20BA5A]"
          >
            WhatsApp Desk
          </a>
        </div>
      </div>
    </div>
  );
}
