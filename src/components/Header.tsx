import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, ChevronDown, Globe, Anchor } from "lucide-react";
import { COMPANY_DETAILS, CORE_SERVICES } from "../data/logisticsData";
import ArrowlineLogo from "./ArrowlineLogo";
import { buildMailto, buildTel } from "../utils/contactLinks";
import { cn } from "../utils/cn";

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  openQuoteForm: () => void;
}

export default function Header({ activePage, setActivePage, openQuoteForm }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "services", label: "Services", hasDropdown: true },
    { id: "industries", label: "Industries" },
    { id: "gallery", label: "Case Studies" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (pageId: string) => {
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleServiceClick = (slug: string) => {
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setActivePage(`services/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Micro-Bar (Light Crisp Theme) */}
      <div className={cn(
        "bg-[#F0F5FA] text-[#062B3A] text-xs py-2 px-4 sm:px-6 lg:px-8 transition-all duration-300 flex justify-between items-center overflow-hidden border-b border-slate-200/80",
        isScrolled ? "h-0 py-0 opacity-0" : "h-auto opacity-100"
      )}>
        <div className="flex items-center space-x-6">
          <a
            href={buildMailto({ to: COMPANY_DETAILS.primaryEmail, context: "general" })}
            className="flex items-center space-x-1.5 hover:text-[#FF6B1A] transition-colors font-medium text-slate-700 hover:text-[#FF6B1A]"
            aria-label={`Send email to ${COMPANY_DETAILS.primaryEmail}`}
          >
            <Mail className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span className="hidden sm:inline font-semibold text-[#062B3A]">Mundra Base: </span>
            <span>{COMPANY_DETAILS.primaryEmail}</span>
          </a>
          <a
            href={buildMailto({ to: COMPANY_DETAILS.secondaryEmail, context: "general" })}
            className="hidden md:flex items-center space-x-1.5 hover:text-[#FF6B1A] transition-colors font-medium text-slate-700 hover:text-[#FF6B1A]"
            aria-label={`Send email to ${COMPANY_DETAILS.secondaryEmail}`}
          >
            <Mail className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>Planning: {COMPANY_DETAILS.secondaryEmail}</span>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href={buildTel(COMPANY_DETAILS.phone)}
            className="flex items-center space-x-1.5 hover:text-[#FF6B1A] transition-colors font-bold text-[#062B3A]"
            aria-label={`Call ${COMPANY_DETAILS.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>{COMPANY_DETAILS.phone}</span>
          </a>
          <span className="hidden lg:flex items-center space-x-1 text-[#062B3A] font-bold text-[10.5px] tracking-wider uppercase border-l border-slate-300 pl-4">
            <Anchor className="w-3 h-3 text-[#FF6B1A]" />
            <span>Mundra Port → Pan-India</span>
          </span>
        </div>
      </div>

      {/* Main Nav (Pure White Theme) */}
      <nav className={cn(
        "transition-all duration-300 px-4 sm:px-6 lg:px-8 border-b",
        isScrolled
          ? "bg-white/95 backdrop-blur-md py-3.5 shadow-md border-slate-200/90"
          : "bg-white py-4 border-slate-200/70 shadow-sm"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center focus:outline-none group transition-transform hover:scale-[1.02] cursor-pointer"
            aria-label="Arrowline Logistics Home"
          >
            <ArrowlineLogo size="md" />
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setIsServicesDropdownOpen(true)}
                    onMouseLeave={() => setIsServicesDropdownOpen(false)}
                  >
                    <button className={cn(
                      "flex items-center space-x-1 text-sm font-bold tracking-wide transition-all duration-200 hover:text-[#FF6B1A] py-2 cursor-pointer",
                      activePage.startsWith("services") ? "text-[#FF6B1A]" : "text-[#062B3A]"
                    )}>
                      <span>{item.label}</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isServicesDropdownOpen && "rotate-180 text-[#FF6B1A]"
                      )} />
                    </button>

                    <div className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-1 w-84 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3.5 transition-all duration-300 origin-top z-50",
                      isServicesDropdownOpen
                        ? "opacity-100 scale-100 pointer-events-auto visible"
                        : "opacity-0 scale-95 pointer-events-none invisible"
                    )}>
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-100 mb-2 flex items-center justify-between">
                        <span>Multimodal Solutions</span>
                        <span className="text-[#FF6B1A]">7 Verticals</span>
                      </div>
                      {CORE_SERVICES.map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => handleServiceClick(srv.slug)}
                          className={cn(
                            "text-left px-3 py-2 rounded-xl text-sm transition-all duration-150 hover:bg-[#F5F8FA] w-full block group/srv cursor-pointer",
                            activePage === `services/${srv.slug}`
                              ? "bg-[#EAF3F6] font-bold"
                              : ""
                          )}
                        >
                          <span className="block font-bold text-xs text-[#062B3A] group-hover/srv:text-[#FF6B1A] transition-colors">
                            {srv.title}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                            {srv.keyCapability}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "text-sm font-bold tracking-wide transition-all duration-200 hover:text-[#FF6B1A] relative py-2 cursor-pointer",
                    activePage === item.id ? "text-[#FF6B1A]" : "text-[#062B3A]"
                  )}
                >
                  {item.label}
                  {activePage === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B1A] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={openQuoteForm}
              className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] hover:from-[#E55A0D] hover:to-[#FF7A00] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_4px_14px_rgba(255,107,26,0.35)] hover:shadow-[0_6px_20px_rgba(255,107,26,0.45)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              GET A QUOTE
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={openQuoteForm}
              className="px-3.5 py-1.5 bg-[#FF6B1A] text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-md cursor-pointer"
            >
              QUOTE
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-[#F5F8FA] border border-slate-200 rounded-xl text-[#062B3A] hover:text-[#FF6B1A] hover:bg-white transition-colors focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay (Light White Theme) */}
      <div className={cn(
        "fixed inset-0 top-[58px] sm:top-[68px] bg-white text-[#062B3A] z-40 transition-all duration-300 flex flex-col justify-between lg:hidden border-t border-slate-200 shadow-2xl",
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4"
      )}>
        <div className="overflow-y-auto px-6 py-8 space-y-6 flex-1">
          <div className="space-y-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
              Arrowline Navigation
            </div>

            <button
              onClick={() => handleNavClick("home")}
              className={cn(
                "block w-full text-left text-lg font-bold transition-colors",
                activePage === "home" ? "text-[#FF6B1A]" : "text-[#062B3A] hover:text-[#FF6B1A]"
              )}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className={cn(
                "block w-full text-left text-lg font-bold transition-colors",
                activePage === "about" ? "text-[#FF6B1A]" : "text-[#062B3A] hover:text-[#FF6B1A]"
              )}
            >
              About Arrowline
            </button>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-[#FF6B1A] flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Multimodal Services:</span>
              </div>
              <div className="pl-4 grid grid-cols-1 gap-2.5 border-l border-slate-200">
                {CORE_SERVICES.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleServiceClick(srv.slug)}
                    className={cn(
                      "block w-full text-left text-sm transition-all duration-150",
                      activePage === `services/${srv.slug}`
                        ? "text-[#FF6B1A] font-bold"
                        : "text-slate-600 hover:text-[#062B3A]"
                    )}
                  >
                    • {srv.title}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleNavClick("industries")}
              className={cn(
                "block w-full text-left text-lg font-bold transition-colors pt-2",
                activePage === "industries" ? "text-[#FF6B1A]" : "text-[#062B3A] hover:text-[#FF6B1A]"
              )}
            >
              Industries We Serve
            </button>
            <button
              onClick={() => handleNavClick("gallery")}
              className={cn(
                "block w-full text-left text-lg font-bold transition-colors",
                activePage === "gallery" ? "text-[#FF6B1A]" : "text-[#062B3A] hover:text-[#FF6B1A]"
              )}
            >
              Case Studies & Gallery
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={cn(
                "block w-full text-left text-lg font-bold transition-colors",
                activePage === "contact" ? "text-[#FF6B1A]" : "text-[#062B3A] hover:text-[#FF6B1A]"
              )}
            >
              Contact Operations Desk
            </button>
          </div>
        </div>

        <div className="bg-[#F5F8FA] p-6 border-t border-slate-200 space-y-4">
          <div className="text-xs text-slate-600">
            <span className="block font-bold text-[#062B3A] mb-1">Mundra Port Operations Base:</span>
            <span className="block text-[11px] leading-relaxed">
              Office 204, Portview Commercial Complex, Near Adani House, Mundra, Kutch, Gujarat
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 pt-3">
            <a
              href={buildTel(COMPANY_DETAILS.phone)}
              className="flex items-center space-x-1.5 text-[#FF6B1A] font-bold"
              aria-label={`Call ${COMPANY_DETAILS.phone}`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openQuoteForm();
              }}
              className="text-[#062B3A] font-bold tracking-wider uppercase text-[11px] hover:text-[#FF6B1A]"
            >
              Get Free Quote →
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
