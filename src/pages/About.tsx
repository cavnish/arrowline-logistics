import { useEffect, useState, type ReactNode } from "react";
import { COMPANY_DETAILS, TEAM_MEMBERS } from "../data/logisticsData";
import { contentService } from "../services/contentService";
import SEOMeta from "../components/SEOMeta";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import { buildMailto } from "../utils/contactLinks";
import {
  Eye, Target, Award, TrendingUp,
  Handshake, Shield, Lightbulb, Users, Leaf,
  Mail, MapPin, ArrowRight,
  ClipboardCheck, Cpu, Package,
  Activity, Workflow, Globe, Rocket, Truck, Star, Medal, Warehouse, HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";

/* ---------- CMS-driven content ---------- */

type AboutData = {
  siteContent: Record<string, string>;
  images: any[];
  pillars: any[];
  milestones: any[];
  differentiators: any[];
};

const STATIC_IMAGES: Record<string, { url: string; alt: string }> = {
  hero: {
    url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
    alt: "Arrowline Logistics multimodal freight corridor across India",
  },
  milestones: {
    url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377036/arrowline/general/business-handshake.jpg",
    alt: "Arrowline Logistics partnership handshake sealing a Pan-India logistics agreement",
  },
  differentiators: {
    url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
    alt: "Arrowline modern GPS-enabled fleet on Indian expressway highway",
  },
  "core-values": {
    url: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg",
    alt: "Arrowline Logistics fleet parked at Mundra Port container yard, Gujarat",
  },
};

// Static fallback copy. The API always wins; these only render when the
// backend is unreachable or a row has not been configured yet.
const STATIC_PILLARS = [
  { icon: "Eye", title: "Vision", text: "To be India's most trusted name in multimodal logistics, consistently delivering service excellence that surpasses customer expectations and creates enduring value.", color: "emerald" },
  { icon: "Target", title: "Mission", text: "To build lasting relationships with our customers by delivering exceptional, technology-driven transport solutions—guided by innovation, integrity, and a relentless commitment to excellence.", color: "orange" },
  { icon: "Award", title: "Core Purpose", text: "To enrich lives by providing valuable, efficient, and reliable transportation solutions that enhance productivity and bring satisfaction to every stakeholder.", color: "blue" },
  { icon: "TrendingUp", title: "Goals", text: "To expand regionally within the transportation sector, developing a strong base of key customers while pioneering sustainable multimodal freight corridors across India.", color: "purple" },
];

const STATIC_MILESTONES = [
  { year: "2014", title: "Beginnings", text: "Founded in Mundra, Gujarat as Arrowline Logistics by our visionary founders with a small fleet of 5 trucks serving the burgeoning Adani Mundra Port trade." },
  { year: "2017", title: "Multi-City Expansion", text: "Transformed into a Pan-India operator, expanding our fleet to 40+ heavy-duty container trailers and opening dry-port depots in Jaipur and Indore." },
  { year: "2018 – 2020", title: "Momentum Builds", text: "Continued growth in fleet strength, in-house customs brokerage services launched, and integration with CONCOR rail freight corridors established." },
  { year: "2022", title: "Wider Reach", text: "Incorporated as Arrowline Logistics India Pvt Ltd, signalling a major leap forward in pan-India multimodal operations with 150+ GPS-enabled assets." },
  { year: "2025", title: "Trusted Nationwide Partner", text: "Managing a robust fleet of 250+ owned and attached vehicles, serving Fortune-listed clients across coastal, road, rail, and air freight corridors of India." },
];

const STATIC_DIFFERENTIATORS = [
  { icon: "ClipboardCheck", title: "Driver Onboarding & Vetting", text: "At Arrowline, we ensure every driver is thoroughly vetted through background checks, license validation, and rigorous health & safety assessments to guarantee safe deliveries.", accent: "orange" },
  { icon: "Cpu", title: "Digitally Enabled", text: "From e-PODs to real-time dashboards, we're paperless, precise and completely transparent. Every shipment carries live GPS telemetry and automated milestone alerts.", accent: "emerald" },
  { icon: "Package", title: "End-To-End Ownership", text: "One point of contact, full accountability. From port pickup and customs clearance to warehouse delivery, we own every kilometre of your cargo's journey.", accent: "blue" },
];

const PILLAR_COLORS: Record<string, { color: string; bg: string; ring: string }> = {
  emerald: { color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200" },
  orange: { color: "text-[#FF7A00]", bg: "bg-[#FEF9F0]", ring: "ring-[#FF7A00]/25" },
  blue: { color: "text-[#1E3A8A]", bg: "bg-blue-50", ring: "ring-[#1E3A8A]/25" },
  purple: { color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-200" },
};

const DIFF_ACCENTS: Record<string, string> = {
  orange: "border-l-[#FF7A00]",
  emerald: "border-l-emerald-500",
  blue: "border-l-[#1E3A8A]",
};

const ICON_MAP: Record<string, LucideIcon> = {
  Eye,
  Target,
  Award,
  TrendingUp,
  Handshake,
  Shield,
  Lightbulb,
  Users,
  Leaf,
  ClipboardCheck,
  Cpu,
  Package,
  Activity,
  Workflow,
  Globe,
  Rocket,
  Truck,
  Star,
  Medal,
  Warehouse,
  HeartHandshake,
};

const CORE_VALUE_ICONS: Record<string, LucideIcon> = {
  ShieldCheck: Shield,
  TrendingDown: TrendingUp,
  Activity,
  Workflow,
  Globe,
};

function renderParagraph(text: string | undefined): string {
  return String(text || "").trim();
}

// Splits an inline string on **bold** markers. Highlighted phrases are
// rendered with the supplied className so section-specific colors work.
function renderBold(text: string, className: string): ReactNode[] {
  return String(text || "")
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className={className}>
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      )
    );
}

function resolveImage(about: AboutData | null, slot: string): { url: string; alt: string } {
  const fallback = STATIC_IMAGES[slot] || { url: "", alt: "" };
  if (!about) return fallback;
  const row = about.images.find(
    (item) => item.slot === slot && item.is_published !== false && item.image_url
  );
  return { url: row?.image_url || fallback.url, alt: row?.alt_text || fallback.alt };
}

function tileText(about: AboutData | null, key: string, fallback: string): string {
  const value = about?.siteContent?.[key];
  return value !== undefined && String(value).trim() !== "" ? String(value) : fallback;
}

function tileNumber(about: AboutData | null, key: string, fallback: number): number {
  const value = about?.siteContent?.[key];
  const parsed = Number(value);
  return value !== undefined && !Number.isNaN(parsed) && parsed > 0 ? parsed : fallback;
}

/* ---------- Timeline item with individually animated dot & line ---------- */

interface TimelineMilestone {
  year: string;
  title: string;
  text: string;
}

function TimelineItem({
  milestone,
  isLast,
}: {
  milestone: TimelineMilestone;
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
  const [dbAbout, setDbAbout] = useState<AboutData | null>(null);
  const [dbLeaders, setDbLeaders] = useState<any[]>([]);
  const [dbValues, setDbValues] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    contentService
      .getAbout()
      .then((data) => { if (mounted) setDbAbout(data); })
      .catch(() => undefined);
    contentService
      .getLeadership()
      .then((rows) => { if (mounted) setDbLeaders(rows); })
      .catch(() => undefined);
    contentService
      .getCoreValues()
      .then((rows) => { if (mounted) setDbValues(rows); })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const about = dbAbout; // API data wins; null keeps static fallbacks

  const pillars =
    about && about.pillars.length > 0
      ? about.pillars
      : STATIC_PILLARS;

  const milestones =
    about && about.milestones.length > 0
      ? about.milestones
      : STATIC_MILESTONES;

  const differentiators =
    about && about.differentiators.length > 0
      ? about.differentiators
      : STATIC_DIFFERENTIATORS;

  const heroImage = resolveImage(about, "hero");
  const milestonesImage = resolveImage(about, "milestones");
  const differentiatorsImage = resolveImage(about, "differentiators");
  const coreValuesImage = resolveImage(about, "core-values");

  const leaders =
    dbLeaders.length > 0
      ? dbLeaders
      : TEAM_MEMBERS.map((member) => ({
          name: member.name,
          role: member.role,
          location: member.location,
          email: member.email,
          image: member.image,
          bio: member.bio,
        }));

  const coreValues =
    dbValues.length > 0
      ? dbValues.map((value) => ({
          icon: CORE_VALUE_ICONS[value.icon] || Handshake,
          title: value.title,
          text: value.description,
        }))
      : [
          { icon: Handshake, title: "Customer Commitment", text: "We don't just meet expectations, we anticipate them and exceed them at every touchpoint." },
          { icon: Shield, title: "Integrity", text: "Every shipment, every transaction, every handshake is grounded in honesty and transparency." },
          { icon: Lightbulb, title: "Innovation", text: "We adopt, adapt, and scale technologies that simplify logistics and empower our customers." },
          { icon: Users, title: "Teamwork", text: "Our people are our biggest asset. We win when we work together across departments and geographies." },
          { icon: Leaf, title: "Sustainability", text: "From route optimization to green warehouses, we act responsibly for the long term." },
        ];

  const heroBadgeLabel = tileText(about, "about_hero_badge_label", "Est. 2014");
  const heroBadgePlace = tileText(about, "about_hero_badge_place", "Mundra, Gujarat");
  const heroEyebrow = tileText(about, "about_hero_eyebrow", "ARROWLINE LOGISTICS");
  const heroTitle = tileText(about, "about_hero_title", "About Us");
  const heroP1 = tileText(about, "about_hero_p1", "Founded in 2014 by our visionary founders, Arrowline Logistics has grown from a trusted Indian logistics provider into a globally aligned transport solutions partner — serving multinational corporations with scale, speed, and integrity.");
  const heroP2Pre = tileText(about, "about_hero_p2_pre", "With over a decade of expertise, we've built a reputation for delivering reliable, tech-enabled, and cost-effective road transport solutions across India. Powered by a fleet of own ");
  const heroP2Post = tileText(about, "about_hero_p2_post", " GPS-enabled vehicles — advanced control towers, and a skilled team — we ensure seamless cargo movement across every industrial corridor.");
  const heroP3 = tileText(about, "about_hero_p3", "From FMCG and Pharma to chemicals and electronics, Arrowline Logistics offers industry-specific logistics strategies and integrated multimodal solutions, making us the preferred partner for global enterprises expanding into India.");
  const fleetCount = tileNumber(about, "about_fleet_count", 250);

  const philosophyHeading = tileText(about, "about_philosophy_heading", "Company Philosophy");
  const philosophyP1 = tileText(about, "about_philosophy_p1", "At Arrowline Logistics, our philosophy is rooted in ethics, purpose, and progress. We believe in building an organization that stands for integrity, innovation, and impact — values that mirror the spirit of India's greatest industrial legacies and continue to inspire our journey every single day.");
  const bhagPre = tileText(about, "about_bhag_p2_pre", "Our BHAG (Big Hairy Audacious Goal) is to build an ethically-driven organization that achieves ");
  const bhagPost = tileText(about, "about_bhag_p2_post", " Cr by ");
  const bhagTail = tileText(about, "about_bhag_p2_tail", " — while creating sustainable growth that inspires people, empowers communities, and leaves behind a lasting legacy of excellence.");
  const bhagAmount = tileNumber(about, "about_bhag_amount", 500);
  const bhagYear = tileText(about, "about_bhag_year", "2030");

  const milestonesEyebrow = tileText(about, "about_milestones_eyebrow", "MILESTONES");
  const milestonesHeading1 = tileText(about, "about_milestones_heading_1", "Key Moments in");
  const milestonesHeading2 = tileText(about, "about_milestones_heading_2", "Our Legacy");
  const milestonesCaption = tileText(about, "about_milestones_caption", "Expands into multi-city operations and signs its first long-term contract with a Fortune 500 company.");

  const diffEyebrow = tileText(about, "about_differentiators_eyebrow", "BEST VALUE SYSTEM");
  const diffHeading1 = tileText(about, "about_differentiators_heading_1", "What makes");
  const diffHeading2 = tileText(about, "about_differentiators_heading_2", "Arrowline different?");
  const diffSubtext = tileText(about, "about_differentiators_subtext", "We fuse operational discipline, digital transparency, and end-to-end accountability — creating an experience customers keep coming back for.");

  const coreValuesHeading = tileText(about, "about_corevalues_heading", "Core Values");
  const coreValuesSubtext = tileText(about, "about_corevalues_subtext", "At Arrowline, values aren't just printed on paper — they're practiced every single day, across every kilometre of every corridor.");

  const leadersEyebrow = tileText(about, "about_leaders_eyebrow", "LEADERSHIP");
  const leadersHeading = tileText(about, "about_leaders_heading", "The Architects of **our success**");
  const leadersSubtext = tileText(about, "about_leaders_subtext", "Meet the crew coordinating multi-state route surveys, port clearance compliance, customs filings, and pan-India dispatch loops.");

  const ctaHeading = tileText(about, "about_cta_heading", "Ready to partner with **Arrowline**?");
  const ctaBody = tileText(about, "about_cta_body", COMPANY_DETAILS.aboutShort);
  const ctaBtn1 = tileText(about, "about_cta_btn1_label", "Visit Mundra Headquarters");
  const ctaBtn2 = tileText(about, "about_cta_btn2_label", "Email Us");

  return (
    <div className="space-y-20">
      <SEOMeta
        title="About Us | Logistics Company in Mundra & Pan-India Network | Arrowline"
        description="Learn about Arrowline Logistics, an authorized logistics company headquartered at Mundra Port, Gujarat. Connecting Mundra Port to Delhi-NCR, Mumbai, Jaipur, and nationwide manufacturing hubs with dedicated container haulage, FTL road freight, and rail rakes."
        keywords="About Arrowline Logistics, Logistics Company in Mundra, Mundra Port Logistics Company, Pan-India Transportation Company, Multimodal Logistics India, Mundra Logistics Network"
        canonicalUrl="https://arrowlinelogistics.in/about"
      />

      {/* ============================================================
          SECTION 1 — Hero intro (image left, About Us text right)
          ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <Reveal direction="left" className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl group">
            <img
              src={heroImage.url}
              alt={heroImage.alt}
              className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Floating badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur border border-slate-200 rounded-xl px-3 py-2 shadow-md">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#FF7A00]">
                {heroBadgeLabel}
              </div>
              <div className="text-[11px] font-bold text-[#1E3A8A]">{heroBadgePlace}</div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" className="lg:col-span-6 space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            {heroEyebrow}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E3A8A] leading-tight">
            {heroTitle}
          </h1>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>{renderBold(heroP1, "text-[#1E3A8A]")}</p>
            <p>
              {renderBold(heroP2Pre, "text-[#1E3A8A]")}
              <span className="inline-flex items-baseline">
                <CountUp end={fleetCount} className="text-[#FF7A00] font-black" />
                <span className="text-[#FF7A00] font-black">+</span>
              </span>
              {renderBold(heroP2Post, "text-[#1E3A8A]")}
            </p>
            <p>{renderBold(heroP3, "text-[#1E3A8A]")}</p>
          </div>
        </Reveal>
      </section>

      {/* ============================================================
          SECTION 2 — Company Philosophy
          ============================================================ */}
      <Reveal className="max-w-4xl">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A]">
            {philosophyHeading}
          </h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>{renderBold(philosophyP1, "text-[#1E3A8A]")}</p>
            <p>
              {renderBold(bhagPre, "text-[#1E3A8A]")}
              <span className="inline-flex items-baseline">
                <span className="text-[#1E3A8A] font-black">an annual turnover of ₹</span>
                <CountUp end={bhagAmount} className="text-[#1E3A8A] font-black" />
                <span className="text-[#1E3A8A] font-black">{bhagPost} {bhagYear}</span>
              </span>
              {renderBold(bhagTail, "text-[#1E3A8A]")}
            </p>
          </div>
        </div>
      </Reveal>

      {/* ============================================================
          SECTION 3 — Vision / Mission / Purpose / Goals
          ============================================================ */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((p, i) => {
            const c = PILLAR_COLORS[p.color] || PILLAR_COLORS.emerald;
            const Icon = ICON_MAP[p.icon] || Eye;
            return (
              <Reveal key={i} delay={i * 120} direction="up">
                <div className="group h-full">
                  <div
                    className={`${c.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ring-1 ${c.ring} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    <Icon className={`w-7 h-7 ${c.color}`} strokeWidth={2.2} />
                  </div>
                  <h3 className={`${c.color} text-lg font-black mb-2`}>{p.title}</h3>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed">{renderParagraph(p.text)}</p>
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
            {milestonesEyebrow}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A] leading-tight">
            {milestonesHeading1} <br />
            <span className="text-[#FF7A00]">{milestonesHeading2}</span>
          </h2>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
            <img
              src={milestonesImage.url}
              alt={milestonesImage.alt}
              className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <p className="text-[11.5px] text-slate-500 italic leading-relaxed">
            {milestonesCaption}
          </p>
        </Reveal>

        <div className="lg:col-span-7 relative">
          {milestones.map((m, i) => (
            <TimelineItem
              key={`${m.year}-${i}`}
              milestone={m}
              isLast={i === milestones.length - 1}
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
          {differentiators.map((d, i) => {
            const Icon = ICON_MAP[d.icon] || ClipboardCheck;
            const accent = DIFF_ACCENTS[d.accent] || DIFF_ACCENTS.orange;
            return (
              <Reveal key={i} direction="left" delay={i * 150}>
                <div
                  className={`bg-emerald-50/50 hover:bg-white border border-emerald-100 hover:border-emerald-300 border-l-4 ${accent} rounded-r-xl rounded-l-md p-5 transition-all duration-300 group hover:shadow-md hover:-translate-x-1`}
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
                    {renderParagraph(d.text)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal direction="right" className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            {diffEyebrow}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A] leading-tight">
            {diffHeading1} <br />
            <span className="text-[#FF7A00]">{diffHeading2}</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md">
            {diffSubtext}
          </p>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group mt-4">
            <img
              src={differentiatorsImage.url}
              alt={differentiatorsImage.alt}
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
              src={coreValuesImage.url}
              alt={coreValuesImage.alt}
              className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-7 space-y-6">
          <Reveal direction="right" className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A]">
              {coreValuesHeading}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {coreValuesSubtext}
            </p>
          </Reveal>

          <div className="space-y-1">
            {coreValues.map((v, i) => {
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
          SECTION 8 — Leadership Team
          ============================================================ */}
      <section className="space-y-8">
        <Reveal className="space-y-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            {leadersEyebrow}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E3A8A]">
            {renderBold(leadersHeading, "text-[#FF7A00]")}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            {leadersSubtext}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((member, idx) => (
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
                {renderBold(ctaHeading, "text-[#FF7A00]")}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed max-w-md">
                {ctaBody}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <a
                href="/contact"
                className="px-6 py-3 bg-[#FF7A00] hover:bg-[#E56D00] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>{ctaBtn1}</span>
              </a>
              <a
                href={buildMailto({ to: COMPANY_DETAILS.primaryEmail, context: "general" })}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-black uppercase tracking-widest rounded-xl backdrop-blur transition-all flex items-center justify-center gap-2"
                aria-label={`Send email to ${COMPANY_DETAILS.primaryEmail}`}
              >
                <Mail className="w-4 h-4" />
                <span>{ctaBtn2}</span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}