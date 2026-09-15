import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "../utils/imageUrl";

interface TrustedPartner {
  id: string;
  name: string;
  logo: string | null;
  logo_alt: string | null;
}

const API_URL = String((import.meta as any).env?.VITE_API_URL || "").trim().replace(/\/$/, "");

async function fetchTrustedNetwork(): Promise<TrustedPartner[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}/api/trusted-network`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }
    const body = await response.json();
    return Array.isArray(body?.data) ? (body.data as TrustedPartner[]) : [];
  } catch (error) {
    console.error("Trusted network fetch error:", error);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function PartnerCard({ partner }: { partner: TrustedPartner }) {
  const [imageError, setImageError] = useState(false);
  const alt = partner.logo_alt || `${partner.name} logo`;

  if (!partner.logo || imageError) {
    return null;
  }

  return (
    <div
      className="flex h-14 w-[120px] shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-2.5 transition-colors duration-200 hover:bg-slate-50 sm:h-16 sm:w-[140px]"
      aria-label={`${partner.name} logo`}
    >
      <img
        src={getOptimizedImageUrl(partner.logo, { width: 240 })}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setImageError(true)}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}

function SkeletonTile() {
  return (
    <div className="h-14 w-[120px] shrink-0 animate-pulse rounded-lg border border-slate-200 bg-slate-100 sm:h-16 sm:w-[140px]" />
  );
}

export default function TrustStrip() {
  const [partners, setPartners] = useState<TrustedPartner[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchTrustedNetwork().then((data) => {
      if (mounted) setPartners(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const loaded = partners !== null;
  const list = (partners ?? []).filter((partner) => Boolean(partner.logo));

  if (loaded && list.length === 0) {
    return null;
  }

  const skeletonCount = 8;
  const marqueeItems = loaded ? [...list, ...list] : [];

  return (
    <section
      className="overflow-hidden border-y border-slate-200 bg-white py-7 sm:py-9"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF6B1A]">
            Our Trusted Network
          </p>

          <h2
            id="trust-heading"
            className="mt-1 text-lg font-bold tracking-tight text-[#1E3A8A] sm:text-xl"
          >
            Trusted by Industry Leaders
          </h2>
        </div>
      </div>

      {/* Logo Slider */}
      <div
        className="relative mt-6 overflow-hidden"
        aria-label="Trusted clients and logistics partners"
      >
        {/* Fade Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />

        {!loaded ? (
          <div className="flex w-max gap-3 px-3 sm:gap-4">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonTile key={index} />
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max gap-3 px-3 sm:gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 35,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {marqueeItems.map((partner, index) => (
              <PartnerCard key={`${partner.id}-${index}`} partner={partner} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}