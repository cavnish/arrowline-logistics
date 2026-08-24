import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { COMPANY_DETAILS, CORE_SERVICES, REGIONAL_HUBS } from "../data/logisticsData";
import ArrowlineLogo from "./ArrowlineLogo";
import { buildMailto, buildTel } from "../utils/contactLinks";

interface FooterProps {
  setActivePage: (page: string) => void;
  openQuoteForm: () => void;
}

export default function Footer({ setActivePage, openQuoteForm }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("Please enter a valid email address."); return; }
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleServiceClick = (slug: string) => {
    setActivePage(`services/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-0 bg-[#03212D] text-slate-200 border-t border-white/10 overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,26,0.1)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Company Profile (Col Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-md">
              <ArrowlineLogo size="sm" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              {COMPANY_DETAILS.aboutShort}
            </p>

            <div className="flex items-center space-x-2 text-xs text-white bg-white/5 p-3 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#FF7A00] flex-shrink-0" />
              <span>Compliant with Indian Maritime, Customs, & NHAI regulations.</span>
            </div>
          </div>

          {/* Column 2: Core Services (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/15 pb-2.5 flex items-center justify-between">
              <span>Multimodal Services</span>
              <span className="text-[#FF7A00]">7 Verticals</span>
            </h3>
            <ul className="space-y-2 text-xs">
              {CORE_SERVICES.map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => handleServiceClick(srv.slug)}
                    className="text-slate-300 hover:text-[#FF7A00] transition-colors flex items-center space-x-1.5 focus:outline-none cursor-pointer"
                  >
                    <span className="text-[#FF7A00] font-bold">›</span>
                    <span>{srv.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Strategic Coverage Hubs (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/15 pb-2.5">
              Pan-India Hubs
            </h3>
            <ul className="space-y-2 text-xs">
              {REGIONAL_HUBS.slice(0, 6).map((hub) => (
                <li key={hub.id}>
                  <button
                    onClick={() => handleNavClick("home")}
                    className="text-slate-300 hover:text-[#00C2CB] transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
                    <span>{hub.name.split(" (")[0]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Dispatch Updates (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/15 pb-2.5">
              Inland Dispatch Alerts
            </h3>
            <p className="text-[11.5px] text-slate-300 leading-relaxed">
              Subscribe for weekly Mundra port vessel schedules, rail rake allocations, and logistics updates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter corporate email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-xs px-3.5 py-2.5 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6B1A] focus:bg-white/15 pr-10"
                  aria-label="Newsletter email"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#FF6B1A] hover:bg-[#FF7A00] rounded-lg text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {isSubscribed && (
                <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Subscribed successfully!</span>
                </div>
              )}
              {error && <span className="text-rose-400 text-[10px] block">{error}</span>}
            </form>

            <div className="pt-3 flex items-center justify-between border-t border-white/10">
              <button
                onClick={openQuoteForm}
                className="w-full py-2.5 bg-[#FF6B1A] hover:bg-[#FF7A00] text-white rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                REQUEST SHIPPING QUOTE
              </button>
            </div>
          </div>

        </div>

        {/* Address & Operational Contacts Bar */}
        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-[#FF7A00] flex-shrink-0 mt-0.5" />
            <div>
              <span className="block font-bold text-white mb-0.5">Gujarat Operations (Mundra Base):</span>
              <span className="block text-[11px] leading-relaxed text-slate-300">
                {COMPANY_DETAILS.headOffice}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="w-4 h-4 text-[#FF7A00] flex-shrink-0 mt-0.5" />
            <div>
              <span className="block font-bold text-white mb-0.5">Operational Dispatch Desk:</span>
              <a
                href={buildTel(COMPANY_DETAILS.phone)}
                className="block text-[11px] text-white hover:text-[#FF7A00] font-semibold"
                aria-label={`Call ${COMPANY_DETAILS.phone}`}
              >
                Phone: {COMPANY_DETAILS.phone}
              </a>
              <span className="block text-[10.5px] text-slate-400">Available 24/7 for live transits</span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="w-4 h-4 text-[#FF7A00] flex-shrink-0 mt-0.5" />
            <div>
              <span className="block font-bold text-white mb-0.5">Email Channels:</span>
              <a
                href={buildMailto({ to: COMPANY_DETAILS.primaryEmail, context: "general" })}
                className="block text-[11px] text-white hover:text-[#FF7A00]"
                aria-label={`Send email to ${COMPANY_DETAILS.primaryEmail}`}
              >
                Mundra: {COMPANY_DETAILS.primaryEmail}
              </a>
              <a
                href={buildMailto({ to: COMPANY_DETAILS.secondaryEmail, context: "general" })}
                className="block text-[11px] text-slate-300 hover:text-[#FF7A00]"
                aria-label={`Send email to ${COMPANY_DETAILS.secondaryEmail}`}
              >
                Planning: {COMPANY_DETAILS.secondaryEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400">
          <p className="text-center sm:text-left mb-2 sm:mb-0">
            © {currentYear} {COMPANY_DETAILS.name}. All Rights Reserved. Moving Cargo. Connecting India.
          </p>
          <div className="flex space-x-4 items-center">
            <span className="hover:text-white cursor-pointer">Sitemap</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Customs Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
