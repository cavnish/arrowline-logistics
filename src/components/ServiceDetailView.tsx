import { ServiceDetail, COMPANY_DETAILS } from "../data/logisticsData";
import SEOMeta from "./SEOMeta";
import { buildMailto, buildTel } from "../utils/contactLinks";
import { Check, ShieldCheck, ArrowRight, HelpCircle, Phone, Mail, Award } from "lucide-react";
import { useState } from "react";

interface ServiceDetailViewProps {
  service: ServiceDetail;
  onOpenQuote: () => void;
}

export default function ServiceDetailView({ service, onOpenQuote }: ServiceDetailViewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const getFaqsByService = (slug: string) => {
    if (slug.includes("road")) {
      return [
        { q: "Do you offer FTL services from Mundra Port to South & North India?", a: "Yes, we specialize in high-capacity FTL container and trailer transport operating directly from Adani Mundra Port, Gujarat, to Delhi NCR, Rajasthan, Karnataka, Tamil Nadu, Andhra Pradesh, and Kerala. Our GPS fleet is active on all major expressways." },
        { q: "How are drivers vetted and monitored?", a: "All drivers undergo background screening, license validation, and safety audits. Trucks are monitored 24/7 by our GPS control room, enforcing strict safety protocols." },
        { q: "Can you handle 20-ft and 40-ft high-cube containers?", a: "Absolutely. We maintain multi-axle skeletal chassis, lowbeds, and standard flatbeds ideal for both 20-ft and 40-ft container transits." }
      ];
    } else if (slug.includes("coastal")) {
      return [
        { q: "Is coastal shipping cost-effective for West-to-South logistics?", a: "Yes, coastal shipping is up to 35-40% cheaper than long-haul highway road transport for bulk or heavy containerized goods traveling from Mundra or Pipavav to Cochin, Chennai, or Tuticorin ports." },
        { q: "What is the average transit time?", a: "Standard vessel loops from Mundra Port to Chennai/Cochin average 7 to 9 days, synchronized with localized first-and-last mile road dispatch." }
      ];
    } else if (slug.includes("rail")) {
      return [
        { q: "Do you integrate directly with CONCOR and Indian Railways?", a: "Yes, we operate in tight coordination with CONCOR and private container train operators, routing dedicated freight rakes to inland dry-ports in Jaipur, Indore, Delhi NCR, and Ludhiana." },
        { q: "Is rail transport insulated from highway congestion?", a: "Yes, dedicated freight rail corridors bypass highway tolls, road construction, and fuel price volatility." }
      ];
    } else if (slug.includes("project")) {
      return [
        { q: "Do you execute physical route surveys for ODC?", a: "Yes, our engineering team performs detailed on-route surveys, mapping bridges, toll plazas, overhead power lines, and bypass turning radii before any heavy puller leaves the port yard." },
        { q: "Are state permits and utility wire escorts managed by Arrowline?", a: "We manage all administrative compliance, obtaining NHAI clearances, police escort permissions, and coordinating local electricity boards to lift cables during high-clearance moves." }
      ];
    } else if (slug.includes("customs")) {
      return [
        { q: "Are you experienced with Mundra Port customs clearance?", a: "Yes, our customs brokerage team coordinates directly inside Adani Mundra Port, Kandla, and CFS yards with swift ICEGATE filings." },
        { q: "How fast can you clear standard import containers?", a: "With pre-verified documents, our target clearance timeline is within 24 to 48 hours of vessel docking, avoiding expensive port demurrage." }
      ];
    }
    return [
      { q: "How can I obtain a customized logistics tariff quote?", a: "Simply click 'Get a Free Quote' or contact our Mundra operations base. Our planners compile a tailored rate sheet within 2 hours." },
      { q: "Are cargo insurance solutions available?", a: "Yes, we coordinate with leading underwriters to ensure complete transit insurance matching the commercial value of your freight." }
    ];
  };

  const faqs = getFaqsByService(service.slug);

  return (
    <div className="space-y-12">
      <SEOMeta title={service.seoTitle} description={service.seoDesc} />

      <nav className="text-xs text-slate-500 font-semibold tracking-wide flex items-center space-x-1.5 uppercase">
        <a href="#/" className="hover:text-[#062B3A] transition-colors">Home</a>
        <span>/</span>
        <a href="#/services" className="hover:text-[#062B3A] transition-colors">Services</a>
        <span>/</span>
        <span className="text-[#FF6B1A] font-bold">{service.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left main content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="aspect-[16/9] w-full relative bg-slate-900">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062B3A] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 bg-[#FF6B1A] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                  {service.category}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">{service.title}</h1>
                <p className="text-xs sm:text-sm text-slate-200">{service.keyCapability}</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#062B3A] uppercase tracking-wide">
                  Service Overview & Scope
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.longDesc}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#062B3A] uppercase tracking-wide">
                  Key Operational Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-start space-x-2.5 bg-[#F5F8FA] p-3 rounded-xl border border-slate-200">
                      <Check className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#062B3A] uppercase tracking-wide">
                  Commercial & Strategic Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.benefits.map((ben, i) => (
                    <div key={i} className="flex items-start space-x-2.5 bg-[#EAF3F6] p-3 rounded-xl border border-[#062B3A]/10">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Service Specific FAQs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 text-sm font-bold text-[#062B3A] uppercase tracking-wide">
              <HelpCircle className="w-4 h-4 text-[#FF6B1A]" />
              <span>Frequently Asked Questions about {service.title}</span>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#062B3A] flex justify-between items-center hover:bg-[#F5F8FA] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#FF6B1A] font-black">{activeFaq === idx ? "−" : "+"}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Card */}
          <div className="bg-gradient-to-br from-[#062B3A] to-[#03212D] text-white p-6 rounded-3xl space-y-5 shadow-xl border border-white/15">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-[#FF7A00] tracking-wider">
                Direct Booking
              </span>
              <h3 className="text-xl font-black">Request a Rate Quote</h3>
              <p className="text-xs text-slate-300">
                Get competitive freight rates for {service.title.toLowerCase()} from our Mundra clearance team.
              </p>
            </div>

            <button
              onClick={onOpenQuote}
              className="w-full py-3.5 bg-[#FF6B1A] hover:bg-[#FF7A00] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>GET INSTANT QUOTE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-white/15 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#FF7A00]" />
                <a href={buildTel(COMPANY_DETAILS.phone)} className="hover:text-[#FF7A00]">
                  {COMPANY_DETAILS.phone} (Mundra Base)
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#FF7A00]" />
                <a href={buildMailto({ to: COMPANY_DETAILS.primaryEmail, context: "general" })} className="hover:text-[#FF7A00]">
                  {COMPANY_DETAILS.primaryEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Mundra Assurance Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#062B3A] uppercase tracking-wide">
              <Award className="w-4 h-4 text-[#FF6B1A]" />
              <span>Mundra Port Gateway Assurance</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operating on-site at Adani Mundra Port gives Arrowline dedicated access to container yards, rail freight terminals, and customs brokerage infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
