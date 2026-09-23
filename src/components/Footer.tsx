import type { MouseEvent } from "react";
import { Phone, MapPin, Mail, ShieldCheck } from "lucide-react";
import { COMPANY_DETAILS, REGIONAL_HUBS } from "../data/logisticsData";
import { getAllMainServices, getAllSubServices } from "../data/servicesData";
import ArrowlineLogo from "./ArrowlineLogo";
import Reveal from "./Reveal";
import { buildMailto, buildTel } from "../utils/contactLinks";
import { pageIdToPath } from "../utils/navigation";
import { useSiteContent } from "../hooks/useSiteContent";

export default function Footer({ setActivePage }: { setActivePage: (page: string) => void }) {
  const currentYear = new Date().getFullYear();
  const mainServices = getAllMainServices();
  const allSubs = getAllSubServices();
  const content = useSiteContent();
  const headOffice = content("contact_address", COMPANY_DETAILS.headOffice);
  const phone = content("contact_phone", COMPANY_DETAILS.phone);
  const primaryEmail = content("contact_email", COMPANY_DETAILS.primaryEmail);

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* SPA-safe anchor navigation: keeps pushState routing but gives crawlers a
     real href, the SPA fallback serves index.html for direct hits, and
     modifier/right-clicks still open default browser behaviour. */
  const handleSPANav = (e: MouseEvent<HTMLAnchorElement>, pageId: string) => {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    handleNavClick(pageId);
  };

  const col1 = mainServices.slice(0, 2);
  const col2 = mainServices.slice(2);

  return (
    <footer className="bg-[#03212D] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Reveal duration={600}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">

          {/* Company Info */}
          <div className="lg:col-span-4 space-y-4">
            <ArrowlineLogo size="sm" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {COMPANY_DETAILS.aboutShort}
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-white bg-white/5 p-2.5 rounded-lg border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0" />
              <span>Compliant with Indian Maritime, Customs, & NHAI regulations.</span>
            </div>
          </div>

          {/* Services - Two Columns */}
          <div className="lg:col-span-5">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/15 pb-2 mb-3 flex items-center justify-between">
              <span>Multimodal Services</span>
              <span className="text-[#FF7A00]">{allSubs.length} Services</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {[col1, col2].map((col, ci) => (
                <ul key={ci} className="space-y-1.5">
                  {col.map((srv) => (
                    <li key={srv.id}>
                      <a
                        href={pageIdToPath(`services/${srv.slug}`)}
                        onClick={(e) => handleSPANav(e, `services/${srv.slug}`)}
                        className="text-slate-100 hover:text-[#FF7A00] transition-colors flex items-center space-x-1 cursor-pointer font-bold text-xs"
                      >
                        <span className="text-[#FF7A00] font-bold">›</span>
                        <span>{srv.title}</span>
                      </a>
                      <ul className="ml-4 mt-1 space-y-0.5">
                        {(srv.subServices || []).map((sub) => (
                          <li key={sub.id}>
                            <a
                              href={pageIdToPath(`services/${srv.slug}/${sub.slug}`)}
                              onClick={(e) => handleSPANav(e, `services/${srv.slug}/${sub.slug}`)}
                              className="block w-full text-left text-[11px] text-slate-400 hover:text-[#FF7A00] transition-colors cursor-pointer"
                            >
                              {sub.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* Hubs & Contact */}
          <div className="lg:col-span-3 space-y-5">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-white/15 pb-2 mb-3">
                Pan-India Hubs
              </h3>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {REGIONAL_HUBS.map((hub) => (
                  <li key={hub.id}>
                    <a
                      href={pageIdToPath("home")}
                      onClick={(e) => handleSPANav(e, "home")}
                      className="text-[11px] text-slate-400 hover:text-[#00C2CB] transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] flex-shrink-0" />
                      <span className="truncate">{hub.name.split(" (")[0]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-relaxed">{headOffice}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0" />
                <a href={buildTel(phone)} className="text-white hover:text-[#FF7A00] font-semibold">
                  {phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0" />
                <a href={buildMailto({ to: primaryEmail })} className="text-slate-400 hover:text-[#FF7A00]">
                  {primaryEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500">
          <p className="text-center sm:text-left mb-2 sm:mb-0">
            © {currentYear} {COMPANY_DETAILS.name}. All Rights Reserved. Moving Cargo. Connecting India.
          </p>
          <div className="flex space-x-3 items-center">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Sitemap</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Customs Guidelines</span>
          </div>
        </div>
        </Reveal>
      </div>
    </footer>
  );
}
