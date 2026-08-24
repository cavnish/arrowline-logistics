import { Anchor, ArrowRight, MapPin } from "lucide-react";

interface MundraPortSectionProps {
  onOpenQuote: () => void;
}

export default function MundraPortSection({ onOpenQuote }: MundraPortSectionProps) {
  const regions = [
    {
      region: "Western India",
      states: "Gujarat, Maharashtra, Goa",
      corridors: "Mundra → Ahmedabad → Mumbai → Pune",
      leadTime: "12 - 24 Hours"
    },
    {
      region: "Northern India",
      states: "Delhi NCR, Rajasthan, Haryana, Punjab, UP",
      corridors: "Mundra → Jaipur → Delhi NCR → Ludhiana",
      leadTime: "24 - 48 Hours"
    },
    {
      region: "Central India",
      states: "Madhya Pradesh, Chhattisgarh",
      corridors: "Mundra → Indore → Bhopal → Raipur",
      leadTime: "36 - 60 Hours"
    },
    {
      region: "Southern India",
      states: "Karnataka, Tamil Nadu, Telangana, Andhra, Kerala",
      corridors: "Mundra → Bengaluru → Chennai → Hyderabad",
      leadTime: "48 - 72 Hours (Multimodal / Road)"
    },
    {
      region: "Eastern India",
      states: "West Bengal, Odisha, Jharkhand, Bihar",
      corridors: "Mundra → Kolkata → Jamshedpur → Patna",
      leadTime: "60 - 84 Hours (Dedicated Rail / Highway)"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#EAF2F6] text-[#062B3A] border-y border-slate-200/90 relative overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#062B3A]/15 rounded-full text-[10px] font-black text-[#FF6B1A] tracking-widest uppercase shadow-sm">
            <Anchor className="w-3.5 h-3.5" />
            <span>MUNDRA PORT LOGISTICS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#062B3A]">
            From Mundra Port to <br />
            <span className="text-[#FF6B1A]">Destinations Across India</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Operating on-site at India’s premier maritime gateway—Mundra Port, Gujarat—Arrowline Logistics coordinates end-to-end container movement, customs brokerage, and multimodal inland dispatch to major manufacturing and consumer hubs across all zones of India.
          </p>
        </div>

        {/* Regional Connectivity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regions.map((reg, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 hover:border-[#FF6B1A]/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#FF6B1A]" />
                  <h3 className="text-base font-bold text-[#062B3A] group-hover:text-[#FF6B1A] transition-colors">
                    {reg.region}
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase text-[#062B3A] bg-[#EAF3F6] px-2.5 py-1 rounded-full border border-slate-200">
                  {reg.leadTime}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">States Covered:</span>
                  <span className="text-slate-700 font-medium">{reg.states}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Key Corridors:</span>
                  <span className="text-[#062B3A] font-bold">{reg.corridors}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Dispatch CTA Card */}
          <div className="bg-gradient-to-br from-[#FF6B1A] to-[#FF8C2A] rounded-2xl p-6 flex flex-col justify-between text-white shadow-2xl">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/15 px-2.5 py-1 rounded-full inline-block">
                Express Route Coordination
              </span>
              <h3 className="text-xl font-black leading-snug">
                Need Fast Clearance & Trucking from Mundra?
              </h3>
              <p className="text-xs text-white/90 leading-relaxed">
                Connect directly with our Mundra port dispatch office for tariff quotations and available trailer rakes.
              </p>
            </div>

            <button
              onClick={onOpenQuote}
              className="mt-4 w-full py-3 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <span>REQUEST ROUTE QUOTE</span>
              <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
