import { COMPANY_DETAILS, REGIONAL_HUBS } from "../data/logisticsData";
import { SectionHeading, ScrollReveal } from "./motion/primitives";

/**
 * NetworkMapSection — stylized India network visual.
 * Coordinates are percentage-based (no fake geographic precision); the map
 * is a visual representation of network reach from Mundra outward.
 */
const CITIES = [
  { name: "Mundra", x: 8, y: 58, hub: true },
  { name: "Ahmedabad", x: 21, y: 56 },
  { name: "Mumbai", x: 24, y: 76 },
  { name: "Delhi NCR", x: 40, y: 30 },
  { name: "Jaipur", x: 33, y: 41 },
  { name: "Pune", x: 29, y: 81 },
  { name: "Bengaluru", x: 42, y: 92 },
  { name: "Hyderabad", x: 45, y: 76 },
  { name: "Chennai", x: 52, y: 93 },
  { name: "Kolkata", x: 82, y: 60 },
];

export default function NetworkMapSection() {
  const mundra = CITIES[0];

  return (
    <section className="relative overflow-hidden bg-[#03212D] py-20 lg:py-28">
      {/* Dark grid */}
      <div className="absolute inset-0 bg-grid-dark opacity-60" aria-hidden="true" />
      {/* Orange atmosphere */}
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-[#FF6B1A]/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-5">
            <SectionHeading
              dark
              eyebrow="Logistics Network"
              title={
                <>
                  From Mundra to every
                  <span className="block text-[#FF8A3D]">major business hub.</span>
                </>
              }
              description="One origin port. Ten corridors. 500+ destinations. Freight moves out of Mundra daily across road, rail and coastal routes into every major Indian industrial region."
            />

            <ScrollReveal delay={0.15} className="mt-8">
              <div className="flex flex-wrap gap-2">
                {CITIES.slice(1).map((c) => (
                  <span
                    key={c.name}
                    className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white/70"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
              <p className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B1A]" aria-hidden="true" />
                {COMPANY_DETAILS.name} — {REGIONAL_HUBS.length} strategic hubs
              </p>
            </ScrollReveal>
          </div>

          {/* Stylized network visual */}
          <ScrollReveal direction="scale" className="lg:col-span-7">
            <div
              className="relative mx-auto aspect-[4/5] w-full max-w-[520px] sm:aspect-square lg:max-w-none"
              role="img"
              aria-label="Stylized map of Arrowline's pan-India logistics network radiating from Mundra Port"
            >
              {/* SVG route lines */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {CITIES.slice(1).map((city, i) => {
                  const mx = mundra.x + 3;
                  const my = mundra.y;
                  const cx = (mx + city.x) / 2 + (i % 2 === 0 ? 6 : -6);
                  const cy = (my + city.y) / 2 - 6;
                  return (
                    <path
                      key={city.name}
                      d={`M ${mx} ${my} Q ${cx} ${cy} ${city.x} ${city.y}`}
                      fill="none"
                      stroke="url(#routeGrad)"
                      strokeWidth="0.45"
                      strokeLinecap="round"
                      className="al-route-flow"
                      style={{ animationDelay: `${i * 0.25}s` }}
                    />
                  );
                })}
                <defs>
                  <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
              </svg>

              {/* City dots + labels */}
              {CITIES.map((city) => (
                <div
                  key={city.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                >
                  <span
                    className={`relative block rounded-full ${
                      city.hub
                        ? "h-3 w-3 border-2 border-white bg-[#FF6B1A] shadow-[0_0_16px_rgba(255,107,26,0.9)]"
                        : "h-2 w-2 bg-[#FF6B1A]/80"
                    }`}
                  >
                    {city.hub && (
                      <span className="al-pulse-dot absolute inset-0 rounded-full bg-[#FF6B1A]/60" aria-hidden="true" />
                    )}
                  </span>
                  <span
                    className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.14em] sm:text-[10px] ${
                      city.hub ? "text-[#FFB27D]" : "text-white/55"
                    }`}
                  >
                    {city.name}
                  </span>
                </div>
              ))}

              {/* Soft landmass suggestion (abstract, non-geographic) */}
              <div
                aria-hidden="true"
                className="absolute inset-[8%] rounded-[38%_62%_55%_45%/45%_40%_60%_55%] border border-white/[0.06] bg-white/[0.02]"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
