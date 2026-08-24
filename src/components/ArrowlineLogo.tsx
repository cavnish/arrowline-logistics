import { cn } from "../utils/cn";

interface ArrowlineLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  inverted?: boolean;
}

/**
 * Official Arrowline Logistics logo — navy "ARROWLINE" wordmark with an
 * orange arrow accent, dashed "LOGISTICS" subline and tagline.
 */
export default function ArrowlineLogo({
  size = "md",
  showTagline = false,
  className,
  inverted = false,
}: ArrowlineLogoProps) {
  const sizeMap = {
    sm: { wordmark: "text-lg", sub: "text-[8px]", tag: "text-[9px]", arrow: "h-5 w-6" },
    md: { wordmark: "text-2xl", sub: "text-[10px]", tag: "text-xs", arrow: "h-7 w-8" },
    lg: { wordmark: "text-4xl", sub: "text-xs", tag: "text-sm", arrow: "h-10 w-12" },
  };

  const s = sizeMap[size];
  const navy = inverted ? "text-white" : "text-[#1E3A8A]";
  const dashColor = inverted ? "bg-white/60" : "bg-[#1E3A8A]";
  const tagColor = inverted ? "text-white/80" : "text-[#1E3A8A]/80";

  return (
    <div className={cn("inline-flex flex-col items-start leading-none", className)}>
      {/* Main wordmark + orange arrow */}
      <div className="flex items-center gap-1.5">
        <span className={cn("font-black tracking-tight font-sans", s.wordmark, navy)}>
          ARROWLINE
        </span>
        <svg
          className={cn(s.arrow, "flex-shrink-0")}
          viewBox="0 0 40 32"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 2 4 L 26 4 L 38 16 L 26 28 L 2 28 L 14 16 Z"
            fill="#FF7A00"
          />
        </svg>
      </div>

      {/* LOGISTICS sub-label with dash flanks */}
      <div className="flex items-center gap-1.5 mt-1">
        <div className={cn("h-[1.5px] w-4 rounded", dashColor)} />
        <span className={cn("font-bold tracking-[0.35em]", s.sub, navy)}>
          LOGISTICS
        </span>
        <div className={cn("h-[1.5px] w-4 rounded", dashColor)} />
      </div>

      {/* Optional tagline */}
      {showTagline && (
        <span className={cn("italic mt-1.5 font-medium", s.tag, tagColor)}>
          Moving Possibilities. Delivering Trust.
        </span>
      )}
    </div>
  );
}
