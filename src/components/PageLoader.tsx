import { useEffect, useState } from "react";
import ArrowlineLogo from "./ArrowlineLogo";

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("visible"), 50);
    const exitTimer = setTimeout(() => setPhase("exit"), 750);
    const completeTimer = setTimeout(() => onComplete(), 900);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const visible = phase !== "enter";

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      role="progressbar"
      aria-label="Loading"
      style={{
        backgroundColor: "#03212D",
        backgroundImage:
          "radial-gradient(ellipse 90% 70% at 50% 42%, #06303D 0%, #03212D 55%, #021722 100%)",
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Soft ambient glow behind the logo — very subtle navy/white/orange */}
      <div
        className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at center, rgba(255,255,255,0.05) 0%, rgba(255,107,26,0.06) 35%, rgba(14,90,110,0.08) 60%, rgba(255,255,255,0) 75%)",
        }}
      />

      {/* ── CENTER COMPOSITION ─────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.96)",
          transition:
            "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Logo — strongest focal point */}
        <ArrowlineLogo size="lg" inverted />

        {/* Tagline */}
        <p
          className="mt-5 text-[10px] sm:text-xs tracking-[0.32em] uppercase text-white/35 font-medium"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(5px)",
            letterSpacing: visible ? "0.32em" : "0.2em",
            transition:
              "opacity 0.5s ease-out 0.25s, transform 0.5s ease-out 0.25s, letter-spacing 0.6s ease-out 0.25s",
          }}
        >
          Moving Businesses Forward
        </p>

        {/* Premium orange progress bar with subtle glowing fill */}
        <div className="relative mt-8 w-40 sm:w-44 h-[2px]">
          {/* track */}
          <div className="absolute inset-0 rounded-full bg-white/10" />
          {/* fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full overflow-hidden bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A]"
            style={{
              width: visible ? "100%" : "0%",
              transition: "width 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s",
              boxShadow: "0 0 12px rgba(255,107,26,0.45)",
            }}
          >
            {/* Moving light highlight on the active portion */}
            <div
              className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              style={{
                animation: visible ? "progressBarLight 1.4s ease-in-out infinite" : "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Reduced motion: skip all animation */}
      <style>{`
        @keyframes progressBarLight {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="progressbar"] {
            transition-duration: 0.01ms !important;
          }
          [role="progressbar"] * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
          [role="progressbar"] [style*="transition"],
          [role="progressbar"] div[style*="transition"] {
            transition-delay: 0ms !important;
          }
        }
      `}</style>
    </div>
  );
}