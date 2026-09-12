import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Reveal from "./Reveal";
import axios from "axios";

interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
  is_featured: boolean;
  is_published: boolean;
}

export default function TrustedNetwork() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/trusted-network`);
        if (response.data.success) {
          setPartners(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading) return null;
  if (partners.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6B1A] mb-3">OUR TRUSTED NETWORK</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#062B3A] tracking-tight">Trusted by Industry Leaders</h2>
          </div>
        </Reveal>

        <div className="relative">
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
            {partners.map((partner, i) => (
              <Reveal key={partner.id} delay={i * 50}>
                <div className="snap-center shrink-0 w-[280px] group p-6 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-[#FF6B1A]/30 transition-all">
                  <div className="flex flex-col h-full">
                    <div className="h-20 w-full flex items-center justify-center mb-6 grayscale group-hover:grayscale-0 transition-all">
                      <img 
                        src={partner.logo} 
                        alt={`${partner.name} logo`} 
                        className="max-h-full max-w-[150px] object-contain"
                      />
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-lg font-bold text-[#062B3A] mb-1">{partner.name}</h3>
                      <p className="text-xs text-slate-500 mb-4">{partner.category}</p>
                      {partner.is_featured && (
                        <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-blue-50 border border-blue-100 w-fit">
                          <Check className="h-3 w-3 text-blue-600" />
                          <span className="text-[10px] font-black text-blue-600 uppercase">Registered Partner</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
