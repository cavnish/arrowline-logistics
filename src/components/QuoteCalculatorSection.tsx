import { useState } from "react";
import { CLIENT_TESTIMONIALS } from "../data/logisticsData";
import { Star, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Check } from "lucide-react";

interface QuoteCalculatorSectionProps {
  onOpenLeadModal: (leadData: any) => void;
}

export default function QuoteCalculatorSection({ onOpenLeadModal }: QuoteCalculatorSectionProps) {
  // Calculator state
  const [origin, setOrigin] = useState("Mundra Port, Gujarat");
  const [destination, setDestination] = useState("Delhi NCR");
  const [weightTons, setWeightTons] = useState(18);
  const [serviceType, setServiceType] = useState("Road Transportation (FTL)");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Testimonial state
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const activeTestimonial = CLIENT_TESTIMONIALS[testimonialIndex];

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % CLIENT_TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + CLIENT_TESTIMONIALS.length) % CLIENT_TESTIMONIALS.length);
  };

  const handleCalculateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const mockLead = {
      name: "Quote Requestor",
      email: phoneOrEmail.includes("@") ? phoneOrEmail : "inquiry@client.com",
      phone: phoneOrEmail.includes("@") ? "+91 9021179108" : phoneOrEmail || "+91 9021179108",
      service: serviceType,
      origin,
      destination,
      weightTons,
      cargoType: "Containerized Commercial Freight",
      status: "Verified Request",
      createdAt: new Date().toISOString()
    };
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onOpenLeadModal(mockLead);
    }, 600);
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F0F5FA] text-[#062B3A] border-y border-slate-200/90 relative overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* 2-Column Split: Calculator on Left + Testimonials on Right (Matching Reference Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Quick Quote Calculator Box */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#FF6B1A] via-[#FF7A00] to-[#FF8C2A] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl text-white">
            <div className="space-y-2 mb-6">
              <span className="text-[10.5px] font-black uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full inline-block">
                Instant Freight Tariff Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                Request A Quick Quote
              </h2>
              <p className="text-xs text-white/90">
                Get estimated transit times and custom tariff calculation from our Mundra clearance desk.
              </p>
            </div>

            <form onSubmit={handleCalculateQuote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-white/90">
                    Pickup Location
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-white text-[#062B3A] text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/30 shadow-inner"
                  >
                    <option value="Mundra Port, Gujarat">Mundra Port, Gujarat</option>
                    <option value="Ahmedabad, Gujarat">Ahmedabad, Gujarat</option>
                    <option value="Mumbai / JNPT">Mumbai / JNPT</option>
                    <option value="Kandla Port, Gujarat">Kandla Port, Gujarat</option>
                    <option value="Pipavav Port, Gujarat">Pipavav Port, Gujarat</option>
                    <option value="Surat / Hazira">Surat / Hazira</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-white/90">
                    Delivery Location
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-white text-[#062B3A] text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/30 shadow-inner"
                  >
                    <option value="Delhi NCR (Gurugram / Noida)">Delhi NCR</option>
                    <option value="Jaipur, Rajasthan">Jaipur, Rajasthan</option>
                    <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
                    <option value="Chennai, Tamil Nadu">Chennai, Tamil Nadu</option>
                    <option value="Hyderabad, Telangana">Hyderabad, Telangana</option>
                    <option value="Indore, Madhya Pradesh">Indore, Madhya Pradesh</option>
                    <option value="Kolkata, West Bengal">Kolkata, West Bengal</option>
                    <option value="Ludhiana, Punjab">Ludhiana, Punjab</option>
                  </select>
                </div>
              </div>

              {/* Slider for Cargo Weight */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Approximate Cargo Weight:</span>
                  <span className="bg-black/20 px-2 py-0.5 rounded text-[11px]">{weightTons} Metric Tons</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={120}
                  value={weightTons}
                  onChange={(e) => setWeightTons(Number(e.target.value))}
                  className="w-full h-2 bg-white/40 rounded-lg appearance-none cursor-pointer accent-[#062B3A]"
                />
                <div className="flex justify-between text-[10px] text-white/75 mt-0.5">
                  <span>1 Ton (Express)</span>
                  <span>40T (Heavy FTL)</span>
                  <span>120T (ODC Heavy Lift)</span>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-white/90">
                  Logistics Service
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-white text-[#062B3A] text-xs font-semibold px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/30"
                >
                  <option value="Road Transportation (FTL)">Road Transportation (FTL Container / Flatbed)</option>
                  <option value="Shipping & Coastal Services">Shipping & Coastal Services</option>
                  <option value="Rail & Multimodal Freight">Rail & Multimodal Logistics (CONCOR)</option>
                  <option value="Project Logistics & ODC">Project Logistics & ODC Heavy Transport</option>
                  <option value="Global Freight Forwarding">Global Freight Forwarding</option>
                  <option value="Express Air Cargo">Express Air Cargo</option>
                  <option value="Customs Clearance">Customs Clearance & Brokerage</option>
                </select>
              </div>

              {/* Contact input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-white/90">
                  Your Phone Number or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter contact number or corporate email"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full bg-white text-[#062B3A] placeholder:text-slate-400 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/30 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xl transition-all hover:-translate-y-0.5 active:scale-98 flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>CALCULATING RATE...</span>
                  </>
                ) : (
                  <>
                    <span>GET INSTANT ESTIMATE</span>
                    <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: What Our Clients Say (Clean White Card) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-[#062B3A]/15 rounded-full text-[10px] font-black text-[#FF6B1A] tracking-widest uppercase shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CLIENT VERIFIED EXPERIENCE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-[#062B3A]">
                What Our Clients Say <br />
                <span className="text-[#FF6B1A]">About Our Service</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Trusted by manufacturing corporations, renewable developers, and export-import houses for on-time delivery from Mundra Port across India.
              </p>
            </div>

            {/* Testimonial Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl relative">
              {/* Star Rating */}
              <div className="flex items-center space-x-1 text-[#FF6B1A]">
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-[#062B3A] ml-2">5.0 SLA Rating</span>
              </div>

              {/* Quote Text */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
                "{activeTestimonial.comment}"
              </p>

              {/* Client Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.clientName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B1A]"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#062B3A]">{activeTestimonial.clientName}</h3>
                    <span className="block text-[11px] text-[#FF6B1A] font-semibold">{activeTestimonial.role}, {activeTestimonial.company}</span>
                    <span className="block text-[10px] text-slate-500">{activeTestimonial.location}</span>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevTestimonial}
                    className="w-8 h-8 rounded-full bg-[#F5F8FA] border border-slate-200 hover:bg-[#EAF3F6] flex items-center justify-center text-[#062B3A] transition-colors cursor-pointer"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextTestimonial}
                    className="w-8 h-8 rounded-full bg-[#062B3A] hover:bg-[#03212D] flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
