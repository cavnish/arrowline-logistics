import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";

const projects = [
  {
    image: "/images/project-road.jpg",
    title: "Road Transportation",
    location: "Pan-India",
  },
  {
    image: "/images/project-port.jpg",
    title: "Mundra Port Logistics",
    location: "Gujarat",
  },
  {
    image: "/images/project-warehouse.jpg",
    title: "Warehouse & Cargo",
    location: "India",
  },
];

const advantages = [
  {
    icon: Truck,
    title: "Multimodal Network",
    text: "Road, rail, sea & air",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    text: "GPS tracked cargo",
  },
  {
    icon: MapPin,
    title: "Mundra Advantage",
    text: "Strong port access",
  },
  {
    icon: Zap,
    title: "Smart Logistics",
    text: "Live shipment updates",
  },
];

export default function CoreAdvantages() {
  return (
    <section
      id="advantages"
      className="relative overflow-hidden bg-[#071C27] py-14 sm:py-16 lg:py-20"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#FF6B1A]/10 blur-[100px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#00C2CB]/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ───────────────── TOP ───────────────── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-5">

            {/* Label */}
            <div
              className="mb-4 flex items-center gap-2"
              style={{
                animation: "fadeUp 0.7s ease-out both",
              }}
            >
              <span className="h-[2px] w-7 bg-[#FF6B1A]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF6B1A]">
                Our Core Advantages
              </span>
            </div>

            {/* Heading */}
            <h2
              className="max-w-lg text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={{
                animation: "fadeUp 0.7s ease-out 100ms both",
              }}
            >
              Why Corporate India
              <span className="block text-[#FF6B1A]">
                Chooses Arrowline
              </span>
            </h2>

            {/* Description */}
            <p
              className="mt-5 max-w-md text-sm leading-6 text-white/55 sm:text-base"
              style={{
                animation: "fadeUp 0.7s ease-out 200ms both",
              }}
            >
              Strong port access, reliable transport and complete
              shipment visibility — built for modern Indian businesses.
            </p>

            {/* CTA */}
            <button
              className="
                group mt-6
                inline-flex items-center gap-2
                rounded-lg
                bg-[#FF6B1A]
                px-5 py-2.5
                text-xs font-bold text-white
                shadow-[0_8px_25px_rgba(255,107,26,0.25)]
                transition-all duration-300
                hover:-translate-y-1
                hover:bg-[#ff7a32]
              "
              style={{
                animation: "fadeUp 0.7s ease-out 300ms both",
              }}
            >
              Explore Our Network

              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            {/* PROJECT IMAGES */}
            <div
              className="mt-10 grid grid-cols-3 gap-2 sm:gap-3"
              style={{
                animation: "fadeUp 0.8s ease-out 400ms both",
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="group relative aspect-[1.25/1] overflow-hidden rounded-lg border border-white/10"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="
                      h-full w-full
                      object-cover
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Location */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-[8px] font-bold uppercase tracking-wide text-white sm:text-[9px]">
                      {project.title}
                    </p>

                    <p className="mt-0.5 text-[7px] text-white/60 sm:text-[8px]">
                      {project.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ───────────────── CENTER MAP ───────────────── */}
          <div
            className="relative flex min-h-[320px] items-center justify-center lg:col-span-4"
            style={{
              animation: "mapReveal 1s ease-out 300ms both",
            }}
          >
            {/* Map glow */}
            <div className="absolute h-56 w-56 rounded-full bg-[#FF6B1A]/10 blur-3xl" />

            {/* India Map */}
            <div className="relative w-[210px] sm:w-[240px] lg:w-[260px]">

              <img
                src="/images/india-map.svg"
                alt="Arrowline Logistics India network"
                loading="lazy"
                decoding="async"
                className="
                  relative z-10
                  w-full
                  opacity-80
                  drop-shadow-[0_0_20px_rgba(255,107,26,0.15)]
                "
              />

              {/* LOCATION DOTS */}

              <span className="map-dot left-[47%] top-[22%]" />
              <span className="map-dot left-[55%] top-[30%]" />
              <span className="map-dot left-[42%] top-[40%]" />
              <span className="map-dot left-[49%] top-[50%]" />
              <span className="map-dot left-[38%] top-[59%]" />
              <span className="map-dot left-[55%] top-[68%]" />
              <span className="map-dot left-[48%] top-[78%]" />

              {/* Mundra highlight */}
              <div className="absolute left-[30%] top-[38%] z-20">
                <span className="absolute -inset-2 animate-ping rounded-full bg-[#FF6B1A]/30" />

                <span className="relative block h-3 w-3 rounded-full border-2 border-white bg-[#FF6B1A]" />

                <div className="absolute left-5 top-[-5px] whitespace-nowrap">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#FF6B1A]">
                    Mundra Hub
                  </span>
                </div>
              </div>
            </div>

            {/* Floating network label */}
            <div
              className="
                absolute bottom-5
                rounded-full
                border border-white/10
                bg-white/5
                px-4 py-2
                backdrop-blur-md
              "
            >
              <span className="text-[9px] font-semibold uppercase tracking-widest text-white/60">
                Pan-India Network
              </span>
            </div>
          </div>

          {/* ───────────────── RIGHT ADVANTAGES ───────────────── */}
          <div className="lg:col-span-3">

            <div className="mb-5 flex items-center gap-2">
              <span className="h-px w-6 bg-[#FF6B1A]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                Why Arrowline
              </span>
            </div>

            <div className="space-y-2">
              {advantages.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
                      group
                      flex items-center gap-3
                      rounded-xl
                      border border-white/8
                      bg-white/[0.035]
                      p-3
                      transition-all duration-300
                      hover:-translate-x-1
                      hover:border-[#FF6B1A]/30
                      hover:bg-white/[0.07]
                    "
                    style={{
                      animation: `slideRight 0.6s ease-out ${
                        200 + index * 100
                      }ms both`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-[#FF6B1A]/10
                        text-[#FF6B1A]
                        transition-all duration-300
                        group-hover:bg-[#FF6B1A]
                        group-hover:text-white
                      "
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <h3 className="text-[11px] font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-0.5 text-[9px] text-white/40">
                        {item.text}
                      </p>
                    </div>

                    <ArrowRight
                      className="
                        ml-auto
                        h-3 w-3
                        shrink-0
                        text-white/20
                        transition-all duration-300
                        group-hover:translate-x-1
                        group-hover:text-[#FF6B1A]
                      "
                    />
                  </div>
                );
              })}
            </div>

            {/* Small stats */}
            <div
              className="
                mt-5
                grid grid-cols-2
                gap-2
              "
            >
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xl font-black text-white">
                  500<span className="text-[#FF6B1A]">+</span>
                </p>

                <p className="text-[8px] uppercase tracking-wider text-white/40">
                  Cities
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <p className="text-xl font-black text-white">
                  99<span className="text-[#FF6B1A]">%</span>
                </p>

                <p className="text-[8px] uppercase tracking-wider text-white/40">
                  On-Time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ───────────────── STYLES ───────────────── */}
      <style>{`
        .map-dot {
          position: absolute;
          z-index: 20;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #FF6B1A;
          box-shadow: 0 0 0 3px rgba(255,107,26,0.12);
          animation: dotPulse 2.2s ease-in-out infinite;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(25px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes mapReveal {
          from {
            opacity: 0;
            transform: scale(0.88);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes dotPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 3px rgba(255,107,26,0.12);
          }

          50% {
            transform: scale(1.35);
            box-shadow: 0 0 0 7px rgba(255,107,26,0.03);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}