import { useState } from "react";
import { ServiceDetail, COMPANY_DETAILS } from "../data/logisticsData";
import SEOMeta from "./SEOMeta";
import Reveal from "./Reveal";
import { buildMailto, buildTel } from "../utils/contactLinks";
import {
  ArrowRight,
  Check,
  ChevronDown,
  FileCheck2,
  Phone,
  Truck,
} from "lucide-react";

interface ServiceDetailViewProps {
  service: ServiceDetail;
  onOpenQuote: () => void;
}

export default function ServiceDetailView({ service, onOpenQuote }: ServiceDetailViewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Use service data if available, otherwise provide defaults
  const heroHeadline = service.heroHeadline || service.title;
  const heroSubheadline = service.heroSubheadline || service.keyCapability;
  const capabilitiesData = service.capabilities && service.capabilities.length > 0
    ? service.capabilities.map(([title, text]) => [title, text, Check])
    : service.features.slice(0, 6).map((feature) => [feature, service.longDesc, Check]);
  const processData = service.process && service.process.length > 0
    ? service.process.map(([step, title, text]) => [step, title, text])
    : [
        ["01", "Plan", "Share your cargo, route and delivery requirements."],
        ["02", "Coordinate", "Our operations team arranges the right movement plan."],
        ["03", "Move", "Cargo is handled safely with milestone communication."],
        ["04", "Deliver", "We complete delivery and provide confirmation."],
      ];
  const faqsData = service.faqs && service.faqs.length > 0
    ? service.faqs.map(([question, answer]) => [question, answer])
    : [
        ["Can I request a customized quote?", "Yes. Share your cargo, route and timeline and our team will prepare a suitable rate proposal."],
        ["Do you provide shipment updates?", "Yes. Milestone updates are provided according to the service and movement plan."],
      ];

  // Extract industries for display (if available)
  const industriesData = service.industries || [];

  return (
    <div className="bg-[#F5F8FA]">
      <SEOMeta
        title={service.seoTitle}
        description={service.seoDesc}
      />

      <section className="relative overflow-hidden bg-[#062B3A] text-white">
        <div className="absolute inset-0 bg-grid-dark opacity-40" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#FF6B1A]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-7">
            <Reveal>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{heroHeadline}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">{heroSubheadline}</p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">{service.shortDesc}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={onOpenQuote} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-3.5 text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-950/30 transition hover:-translate-y-1 hover:bg-[#FF7A00]">Get a transportation quote <ArrowRight className="h-4 w-4" /></button>
                <a href="#capabilities" className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-xs font-black uppercase tracking-wider transition hover:border-[#FF7A00] hover:text-[#FF9A5B]">Explore capabilities</a>
              </div>
            </Reveal>
          </div>
          <Reveal direction="right" delay={150} className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-2xl">
              <img src={service.image} alt={service.title} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" />
              <div className="absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-[#062B3A]/85 p-4 backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#FF9A5B]">Arrowline network</p>
                <p className="mt-1 text-sm font-bold">{service.keyCapability}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A]">Built around your cargo</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#062B3A] sm:text-4xl">{service.title} that works for your business</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">{service.longDesc}</p>
          </div>
        </Reveal>

        <section id="capabilities" className="mt-14">
          <Reveal>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A]">Service scope</p>
                <h2 className="mt-2 text-3xl font-black text-[#062B3A] sm:text-4xl">What we offer</h2>
              </div>
              <Truck className="hidden h-12 w-12 text-[#FF6B1A]/40 sm:block" />
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilitiesData.map(([title, text, Icon]: any, index) => (
              <Reveal key={String(title)} delay={index * 70}>
                <article className="group h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#FF6B1A]/50 hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-[#EAF3F6] p-3 text-[#062B3A] transition group-hover:bg-[#FF6B1A] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#062B3A]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A]">How it works</p>
              <h2 className="mt-2 text-3xl font-black text-[#062B3A] sm:text-4xl">Simple coordination, controlled delivery</h2>
            </div>
          </Reveal>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {processData.map(([number, title, text], index) => (
              <Reveal key={number} delay={index * 80}>
                <div className="relative border-l-2 border-[#FF6B1A]/30 pl-5">
                  <span className="text-xs font-black tracking-widest text-[#FF6B1A]">{number}</span>
                  <h3 className="mt-2 font-bold text-[#062B3A]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {industriesData.length > 0 && (
          <Reveal>
            <section className="mt-20 grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A]">Coverage</p>
                <h2 className="mt-2 text-3xl font-black text-[#062B3A] sm:text-4xl">Industries we serve</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{service.title} solutions are trusted by leading companies across diverse industries for reliable, compliant and efficient logistics.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {industriesData.map((industry) => (
                  <div key={industry} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-[#062B3A] shadow-sm">
                    <Check className="mb-2 h-4 w-4 text-[#FF6B1A]" />
                    {industry}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        <section className="mt-20 grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A]">Need clarity?</p>
              <h2 className="mt-2 text-3xl font-black text-[#062B3A]">Frequently asked questions</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">Get practical answers about {service.title.toLowerCase()}, routes, vehicles and delivery support.</p>
            </div>
          </Reveal>
          <div className="space-y-3 lg:col-span-3">
            {faqsData.map(([question, answer], index) => (
              <Reveal key={question} delay={index * 60}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-bold text-[#062B3A] transition hover:bg-[#EAF3F6]"
                    aria-expanded={activeFaq === index}
                  >
                    <span>{question}</span>
                    <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#FF6B1A] transition-transform ${activeFaq === index ? "rotate-180" : ""}`} />
                  </button>
                  {activeFaq === index && <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-6 text-slate-600">{answer}</div>}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <section className="relative mt-20 overflow-hidden rounded-[2rem] bg-[#062B3A] p-7 text-white sm:p-10">
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-[#FF6B1A]/20 blur-3xl" />
            <div className="relative max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF9A5B]">Ready when you are</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Get reliable {service.title.toLowerCase()} support</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">Share your pickup, delivery, cargo and timeline with our logistics team and get a suitable transportation solution.</p>
              <div className="mt-7 flex flex-col gap-4 text-sm sm:flex-row sm:items-center">
                <button onClick={onOpenQuote} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B1A] px-6 py-3.5 text-xs font-black uppercase tracking-wider transition hover:bg-[#FF7A00]">Get a transportation quote <ArrowRight className="h-4 w-4" /></button>
                <a href={buildTel(COMPANY_DETAILS.phone)} className="inline-flex items-center gap-2 text-slate-200 hover:text-[#FF9A5B]"><Phone className="h-4 w-4" />{COMPANY_DETAILS.phone}</a>
                <a href={buildMailto({ to: COMPANY_DETAILS.primaryEmail, context: "general" })} className="inline-flex items-center gap-2 text-slate-200 hover:text-[#FF9A5B]"><FileCheck2 className="h-4 w-4" />Email our team</a>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
