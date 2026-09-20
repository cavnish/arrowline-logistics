import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Mail, ChevronDown, Globe, Anchor, ChevronRight, ArrowRight } from "lucide-react";
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
  const [megaOffset, setMegaOffset] = useState(0);
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

  useEffect(() => {
    const computeOffset = () => {
      if (!megaRef.current) return;
      const rect = megaRef.current.getBoundingClientRect();
      const panelWidth = Math.min(880, window.innerWidth - 48);
      const center = rect.left + rect.width / 2;
      const clamped = Math.min(
        Math.max(center - panelWidth / 2, 12),
        window.innerWidth - panelWidth - 12
      );
      setMegaOffset(clamped - rect.left);
    };
    if (isServicesOpen) {
      computeOffset();
      window.addEventListener("resize", computeOffset);
      return () => window.removeEventListener("resize", computeOffset);
    }
  }, [isServicesOpen]);

  const positionMega = () => {
    if (!megaRef.current) return;
    const rect = megaRef.current.getBoundingClientRect();
    const panelWidth = Math.min(880, window.innerWidth - 48);
    const center = rect.left + rect.width / 2;
    const clamped = Math.min(
      Math.max(center - panelWidth / 2, 12),
      window.innerWidth - panelWidth - 12
    );
    setMegaOffset(clamped - rect.left);
  };

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

  const activeCategorySlug = hoveredService ?? mainServices[0]?.slug ?? "";
  const hoveredServiceData = mainServices.find((s) => s.slug === activeCategorySlug) || null;

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
                    onMouseEnter={() => {
                      positionMega();
                      setIsServicesOpen(true);
                    }}
                    onMouseLeave={() => {
                      setIsServicesOpen(false);
                      setHoveredService(null);
                    }}
                  >
                    <button
                      onClick={() => {
                        if (!isServicesOpen) positionMega();
                        setIsServicesOpen((open) => !open);
                        if (!isServicesOpen) setHoveredService(null);
                      }}
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

                    {/* Services Dropdown — Mega Menu */}
                    <div
                      aria-hidden={!isServicesOpen}
                      style={{ left: megaOffset }}
                      className={cn(
                        "absolute top-full origin-top z-50 transition-all duration-200 pt-3",
                        isServicesOpen
                          ? "opacity-100 scale-100 pointer-events-auto visible"
                          : "opacity-0 scale-[0.97] translate-y-2 pointer-events-none invisible"
                      )}
                    >
                      <style>{`
                        @keyframes megaFade {
                          from { opacity: 0; transform: translateY(6px); }
                          to { opacity: 1; transform: translateY(0); }
                        }
                        .mega-fade { animation: megaFade 0.22s ease-out; }
                      `}</style>
                      <div className="w-[min(880px,calc(100vw-3rem))] bg-white rounded-2xl border border-slate-200/80 shadow-[0_25px_70px_-15px_rgba(6,43,58,0.28)] overflow-hidden">
                        <div className="flex">
                          {/* Left Column: Service Categories */}
                          <div className="w-64 sm:w-72 shrink-0 border-r border-slate-100 bg-[#FAFCFD] p-4 space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 px-2 mb-3">
                              Explore Services
                            </p>
                            {mainServices.map((srv) => {
                              const isActiveCat = srv.slug === activeCategorySlug;
                              const isCurrent = activePage === `services/${srv.slug}`;
                              return (
                                <button
                                  key={srv.id}
                                  onMouseEnter={() => setHoveredService(srv.slug)}
                                  onClick={() => handleServiceClick(srv.slug)}
                                  className={cn(
                                    "relative w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group cursor-pointer",
                                    isActiveCat ? "bg-[#EDF4F8]" : "hover:bg-[#F1F6F9]"
                                  )}
                                >
                                  {isActiveCat && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#FF6B1A]" />
                                  )}
                                  <span
                                    className={cn(
                                      "text-[13px] transition-colors duration-200",
                                      isActiveCat
                                        ? "font-black text-[#062B3A]"
                                        : isCurrent
                                        ? "font-bold text-[#FF6B1A]"
                                        : "font-semibold text-[#2C4A5A] group-hover:text-[#062B3A]"
                                    )}
                                  >
                                    {srv.title}
                                  </span>
                                  <ChevronRight
                                    className={cn(
                                      "w-4 h-4 shrink-0 transition-all duration-200 group-hover:translate-x-0.5",
                                      isActiveCat
                                        ? "text-[#FF6B1A]"
                                        : "text-slate-300 group-hover:text-[#FF6B1A]"
                                    )}
                                  />
                                </button>
                              );
                            })}
                          </div>

                          {/* Right Column: Services of the Selected Category */}
                          {hoveredServiceData && (
                            <div
                              key={activeCategorySlug}
                              className="mega-fade flex-1 min-w-0 p-5 sm:p-6 flex flex-col"
                            >
                              {/* Panel Header */}
                              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <h3 className="text-base font-black text-[#062B3A] truncate">
                                    {hoveredServiceData.title}
                                  </h3>
                                </div>
                                <button
                                  onClick={() => handleServiceClick(hoveredServiceData.slug)}
                                  className="shrink-0 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#FF6B1A] hover:text-[#E55A0D] transition-colors cursor-pointer"
                                >
                                  View All
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Sub-Services Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {(hoveredServiceData.subServices || []).map((sub) => {
                                  const isSubActive =
                                    activePage ===
                                    `services/${hoveredServiceData.slug}/${sub.slug}`;
                                  return (
                                    <button
                                      key={sub.id}
                                      onClick={() =>
                                        handleServiceClick(
                                          `${hoveredServiceData.slug}/${sub.slug}`
                                        )
                                      }
                                      className={cn(
                                        "group/sub w-full text-left px-3 py-2.5 rounded-xl border border-transparent transition-all duration-200 cursor-pointer",
                                        isSubActive
                                          ? "bg-[#EAF3F6] border-[#D6E7EE]"
                                          : "hover:bg-[#F6F9FB] hover:border-slate-100"
                                      )}
                                    >
                                      <span className="flex items-start justify-between gap-2">
                                        <span
                                          className={cn(
                                            "text-[13px] font-bold transition-colors duration-200",
                                            isSubActive
                                              ? "text-[#FF6B1A]"
                                              : "text-[#243B48] group-hover/sub:text-[#FF6B1A]"
                                          )}
                                        >
                                          {sub.title}
                                        </span>
                                        <ArrowRight
                                          className={cn(
                                            "w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-300 opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all duration-200",
                                            isSubActive
                                              ? "text-[#FF6B1A] opacity-100 translate-x-0"
                                              : "group-hover/sub:text-[#FF6B1A]"
                                          )}
                                        />
                                      </span>
                                      <span className="mt-1 block text-[11px] leading-snug text-slate-500 line-clamp-2">
                                        {sub.shortDesc}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Panel Footer */}
                              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                <p className="text-[11px] text-slate-500">
                                  Planning a shipment?{" "}
                                  <span className="font-bold text-[#062B3A]">
                                    Our logistics experts are on call 24/7.
                                  </span>
                                </p>
                                <button
                                  onClick={openQuoteForm}
                                  className="shrink-0 px-4 py-2 bg-[#062B3A] text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-[#0B3D50] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                                >
                                  Get a Quote
                                </button>
                              </div>
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

            <div className="space-y-2 pt-2 pb-3">
              <div className="text-xs font-bold text-[#FF6B1A] flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Multimodal Services</span>
              </div>
              <div className="pl-2 space-y-1.5">
                {mainServices.map((srv) => {
                  const hasSubs = srv.subServices && srv.subServices.length > 0;
                  const isExpanded = expandedService === srv.slug;
                  const isActiveCat =
                    activePage === `services/${srv.slug}` ||
                    srv.subServices.some(
                      (sub) => activePage === `services/${srv.slug}/${sub.slug}`
                    );
                  return (
                    <div
                      key={srv.id}
                      className={cn(
                        "overflow-hidden rounded-xl border transition-all duration-200",
                        isExpanded ? "border-[#D6E7EE] bg-[#FAFCFD]" : "border-slate-100 bg-white"
                      )}
                    >
                      <button
                        onClick={() => {
                          if (hasSubs) {
                            setExpandedService(isExpanded ? null : srv.slug);
                          } else {
                            handleServiceClick(srv.slug);
                          }
                        }}
                        aria-expanded={isExpanded}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors cursor-pointer",
                          isActiveCat ? "bg-[#EDF4F8]" : ""
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm transition-colors",
                            isActiveCat
                              ? "font-black text-[#062B3A]"
                              : "font-bold text-slate-600 hover:text-[#062B3A]"
                          )}
                        >
                          {srv.title}
                        </span>
                        {hasSubs && (
                          <span
                            className={cn(
                              "w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-all duration-300",
                              isExpanded
                                ? "bg-[#FF6B1A] text-white rotate-90"
                                : "bg-[#F0F5FA] text-[#062B3A]"
                            )}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>

                      {hasSubs && (
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isExpanded ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          <div className="px-3.5 pb-3 pt-1 space-y-0.5">
                            {(srv.subServices || []).map((sub) => {
                              const isSubActive = activePage === `services/${srv.slug}/${sub.slug}`;
                              return (
                                <div key={sub.id} className="relative">
                                  {isSubActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-[#FF6B1A]" />
                                  )}
                                  <button
                                    onClick={() => {
                                      handleServiceClick(`${srv.slug}/${sub.slug}`);
                                      setExpandedService(null);
                                    }}
                                    className={cn(
                                      "w-full text-left text-[13px] py-2 px-2.5 rounded-lg transition-colors cursor-pointer",
                                      isSubActive
                                        ? "bg-[#EAF3F6] text-[#FF6B1A] font-bold"
                                        : "text-slate-500 hover:text-[#062B3A] hover:bg-[#F6F9FB]"
                                    )}
                                  >
                                    {sub.title}
                                  </button>
                                </div>
                              );
                            })}
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
