import { COMPANY_DETAILS } from "../data/logisticsData";
import ContactForm from "../components/ContactForm";
import SEOMeta from "../components/SEOMeta";
import Reveal from "../components/Reveal";
import { ContactChoiceMenu } from "../components/ContactLink";
import { buildMailto, buildTel } from "../utils/contactLinks";
import { useSiteContent } from "../hooks/useSiteContent";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";

interface ContactProps {
  onFormSuccess: (data: any) => void;
}

export default function Contact({ onFormSuccess }: ContactProps) {
  const content = useSiteContent();
  const headOffice = content("contact_address", COMPANY_DETAILS.headOffice);
  const phone = content("contact_phone", COMPANY_DETAILS.phone);
  const primaryEmail = content("contact_email", COMPANY_DETAILS.primaryEmail);
  const secondaryEmail = content("contact_secondary_email", COMPANY_DETAILS.secondaryEmail);
  const whatsapp = content("contact_whatsapp", COMPANY_DETAILS.whatsapp);

  return (
    <div className="space-y-16">
      <SEOMeta
        title="Contact Us | Mundra Port Logistics Desk & Pan-India Offices | Arrowline"
        description="Contact Arrowline Logistics headquarters at Mundra Port, Kutch, Gujarat. 24/7 dispatch desk for container transport, FTL freight quotes, and pan-India route coordination."
        keywords="Contact Arrowline Logistics, Logistics Office Mundra, Mundra Port Transport Contact, Logistics Quote India, Freight Forwarder Mundra Kutch"
        canonicalUrl="https://arrowlinelogistics.in/contact"
      />

      <section className="space-y-4">
        <nav className="text-xs text-slate-500 font-semibold tracking-wide flex items-center space-x-1.5 uppercase">
          <span className="hover:text-[#1E3A8A] cursor-pointer transition-colors">Home</span>
          <span>/</span>
          <span className="text-[#1E3A8A]">Contact Us</span>
        </nav>
        <Reveal className="space-y-2 max-w-3xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] block">
            Direct Communication Channels
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1E3A8A] tracking-tight leading-tight">
            Connect with Our <span className="text-[#FF7A00]">Mundra Headquarters</span>
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Get instant shipping rates, status on active transits, or coordinate customs documentation with our dedicated planners. Available 24/7.
          </p>
        </Reveal>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <Reveal direction="left" className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute right-0 top-0 -mr-4 -mt-4 w-12 h-12 bg-blue-100 rounded-full blur-xl" />
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center text-[#1E3A8A]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operations hotline</span>
                <a
                  href={buildTel(phone)}
                  className="block text-sm font-black text-[#1E3A8A] hover:text-[#FF7A00] transition-colors mt-0.5"
                  aria-label={`Call ${phone}`}
                >
                  {phone}
                </a>
                <span className="block text-[10px] text-emerald-600 mt-0.5">● Active 24/7</span>
                {/* Quick action pills — one-tap Email / Call / WhatsApp */}
                <ContactChoiceMenu context="quote" size="sm" className="mt-2" email={primaryEmail} phone={phone} whatsapp={whatsapp} />
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
                  href={buildMailto({ to: primaryEmail, context: "quote" })}
                  className="block text-xs font-black text-[#1E3A8A] hover:text-[#FF7A00] transition-colors mt-0.5 truncate"
                  aria-label={`Send email to ${primaryEmail}`}
                >
                  {primaryEmail}
                </a>
                <a
                  href={buildMailto({ to: secondaryEmail, context: "general" })}
                  className="block text-[9.5px] text-slate-500 hover:text-[#FF7A00] transition-colors truncate mt-0.5"
                  aria-label={`Send email to ${secondaryEmail}`}
                >
                  Director: {secondaryEmail}
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
                  {headOffice}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-end text-[10px] text-slate-500">
              <a href={`https://maps.google.com/?q=${encodeURIComponent(headOffice)}`} target="_blank" rel="noopener noreferrer"
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
        </Reveal>

        <Reveal direction="right" className="lg:col-span-6 relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF7A00]/20 via-transparent to-[#1E3A8A]/20 rounded-3xl blur-2xl pointer-events-none" />
          <div className="relative">
            <ContactForm onSuccess={onFormSuccess} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
