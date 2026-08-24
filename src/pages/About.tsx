import { COMPANY_DETAILS, TEAM_MEMBERS } from "../data/logisticsData";
import InteractiveMap from "../components/InteractiveMap";
import SEOMeta from "../components/SEOMeta";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import { buildMailto } from "../utils/contactLinks";
import {
  Eye, Target, Award, TrendingUp,
  Handshake, Shield, Lightbulb, Users, Leaf,
  Mail, MapPin, ArrowRight,
  ClipboardCheck, Cpu, Package
} from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

/* ---------- Small helpers reused inside this page ---------- */

// Vision / Mission / Purpose / Goals — 4 pillar tiles
const PILLARS = [
  {
    icon: Eye,
    title: "Vision",
    text: "To be India's most trusted name in multimodal logistics, consistently delivering service excellence that surpasses customer expectations and creates enduring value.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  {
    icon: Target,
    title: "Mission",
    text: "To build lasting relationships with our customers by delivering exceptional, technology-driven transport solutions—guided by innovation, integrity, and a relentless commitment to excellence.",
    color: "text-[#FF7A00]",
    bg: "bg-[#FEF9F0]",
    ring: "ring-[#FF7A00]/25",
  },
  {
    icon: Award,
    title: "Core Purpose",
    text: "To enrich lives by providing valuable, efficient, and reliable transportation solutions that enhance productivity and bring satisfaction to every stakeholder.",
    color: "text-[#1E3A8A]",
    bg: "bg-blue-50",
    ring: "ring-[#1E3A8A]/25",
  },
  {
    icon: TrendingUp,
    title: "Goals",
    text: "To expand regionally within the transportation sector, developing a strong base of key customers while pioneering sustainable multimodal freight corridors across India.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    ring: "ring-purple-200",
  },
];

// Timeline of key company milestones
const MILESTONES = [
  {
    year: "2014",
    title: "Beginnings",
    text: "Founded in Mundra, Gujarat as Arrowline Logistics by our visionary founders with a small fleet of 5 trucks serving the burgeoning Adani Mundra Port trade.",
  },
  {
    year: "2017",
    title: "Multi-City Expansion",
    text: "Transformed into a Pan-India operator, expanding our fleet to 40+ heavy-duty container trailers and opening dry-port depots in Jaipur and Indore.",
  },
  {
    year: "2018 – 2020",
    title: "Momentum Builds",
    text: "Continued growth in fleet strength, in-house customs brokerage services launched, and integration with CONCOR rail freight corridors established.",
  },
  {
    year: "2022",
    title: "Wider Reach",
    text: "Incorporated as Arrowline Logistics India Pvt Ltd, signalling a major leap forward in pan-India multimodal operations with 150+ GPS-enabled assets.",
  },
  {
    year: "2025",
    title: "Trusted Nationwide Partner",
    text: "Managing a robust fleet of 250+ owned and attached vehicles, serving Fortune-listed clients across coastal, road, rail, and air freight corridors of India.",
  },
];

// Left column info cards for the "What makes Arrowline different?" section
const DIFFERENTIATORS = [
  {
    icon: ClipboardCheck,
    title: "Driver Onboarding & Vetting",
    text: "At Arrowline, we ensure every driver is thoroughly vetted through background checks, license validation, and rigorous health & safety assessments to guarantee safe deliveries.",
    accent: "border-l-[#FF7A00]",
  },
  {
    icon: Cpu,
    title: "Digitally Enabled",
    text: "From e-PODs to real-time dashboards, we're paperless, precise and completely transparent. Every shipment carries live GPS telemetry and automated milestone alerts.",
    accent: "border-l-emerald-500",
  },
  {
    icon: Package,
    title: "End-To-End Ownership",
    text: "One point of contact, full accountability. From port pickup and customs clearance to warehouse delivery, we own every kilometre of your cargo's journey.",
    accent: "border-l-[#1E3A8A]",
  },
];

