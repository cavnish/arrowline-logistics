import { useEffect, useState } from "react";
import ArrowlineLogo from "./ArrowlineLogo";

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("visible"), 50);
    const exitTimer = setTimeout(() => setPhase("exit"), 1400);
    const completeTimer = setTimeout(() => onComplete(), 1800);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#03212D]"
      role="progressbar"
      aria-label="Loading"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,26,0.08),transparent_70%)] pointer-events-none" />

      {/* Logo */}
      <div
        style={{
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "scale(0.92)" : "scale(1)",
          transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <ArrowlineLogo size="lg" inverted />
      </div>

      {/* Progress bar */}
      <div className="mt-10 w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] rounded-full"
          style={{
            width: phase === "enter" ? "0%" : "100%",
            transition: "width 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        />
      </div>

      {/* Reduced motion: skip animation */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [role="progressbar"] {
            transition-duration: 0.01ms !important;
          }
          [role="progressbar"] * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
