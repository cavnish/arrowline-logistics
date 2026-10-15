import { useState } from "react";
import { Route, Gauge, CalendarDays, ShieldCheck, ChevronDown } from "lucide-react";

import SEOMeta from "../components/SEOMeta";
import Reveal from "../components/Reveal";
import TransitTimeEstimator from "../components/estimator/TransitTimeEstimator";
import { COMPANY_DETAILS } from "../data/logisticsData";
import { useSiteContent } from "../hooks/useSiteContent";
import { buildTel, buildWhatsApp } from "../utils/contactLinks";

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

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.q}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5 text-left cursor-pointer"
            >
              <span className="text-sm font-black text-[#062B3A]">{item.q}</span>
              <span
                className={`w-6 h-6 shrink-0 rounded-full bg-[#F0F5FA] text-[#062B3A] flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? "rotate-180 bg-[#FF6B1A] text-white" : ""
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </button>
            {isOpen && (
              <div className="px-4 sm:px-5 pb-4 text-xs text-slate-600 leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TransitEstimatorPage() {
  const content = useSiteContent();
  const phone = content("contact_phone", COMPANY_DETAILS.phone);
  const whatsapp = content("contact_whatsapp", COMPANY_DETAILS.whatsapp);

  return (
    <div className="space-y-14 sm:space-y-16">
      <SEOMeta
        title="Transit Time Estimator | Road Transit Between Any Two Indian Cities | Arrowline"
        description="Estimate road distance, transit days, and delivery window between any two Indian cities — Mundra, Delhi NCR, Mumbai, Jaipur, Bengaluru & 100+ hubs — for containers, FTL, trailers, ODC & project cargo."
        keywords="Mundra to Delhi transit time, Mundra to Mumbai road distance, FTL transit time India, container transport days Mundra, road freight delivery estimate India, logistics transit calculator India, Mundra Port road connectivity"
        canonicalUrl="https://arrowlinelogistics.in/transit-time-estimator"
      />

      {/* Hero */}
      <section className="space-y-4">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-slate-500 font-semibold tracking-wide flex items-center space-x-1.5 uppercase"
        >
          <span className="hover:text-[#1E3A8A] cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="text-[#1E3A8A]">Transit Time Estimator</span>
        </nav>
        <Reveal className="max-w-3xl space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] inline-flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5" />
            Transit Planning Tool · Live Google Routing
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1E3A8A] tracking-tight leading-tight">
            Transit Time Estimator —{" "}
            <span className="text-[#FF7A00]">any two Indian origins, any vehicle</span>
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed sm:text-sm">
            Google Maps plots the real driving route between any two locations —
            ports, plants, pin codes, or hubs — then Arrowline converts distance
            and drive time into an on-road transit window calibrated to its
            operational data across <strong className="text-[#062B3A]">100+
            cities and industrial hubs</strong>. Then send the exact route to our
            Mundra clearance desk for a binding tariff within 2 hours.
          </p>
        </Reveal>
      </section>

      {/* Widget */}
      <section aria-label="Transit time estimator">
        <div className="max-w-5xl mx-auto">
          <TransitTimeEstimator variant="page" />
        </div>
      </section>

      {/* How it's calculated */}
      <Reveal>
        <section className="space-y-6" aria-label="How estimates are calculated">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] block">
              Methodology
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#062B3A] tracking-tight">
              How the estimate is built
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Route className="w-5 h-5" />,
                title: "1. Live route & distance",
                desc: "Google Maps plots the actual driving route between the two chosen locations and returns the real road distance and drive time — no coordinate shortcuts.",
              },
              {
                icon: <Gauge className="w-5 h-5" />,
                title: "2. Vehicle-aware transit",
                desc: "Cruising speed and legal daily driving windows change per class — container chassis, FTL trucks, multi-axle trailers, ODC convoys, and project cargo each get their own profile.",
              },
              {
                icon: <CalendarDays className="w-5 h-5" />,
                title: "3. Delivery window buffers",
                desc: "Origin-side pickup and documentation time plus destination unloading are added on top of driving days, giving a realistic earliest-to-latest delivery range.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0F5FA] text-[#FF6B1A] flex items-center justify-center mb-3">
                  {step.icon}
                </div>
                <h3 className="text-sm font-black text-[#062B3A]">{step.title}</h3>
                <p className="mt-1.5 text-[11.5px] text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* FAQ */}
      <Reveal>
        <section className="space-y-5" aria-label="Transit estimator FAQ">
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] block">
              FAQ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#062B3A] tracking-tight">
              Planning questions, answered
            </h2>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>
      </Reveal>

      {/* Assurance strip */}
      <Reveal>
        <div className="rounded-2xl bg-[#03212D] text-white px-5 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FF7A00] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-black">Need a binding SLA instead of an estimate?</span>
              <span className="block text-[11px] text-slate-300 mt-0.5">
                Our dispatch desk at Mundra Port confirms exact tariffs and slot times within 2 hours — all lanes, all cargo classes.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={buildTel(phone)}
              className="text-xs font-black text-white tracking-wide hover:text-[#FF7A00] transition-colors"
              aria-label={`Call ${phone}`}
            >
              {phone}
            </a>
            <a
              href={buildWhatsApp({ phone: whatsapp, context: "quote" })}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              WhatsApp Desk
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}