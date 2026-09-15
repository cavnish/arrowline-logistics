import { COMPANY_DETAILS } from "../data/logisticsData";
import ContactForm from "../components/ContactForm";
import SEOMeta from "../components/SEOMeta";
import { ContactChoiceMenu } from "../components/ContactLink";
import { buildMailto, buildTel } from "../utils/contactLinks";
import { Mail, Phone, MapPin, Anchor, Clock, ExternalLink, HelpCircle, AlertCircle } from "lucide-react";

interface ContactProps {
  onFormSuccess: (data: any) => void;
}

export default function Contact({ onFormSuccess }: ContactProps) {
  return (
    <div className="space-y-16">
      <SEOMeta
        title="Contact Us | Operations Desk Mundra Port Gujarat"
        description="Connect with Arrowline Logistics in Mundra, Kutch, Gujarat. Live logistics support, customs clearance agent (CHA), and direct FTL cargo dispatch hotlines."
      />

      <section className="space-y-4">
        <nav className="text-xs text-slate-500 font-semibold tracking-wide flex items-center space-x-1.5 uppercase">
          <span className="hover:text-[#1E3A8A] cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="text-[#1E3A8A]">Contact Us</span>
        </nav>
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] block">
            Direct Communication Channels
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1E3A8A] tracking-tight leading-tight">
            Connect with Our <span className="text-[#FF7A00]">Mundra Headquarters</span>
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Get instant shipping rates, status on active transits, or coordinate customs documentation with our dedicated planners. Available 24/7.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 -mr-4 -mt-4 w-12 h-12 bg-blue-100 rounded-full blur-xl" />
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-[#1E3A8A]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operations hotline</span>
                <a
                  href={buildTel(COMPANY_DETAILS.phone)}
                  className="block text-sm font-black text-[#1E3A8A] hover:text-[#FF7A00] transition-colors mt-0.5"
                  aria-label={`Call ${COMPANY_DETAILS.phone}`}
                >
                  {COMPANY_DETAILS.phone}
                </a>
                <span className="block text-[10px] text-emerald-600 mt-0.5">● Active 24/7</span>
                {/* Quick action pills — one-tap Email / Call / WhatsApp */}
                <ContactChoiceMenu context="quote" size="sm" className="mt-2" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 -mr-4 -mt-4 w-12 h-12 bg-[#FF7A00]/10 rounded-full blur-xl" />
              <div className="w-10 h-10 bg-[#FEF9F0] border border-[#FF7A00]/30 rounded-lg flex items-center justify-center text-[#FF7A00]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mundra Headquarters</span>
                <a
                  href={buildMailto({ to: COMPANY_DETAILS.primaryEmail, context: "quote" })}
                  className="block text-xs font-black text-[#1E3A8A] hover:text-[#FF7A00] transition-colors mt-0.5 truncate"
                  aria-label={`Send email to ${COMPANY_DETAILS.primaryEmail}`}
                >
                  {COMPANY_DETAILS.primaryEmail}
                </a>
                <a
                  href={buildMailto({ to: COMPANY_DETAILS.secondaryEmail, context: "general" })}
                  className="block text-[9.5px] text-slate-500 hover:text-[#FF7A00] transition-colors truncate mt-0.5"
                  aria-label={`Send email to ${COMPANY_DETAILS.secondaryEmail}`}
                >
                  Director: {COMPANY_DETAILS.secondaryEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-start space-x-3 shadow-sm">
            <Clock className="w-5 h-5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">Duty & Clearance Operations:</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Our CHA and port dispatchers operate inside Adani Mundra Port Yard on a <strong className="text-[#1E3A8A]">24/7 rotating schedule</strong>. Office: Mon-Sat 9:00 AM to 8:00 PM.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">Mundra Headquarters:</span>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {COMPANY_DETAILS.headOffice}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center space-x-1">
                <Anchor className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Next to Adani House Terminal</span>
              </span>
              <a href="https://maps.google.com/?q=Mundra+Port+Adani+House+Gujarat" target="_blank" rel="noopener noreferrer"
                 className="text-[#FF7A00] font-bold flex items-center space-x-0.5 hover:underline">
                <span>Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-2 overflow-hidden shadow-sm">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] p-2.5 flex items-center justify-between border-b border-slate-200">
              <span>Primary Operations Map</span>
              <span className="text-emerald-600">Centered on Mundra Port, Kutch</span>
            </div>
            <div className="relative aspect-[16/10] w-full bg-slate-100 rounded-xl overflow-hidden">
              <iframe
                title="Arrowline Logistics Mundra Port map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117565.4199175402!2d69.65824559194208!3d22.842858169994646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3950ea64fb6642ad%3A0x8dfca1170ea94348!2sMundra%20Port!5e0!3m2!1sen!2sin!4v1714569000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF7A00]/20 via-transparent to-[#1E3A8A]/20 rounded-3xl blur-2xl pointer-events-none" />
          <div className="relative">
            <ContactForm onSuccess={onFormSuccess} />
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-br from-[#FEF9F0] via-white to-[#FFF4DC] border-2 border-[#FF7A00]/20 rounded-2xl p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden shadow-sm">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#FF7A00]" />
            <span>Indian Shipping & Customs FAQs</span>
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <span className="block font-bold text-[#1E3A8A] leading-snug">What documents are needed to file a Bill of Entry at Mundra?</span>
              <p className="text-slate-600 leading-relaxed">
                Standard documents: Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, and specialized test reports if applicable.
              </p>
            </div>
            <div className="space-y-1">
              <span className="block font-bold text-[#1E3A8A] leading-snug">Do you handle port-to-port coastal loops for bulk commodities?</span>
              <p className="text-slate-600 leading-relaxed">
                Yes, our maritime division manages routine bulk shipments of steel, clay, gypsum connecting Gujarat, Maharashtra, Goa, and Tamil Nadu ports.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-[#FF7A00] tracking-widest flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Escalations & Special Moves</span>
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              For high-volume portfolios or over-dimensional hydraulic trailers (ODC moves), connect directly with director operations:
            </p>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Phone:</span>
              <a
                href={buildTel(COMPANY_DETAILS.phone)}
                className="text-[#1E3A8A] font-bold hover:text-[#FF7A00] transition-colors"
                aria-label={`Call ${COMPANY_DETAILS.phone}`}
              >
                {COMPANY_DETAILS.phone}
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Director Email:</span>
              <a
                href={buildMailto({ to: COMPANY_DETAILS.secondaryEmail, context: "project" })}
                className="text-[#1E3A8A] text-[11px] font-bold hover:text-[#FF7A00] transition-colors"
                aria-label={`Send email to ${COMPANY_DETAILS.secondaryEmail}`}
              >
                {COMPANY_DETAILS.secondaryEmail}
              </a>
            </div>
          </div>
          {/* Bottom quick-action menu: Email · Call · WhatsApp */}
          <div className="pt-3 border-t border-slate-200">
            <ContactChoiceMenu
              email={COMPANY_DETAILS.secondaryEmail}
              context="project"
              size="sm"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
