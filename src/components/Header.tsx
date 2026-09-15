import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Mail, ChevronDown, Globe, Anchor, ChevronRight } from "lucide-react";
import { COMPANY_DETAILS } from "../data/logisticsData";
import { getAllMainServices } from "../data/servicesData";
import ArrowlineLogo from "./ArrowlineLogo";
import { buildMailto, buildTel } from "../utils/contactLinks";
import { cn } from "../utils/cn";

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  openQuoteForm: () => void;
}

export default function Header({ activePage, setActivePage, openQuoteForm }: HeaderProps) {
  const mainServices = getAllMainServices();

  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
        setHoveredService(null);
      }
    };
    if (isServicesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isServicesOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsServicesOpen(false);
        setHoveredService(null);
      }
    };
    if (isServicesOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isServicesOpen]);

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
    setIsServicesOpen(false);
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleServiceClick = (slug: string) => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setActivePage(`services/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hoveredServiceData = mainServices.find((s) => s.slug === hoveredService) || null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Micro-Bar */}
      <div
        className={cn(
          "relative z-50 bg-[#F0F5FA] text-[#062B3A] border-b border-slate-200/80",
          "transition-all duration-500 ease-in-out overflow-hidden",
          isScrolled ? "h-0 py-0 opacity-0" : "h-7 sm:h-8 py-0 opacity-100"
        )}
      >
        <div className="h-full max-w-[1400px] mx-auto px-2.5 sm:px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <span className="flex items-center gap-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-wide uppercase whitespace-nowrap">
              <Anchor className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF6B1A] shrink-0" />
              <span>Mundra Port</span>
              <span className="text-[#FF6B1A] mx-0.5">→</span>
              <span>Pan-India</span>
            </span>
          </div>
          <div className="flex items-center min-w-0">
            <a
              href={buildMailto({ to: COMPANY_DETAILS.primaryEmail, context: "general" })}
              className="flex items-center gap-1 text-[8px] sm:text-[9px] md:text-[10px] font-medium text-[#062B3A] hover:text-[#FF6B1A] transition-colors max-w-[125px] sm:max-w-none truncate"
              aria-label={`Send email to ${COMPANY_DETAILS.primaryEmail}`}
            >
              <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF6B1A] shrink-0" />
              <span className="sm:hidden truncate">{COMPANY_DETAILS.primaryEmail}</span>
              <span className="hidden sm:inline">
                <span className="font-semibold">Mundra Headquarters:</span>{" "}
                {COMPANY_DETAILS.primaryEmail}
              </span>
            </a>
            <div className="hidden sm:flex items-center">
              <span className="mx-2 md:mx-3 h-3 w-px bg-slate-300" />
              <a
                href={buildTel(COMPANY_DETAILS.phone)}
                className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-[#062B3A] hover:text-[#FF6B1A] transition-colors whitespace-nowrap"
                aria-label={`Call ${COMPANY_DETAILS.phone}`}
              >
                <Phone className="w-3 h-3 text-[#FF6B1A]" />
                <span>{COMPANY_DETAILS.phone}</span>
              </a>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 h-[1px] w-16 sm:w-24 bg-[#FF6B1A]/70"
          style={{ animation: !isScrolled ? "topBarLine 3s ease-in-out infinite" : "none" }}
        />
        <style>{`
          @keyframes topBarLine {
            0% { transform: translateX(-100%); opacity: 0; }
            30% { opacity: 1; }
            70% { opacity: 1; }
            100% { transform: translateX(700%); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Main Nav */}
      <nav
        className={cn(
          "transition-all duration-300 px-4 sm:px-6 lg:px-8 border-b",
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-3.5 shadow-md border-slate-200/90"
            : "bg-white py-4 border-slate-200/70 shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center focus:outline-none group transition-transform hover:scale-[1.02] cursor-pointer"
            aria-label="Arrowline Logistics Home"
          >
            <ArrowlineLogo size="md" />
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.id}
                    ref={megaRef}
                    className="relative"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => {
                      setIsServicesOpen(false);
                      setHoveredService(null);
                    }}
                  >
                    <button
                      className={cn(
                        "flex items-center space-x-1 text-sm font-bold tracking-wide transition-all duration-200 hover:text-[#FF6B1A] py-2 cursor-pointer",
                        activePage.startsWith("services") ? "text-[#FF6B1A]" : "text-[#062B3A]"
                      )}
                    >
                      <span>Services</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isServicesOpen && "rotate-180 text-[#FF6B1A]"
                        )}
                      />
                    </button>

                    {/* Services Dropdown */}
                    <div
                      className={cn(
                        "absolute top-full left-0 pt-1 z-50 transition-all duration-200 origin-top",
                        isServicesOpen
                          ? "opacity-100 scale-100 pointer-events-auto visible"
                          : "opacity-0 scale-95 pointer-events-none invisible"
                      )}
                    >
                      <div className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                        <div className="flex items-stretch">
                          {/* First Column: Main Services */}
                          <div className="py-2 px-1.5 space-y-0.5 w-56">
                            {mainServices.map((srv) => {
                              const hasSubs = srv.subServices && srv.subServices.length > 0;
                              return (
                                <div key={srv.id} className="relative">
                                  <button
                                    onMouseEnter={() => setHoveredService(srv.slug)}
                                    onClick={() => handleServiceClick(srv.slug)}
                                    className={cn(
                                      "text-left w-full px-3 py-2 rounded text-sm transition-all duration-150 flex items-center justify-between cursor-pointer",
                                      activePage === `services/${srv.slug}`
                                        ? "bg-[#EAF3F6] font-bold"
                                        : "",
                                      hoveredService === srv.slug
                                        ? "bg-[#F5F8FA]"
                                        : "hover:bg-[#F5F8FA]"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "font-bold text-xs transition-colors pr-2",
                                        activePage === `services/${srv.slug}`
                                          ? "text-[#FF6B1A]"
                                          : hoveredService === srv.slug
                                          ? "text-[#FF6B1A]"
                                          : "text-[#062B3A]"
                                      )}
                                    >
                                      {srv.title}
                                    </span>
                                    {hasSubs && (
                                      <ChevronRight
                                        className={cn(
                                          "w-3.5 h-3.5 shrink-0 transition-colors",
                                          hoveredService === srv.slug || activePage === `services/${srv.slug}`
                                            ? "text-[#FF6B1A]"
                                            : "text-slate-300"
                                        )}
                                      />
                                    )}
                                  </button>
                                  {hoveredService === srv.slug && (
                                    <div className="absolute left-0 top-0 h-full w-0.5 bg-[#FF6B1A]" />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Second Column: Sub-Services (hovered main service only) */}
                          {hoveredServiceData && (
                            <div className="py-2 px-1.5 space-y-0.5 w-72 border-l border-slate-100">
                              {(hoveredServiceData.subServices || []).map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => handleServiceClick(`${hoveredServiceData.slug}/${sub.slug}`)}
                                  className="w-full text-left px-3 py-1.5 rounded text-xs text-slate-600 hover:text-[#FF6B1A] hover:bg-[#F5F8FA] transition-all duration-150 cursor-pointer whitespace-nowrap"
                                >
                                  {sub.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
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

          {/* CTA */}
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

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-[58px] sm:top-[68px] bg-white text-[#062B3A] z-40 transition-all duration-300 flex flex-col justify-between lg:hidden border-t border-slate-200 shadow-2xl",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4"
        )}
      >
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
                {mainServices.map((srv) => {
                  const hasSubs = srv.subServices && srv.subServices.length > 0;
                  const isExpanded = expandedService === srv.slug;
                  return (
                    <div key={srv.id}>
                      <button
                        onClick={() => {
                          if (hasSubs) {
                            setExpandedService(isExpanded ? null : srv.slug);
                          } else {
                            handleServiceClick(srv.slug);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={cn(
                          "block w-full text-left text-sm transition-all duration-150 flex items-center justify-between cursor-pointer",
                          activePage === `services/${srv.slug}` ? "text-[#FF6B1A] font-bold" : "text-slate-600 hover:text-[#062B3A]"
                        )}
                      >
                        <span>• {srv.title}</span>
                        {hasSubs && (
                          <ChevronRight
                            className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-90")}
                          />
                        )}
                      </button>
                      {hasSubs && (
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200 mt-1 mb-1",
                            isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          <div className="pl-4 space-y-1 border-l border-slate-200">
                            {(srv.subServices || []).map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  handleServiceClick(`${srv.slug}/${sub.slug}`);
                                  setIsMobileMenuOpen(false);
                                  setExpandedService(null);
                                }}
                                className={cn(
                                  "block w-full text-left text-sm py-1 px-2 transition-colors cursor-pointer",
                                  activePage === `services/${srv.slug}/${sub.slug}` ? "text-[#FF6B1A] font-bold" : "text-slate-500 hover:text-[#062B3A]"
                                )}
                              >
                                – {sub.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
            <span className="block font-bold text-[#062B3A] mb-1">Mundra Headquarters:</span>
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