// Core values (right column list)
const CORE_VALUES = [
  {
    icon: Handshake,
    title: "Customer Commitment",
    text: "We don't just meet expectations, we anticipate them and exceed them at every touchpoint.",
  },
  {
    icon: Shield,
    title: "Integrity",
    text: "Every shipment, every transaction, every handshake is grounded in honesty and transparency.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    text: "We adopt, adapt, and scale technologies that simplify logistics and empower our customers.",
  },
  {
    icon: Users,
    title: "Teamwork",
    text: "Our people are our biggest asset. We win when we work together across departments and geographies.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    text: "From route optimization to green warehouses, we act responsibly for the long term.",
  },
];

/* ---------- Timeline item with individually animated dot & line ---------- */

function TimelineItem({
  milestone,
  isLast,
}: {
  milestone: (typeof MILESTONES)[number];
  isLast: boolean;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="relative pl-10 pb-8 last:pb-0">
      {/* Vertical connector line */}
      {!isLast && (
        <div
          className={`absolute left-[13px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-[#FF7A00] to-[#FF7A00]/20 transition-all duration-1000 origin-top ${
            isVisible ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          }`}
        />
      )}

      {/* Marker dot */}
      <div
        className={`absolute left-0 top-1 w-7 h-7 rounded-full bg-white border-2 border-[#FF7A00] flex items-center justify-center transition-all duration-700 ${
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-[#FF7A00]" />
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-800 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
        style={{ transitionDelay: "300ms" }}
      >
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[#FF7A00] font-black text-base">{milestone.year}:</span>
          <h4 className="text-[#1E3A8A] font-bold text-base">{milestone.title}</h4>
        </div>
        <p className="text-slate-600 text-[12.5px] leading-relaxed max-w-xl">
          {milestone.text}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   ABOUT PAGE
   ================================================================ */
export default function About() {
  return (
    <div className="space-y-20">
      <SEOMeta
        title="About Us | Arrowline Logistics India Story & Hubs"
        description="Learn about Arrowline Logistics, India's trusted multimodal carrier. From Adani Mundra Port to national highway FTL, rail freight, and custom clearance."
      />

      {/* ============================================================
          SECTION 1 — Hero intro (image left, About Us text right)
          ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <Reveal direction="left" className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl group">
            <img
              src="/images/rail-multimodal.jpg"
              alt="Arrowline Logistics multimodal freight corridor across India"
              className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Floating badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur border border-slate-200 rounded-xl px-3 py-2 shadow-md">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#FF7A00]">
                Est. 2014
              </div>
              <div className="text-[11px] font-bold text-[#1E3A8A]">Mundra, Gujarat</div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" className="lg:col-span-6 space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            ARROWLINE LOGISTICS
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E3A8A] leading-tight">
            About Us
          </h1>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Founded in <strong className="text-[#1E3A8A]">2014</strong> by our visionary
              founders, <strong className="text-[#1E3A8A]">Arrowline Logistics</strong> has
              grown from a trusted Indian logistics provider into a globally aligned
              transport solutions partner — serving multinational corporations with scale,
              speed, and integrity.
            </p>
            <p>
              With over a <strong className="text-[#1E3A8A]">decade of expertise</strong>,
              we've built a reputation for delivering reliable, tech-enabled, and
              cost-effective road transport solutions across India. Powered by a fleet of
              own{" "}
              <span className="inline-flex items-baseline">
                <CountUp end={250} className="text-[#FF7A00] font-black" />
                <span className="text-[#FF7A00] font-black">+</span>
              </span>{" "}
              GPS-enabled vehicles — advanced control towers, and a skilled team —
              we ensure seamless cargo movement across every industrial corridor.
            </p>
            <p>
              From <strong className="text-[#1E3A8A]">FMCG and Pharma</strong> to
              chemicals and electronics, Arrowline Logistics offers industry-specific
              logistics strategies and integrated multimodal solutions, making us the
              preferred partner for global enterprises expanding into India.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ============================================================
          SECTION 2 — Company Philosophy
          ============================================================ */}
      <Reveal className="max-w-4xl">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A]">
            Company Philosophy
          </h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              At Arrowline Logistics, our philosophy is rooted in ethics, purpose, and
              progress. We believe in building an organization that stands for
              <strong className="text-[#1E3A8A]"> integrity, innovation, and impact</strong>{" "}
              — values that mirror the spirit of India's greatest industrial legacies and
              continue to inspire our journey every single day.
            </p>
            <p>
              Our{" "}
              <strong className="text-[#FF7A00]">BHAG (Big Hairy Audacious Goal)</strong>{" "}
              is to build an ethically-driven organization that achieves{" "}
              <span className="inline-flex items-baseline">
                <span className="text-[#1E3A8A] font-black">an annual turnover of ₹</span>
                <CountUp end={500} className="text-[#1E3A8A] font-black" />{" "}
                <span className="text-[#1E3A8A] font-black">Cr by 2030</span>
              </span>{" "}
              — while creating sustainable growth that inspires people, empowers
              communities, and leaves behind a lasting legacy of excellence.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ============================================================
          SECTION 3 — Vision / Mission / Purpose / Goals
          ============================================================ */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={i} delay={i * 120} direction="up">
                <div className="group h-full">
                  <div
                    className={`${p.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ring-1 ${p.ring} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    <Icon className={`w-7 h-7 ${p.color}`} strokeWidth={2.2} />
                  </div>
                  <h3 className={`${p.color} text-lg font-black mb-2`}>{p.title}</h3>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          SECTION 4 — Milestones (Key Moments in Our Legacy)
          ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <Reveal direction="left" className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            MILESTONES
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A] leading-tight">
            Key Moments in <br />
            <span className="text-[#FF7A00]">Our Legacy</span>
          </h2>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
            <img
              src="/images/business-handshake.jpg"
              alt="Arrowline Logistics partnership handshake sealing a Pan-India logistics agreement"
              className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <p className="text-[11.5px] text-slate-500 italic leading-relaxed">
            Expands into multi-city operations and signs its first long-term contract with
            a Fortune 500 company.
          </p>
        </Reveal>

        <div className="lg:col-span-7 relative">
          {MILESTONES.map((m, i) => (
            <TimelineItem
              key={m.year}
              milestone={m}
              isLast={i === MILESTONES.length - 1}
            />
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 5 — What makes Arrowline different?
          Left: 3 accent cards ; Right: heading + truck image
          ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5 space-y-4">
          {DIFFERENTIATORS.map((d, i) => {
            const Icon = d.icon;
            return (
              <Reveal key={i} direction="left" delay={i * 150}>
                <div
                  className={`bg-emerald-50/50 hover:bg-white border border-emerald-100 hover:border-emerald-300 border-l-4 ${d.accent} rounded-r-xl rounded-l-md p-5 transition-all duration-300 group hover:shadow-md hover:-translate-x-1`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#1E3A8A]" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-[#1E3A8A] font-black text-base leading-tight pt-1">
                      {d.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed pl-12">
                    {d.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal direction="right" className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            BEST VALUE SYSTEM
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A] leading-tight">
            What makes <br />
            <span className="text-[#FF7A00]">Arrowline different?</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md">
            We fuse operational discipline, digital transparency, and end-to-end
            accountability — creating an experience customers keep coming back for.
          </p>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group mt-4">
            <img
              src="/images/road-transport.jpg"
              alt="Arrowline modern GPS-enabled fleet on Indian expressway highway"
              className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </Reveal>
      </section>

      {/* ============================================================
          SECTION 6 — Core Values list with truck fleet image
          ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <Reveal direction="left" className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group lg:sticky lg:top-28">
            <img
              src="/images/truck-fleet-yard.jpg"
              alt="Arrowline Logistics fleet parked at Mundra Port container yard, Gujarat"
              className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-7 space-y-6">
          <Reveal direction="right" className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A]">
              Core Values
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At Arrowline, values aren't just printed on paper — they're practiced every
              single day, across every kilometre of every corridor.
            </p>
          </Reveal>

          <div className="space-y-1">
            {CORE_VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal
                  key={i}
                  direction="right"
                  delay={i * 100}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <div className="group py-4 flex items-start gap-4 hover:bg-[#FEF9F0]/50 hover:pl-4 rounded-lg transition-all duration-300 cursor-default">
                    <div className="w-10 h-10 bg-[#FEF9F0] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF7A00] group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#FF7A00] group-hover:text-white transition-colors" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#FF7A00] font-black text-base mb-0.5 flex items-center gap-1.5">
                        {v.title}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </h3>
                      <p className="text-[12.5px] text-slate-600 leading-relaxed">
                        {v.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7 — Interactive India Map
          ============================================================ */}
      <section className="space-y-6">
        <Reveal className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            NETWORK COVERAGE
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A] leading-tight">
            Our Regional <span className="text-[#FF7A00]">Operative Centers</span> in India
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Connecting coastal terminals, rail junctions, and national expressways, we
            keep containers moving smoothly across the length and breadth of India.
          </p>
        </Reveal>
        <Reveal direction="scale">
          <InteractiveMap />
        </Reveal>
      </section>

      {/* ============================================================
          SECTION 8 — Leadership Team
          ============================================================ */}
      <section className="space-y-8">
        <Reveal className="space-y-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            LEADERSHIP
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A]">
            The Architects of <span className="text-[#FF7A00]">our success</span>
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Meet the crew coordinating multi-state route surveys, port clearance
            compliance, customs filings, and pan-India dispatch loops.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <Reveal key={idx} delay={idx * 120} direction="up">
              <div className="bg-white border border-slate-200 hover:border-[#FF7A00]/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full group shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 text-[9px] font-bold text-[#1E3A8A] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur shadow-sm">
                    {member.location}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wide group-hover:text-[#FF7A00] transition-colors">
                      {member.name}
                    </h4>
                    <span className="block text-[10px] font-semibold text-[#FF7A00] uppercase tracking-wider">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed flex-1">
                    {member.bio}
                  </p>

                  {member.email && (
                    <div className="pt-2 border-t border-slate-200">
                      <a
                        href={buildMailto({
                          to: member.email,
                          subject: `Inquiry for ${member.name} — Arrowline Logistics`,
                          body:
                            `Hello ${member.name},\r\n\r\n` +
                            `I came across your profile on the Arrowline Logistics website and would like to connect.\r\n\r\n` +
                            `Thank you,\r\n`,
                        })}
                        className="inline-flex items-center space-x-1.5 text-[10px] font-semibold text-slate-600 hover:text-[#1E3A8A] transition-colors"
                        aria-label={`Send email to ${member.name}`}
                      >
                        <Mail className="w-3.5 h-3.5 text-[#FF7A00]" />
                        <span className="truncate max-w-[150px]">{member.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 9 — Bottom CTA strip
          ============================================================ */}
      <Reveal direction="scale">
        <div className="relative bg-gradient-to-r from-[#1E3A8A] via-[#2A4CA0] to-[#1E3A8A] rounded-3xl overflow-hidden shadow-2xl p-8 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,122,0,0.3),transparent_60%)]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Ready to partner with <span className="text-[#FF7A00]">Arrowline</span>?
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed max-w-md">
                {COMPANY_DETAILS.aboutShort}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <a
                href="#/contact"
                className="px-6 py-3 bg-[#FF7A00] hover:bg-[#E56D00] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Visit Mundra Base</span>
              </a>
              <a
                href={buildMailto({ to: COMPANY_DETAILS.primaryEmail, context: "general" })}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest rounded-xl backdrop-blur transition-all flex items-center justify-center gap-2"
                aria-label={`Send email to ${COMPANY_DETAILS.primaryEmail}`}
              >
                <Mail className="w-4 h-4" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
