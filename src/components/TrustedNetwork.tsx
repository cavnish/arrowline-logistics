import { useEffect, useState } from "react";
import axios from "axios";

interface Partner {
  id: string;
  logo: string;
  logo_alt?: string;
}

export default function TrustedNetwork() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPartners = async () => {
      const apiUrl = ((import.meta as any).env?.VITE_API_URL || "").trim().replace(/\/$/, "");
      try {
        const response = await axios.get(`${apiUrl}/api/trusted-network`);
        if (response.data.success) {
          setPartners(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching trusted network:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading) return null;
  if (partners.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 no-scrollbar items-center justify-center sm:justify-start">
          {partners.map((partner) => (
            <div key={partner.id} className="shrink-0">
              <img
                src={partner.logo}
                alt={partner.logo_alt || "Client logo"}
                loading="lazy"
                decoding="async"
                className="h-10 sm:h-12 w-auto max-w-[100px] sm:max-w-[140px] object-contain opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
