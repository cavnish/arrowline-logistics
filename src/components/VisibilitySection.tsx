import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Satellite,
  MapPin,
  FileCheck2,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading, ScrollReveal } from "./motion/primitives";
import { COMPANY_DETAILS } from "../data/logisticsData";
import { buildTel } from "../utils/contactLinks";

const FEATURES = [
  { icon: Satellite, title: "GPS vehicle tracking", text: "Every vehicle reports position, heading and stop events." },
  { icon: Radio, title: "Live movement monitoring", text: "The dispatch desk watches corridor progress around the clock." },
  { icon: MapPin, title: "Milestone updates", text: "Pickup, transit checkpoints and delivery flagged automatically." },
  { icon: FileCheck2, title: "Digital documentation", text: "e-POD, lashing certificates and trip manifests — paperless closure." },
];

export default function VisibilitySection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden bg-[#F5F7F8] py-20 lg:py-28" id="visibility">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy + feature list */}
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Technology"
              title={
                <>
                  Visibility at
                  <span className="block text-[#FF6B1A]">every mile.</span>
                </>
              }
              description="You should never have to ask where your freight is. Arrowline's fleet telemetry and operations desk keep every shipment observable from gate-out to POD."
            />

            <div className="mt-9 space-y-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <ScrollReveal key={f.title} delay={0.1 + i * 0.08}>
                    <div className="flex items-start gap-4 rounded-xl border border-[#062B3A]/10 bg-white p-4 transition-all duration-300 hover:border-[#FF6B1A]/40 hover:shadow-sm">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#062B3A]/[0.05] text-[#FF6B1A]">
                        <Icon className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold tracking-tight text-[#062B3A]">
                          {f.title}
                        </h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#4A6070]">{f.text}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Dashboard-inspired composition */}
          <ScrollReveal direction="right" className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-[#03212D] p-6 shadow-2xl sm:p-8">
              <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden="true" />

              {/* Header row */}
              <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="al-pulse-dot h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">
                    Live Network — {COMPANY_DETAILS.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                  Operations Desk
                </span>
              </div>

              {/* Mini route visual */}
              <div className="relative mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#062B3A]/60 p-4">
                <svg viewBox="0 0 400 110" className="h-24 w-full sm:h-28" fill="none" aria-hidden="true">
                  <path
                    d="M16 84 C 90 84, 120 30, 200 34 C 280 38, 300 76, 384 66"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 84 C 90 84, 120 30, 200 34 C 280 38, 300 76, 384 66"
                    stroke="#FF6B1A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="al-route-flow"
                  />
                  <circle cx="16" cy="84" r="5" fill="#FF6B1A" />
                  <circle cx="384" cy="66" r="5" stroke="#FF6B1A" strokeWidth="2" fill="#03212D" />
                  {mounted && (
                    <motion.circle
                      r="4"
                      fill="#FFB27D"
                      initial={{ cx: 16, cy: 84 }}
                      animate={{ cx: [16, 120, 210, 300, 384], cy: [84, 56, 34, 60, 66] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </svg>
                <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  <span className="text-[#FFB27D]">Mundra Port</span>
                  <span>Gate-out · MTH-8842</span>
                  <span>Delhi NCR · ETA 06:40</span>
                </div>
              </div>

              {/* Telemetry rows */}
              <div className="relative mt-4 space-y-2.5">
                {[
                  { label: "MTH-8842 · 40ft HC", status: "In transit — NH48", state: "ok" },
                  { label: "MTH-8807 · ODC 12-axle", status: "Checkpoint cleared — Rajasthan", state: "ok" },
                  { label: "CTL-2214 · Port loop", status: "Loading at CFS-3", state: "warn" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.04] px-4 py-3"
                  >
                    <span className="truncate text-xs font-bold text-white/85">{row.label}</span>
                    <span
                      className={`ml-4 flex shrink-0 items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider ${
                        row.state === "ok" ? "text-emerald-300" : "text-amber-300"
                      }`}
                    >
                      <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={buildTel(COMPANY_DETAILS.phone)}
                className="relative mt-5 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FF8A3D] transition-colors hover:text-white"
              >
                Talk to the dispatch desk
                <span className="h-px w-8 bg-[#FF8A3D]/60" aria-hidden="true" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
