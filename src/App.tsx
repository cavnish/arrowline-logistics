import { useEffect, useState } from "react";

import Lenis from "lenis";

import { COMPANY_DETAILS } from "./data/logisticsData";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LeadModal from "./components/LeadModal";
import ContactForm from "./components/ContactForm";
import CookieConsent from "./components/CookieConsent";

import Home from "./pages/Home";
import About from "./pages/About";
import Industries from "./pages/Industries";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";

import ServiceRouteView from "./components/services/ServiceRouteView";

import {
  Phone,
  X,
  ShieldCheck,
} from "lucide-react";

import {
  buildTel,
  buildWhatsApp,
} from "./utils/contactLinks";

import AdminRouter from "./admin/AdminRouter";

export default function App() {
  const [activePage, setActivePage] =
    useState<string>("home");

  const [
    isGlobalQuoteOpen,
    setIsGlobalQuoteOpen,
  ] = useState(false);

  const [
    submittedLead,
    setSubmittedLead,
  ] = useState<any>(null);

  const [
    toastMessage,
    setToastMessage,
  ] = useState<string | null>(
    null
  );

  const [
    isAdminRoute,
    setIsAdminRoute,
  ] = useState(false);

  // ===================================================
  // DETECT ADMIN ROUTE
  // ===================================================

  useEffect(() => {
    const checkRoute = () => {
      const hash =
        window.location.hash ||
        "";

      setIsAdminRoute(
        hash.startsWith(
          "#/arrowline-admin"
        )
      );
    };

    checkRoute();

    window.addEventListener(
      "hashchange",
      checkRoute
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        checkRoute
      );
    };
  }, []);

  // ===================================================
  // LENIS
  // ===================================================

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const lenis =
      new Lenis({
        duration: 1.1,

        easing: (t) =>
          Math.min(
            1,
            1.001 -
              Math.pow(
                2,
                -10 * t
              )
          ),

        smoothWheel: true,
      });

    let animationFrame: number;

    function raf(time: number) {
      lenis.raf(time);

      animationFrame =
        requestAnimationFrame(
          raf
        );
    }

    animationFrame =
      requestAnimationFrame(
        raf
      );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      lenis.destroy();
    };
  }, [isAdminRoute]);

  // ===================================================
  // PUBLIC ROUTING
  // ===================================================

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const handleHashChange =
      () => {
        const hash =
          window.location.hash ||
          "";

        if (
          hash.startsWith(
            "#/arrowline-admin"
          )
        ) {
          return;
        }

        if (
          !hash ||
          hash === "#/" ||
          hash === "#/home"
        ) {
          setActivePage("home");
        } else if (
          hash.startsWith(
            "#/about"
          )
        ) {
          setActivePage("about");
        } else if (
          hash.startsWith(
            "#/industries"
          )
        ) {
          setActivePage(
            "industries"
          );
        } else if (
          hash.startsWith(
            "#/gallery"
          )
        ) {
          setActivePage("gallery");
        } else if (
          hash.startsWith(
            "#/contact"
          )
        ) {
          setActivePage("contact");
        } else if (
          hash.startsWith(
            "#/services"
          )
        ) {
          const raw = hash.replace("#/services", "");
          const clean = raw.startsWith("/") ? raw.slice(1) : raw;
          setActivePage(clean ? `services/${clean}` : "services/road-transportation");
        } else {
          setActivePage("home");
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      };

    handleHashChange();

    window.addEventListener(
      "hashchange",
      handleHashChange
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        handleHashChange
      );
    };
  }, [isAdminRoute]);

  // ===================================================
  // NAVIGATION
  // ===================================================

  const handlePageChange = (
    pageId: string
  ) => {
    setActivePage(pageId);

    window.location.hash =
      pageId === "home"
        ? "#/"
        : `#/${pageId}`;
  };

  // ===================================================
  // ANALYTICS
  // ===================================================

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const gaId =
      (import.meta as any).env
        ?.VITE_GA_ID ||
      "";

    console.info(
      `[Analytics] Arrowline SEO Agent — view: "/${activePage}", ID: ${gaId || "disabled"}`
    );
  }, [
    activePage,
    isAdminRoute,
  ]);

  // ===================================================
  // TOAST
  // ===================================================

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer =
      window.setTimeout(
        () =>
          setToastMessage(
            null
          ),
        4000
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [toastMessage]);

  // ===================================================
  // FORM SUCCESS
  // ===================================================

  const handleFormSuccess = (
    leadData: any
  ) => {
    setSubmittedLead(
      leadData
    );

    setToastMessage(
      "Success! Freight inquiry logged with our Mundra clearance desk."
    );
  };

  // ===================================================
  // ADMIN
  // ===================================================

  if (isAdminRoute) {
    return <AdminRouter />;
  }

  // ===================================================
  // PUBLIC PAGE
  // ===================================================

  const renderCurrentView =
    () => {
      if (
        activePage.startsWith(
          "services/"
        ) ||
        activePage === "services"
      ) {
        const slug =
          activePage.startsWith("services/")
            ? activePage.replace("services/", "")
            : "road-transportation";

        return (
          <ServiceRouteView
            slug={slug}
            onOpenQuote={() =>
              setIsGlobalQuoteOpen(
                true
              )
            }
            onNavigateTo={
              handlePageChange
            }
          />
        );
      }

      switch (
        activePage
      ) {
        case "about":
          return <About />;

        case "industries":
          return (
            <Industries
              onOpenQuote={() =>
                setIsGlobalQuoteOpen(
                  true
                )
              }
              onFormSuccess={
                handleFormSuccess
              }
            />
          );

        case "gallery":
          return <Gallery />;

        case "contact":
          return (
            <Contact
              onFormSuccess={
                handleFormSuccess
              }
            />
          );

        case "home":
        default:
          return (
            <Home
              onOpenQuote={() =>
                setIsGlobalQuoteOpen(
                  true
                )
              }
              onSelectService={(
                slug
              ) =>
                handlePageChange(
                  `services/${slug}`
                )
              }
              onNavigateTo={
                handlePageChange
              }
              onFormSuccess={
                handleFormSuccess
              }
            />
          );
      }
    };

  // ===================================================
  // PUBLIC APP UI
  // ===================================================

  return (
    <div className="min-h-screen bg-[#F5F8FA] text-[#102A36] flex flex-col justify-between selection:bg-[#FF6B1A] selection:text-white">

      <Header
        activePage={
          activePage
        }
        setActivePage={
          handlePageChange
        }
        openQuoteForm={() =>
          setIsGlobalQuoteOpen(
            true
          )
        }
      />

      <main
        className={`flex-grow ${
          activePage === "home" ||
          activePage === "industries" ||
          activePage.startsWith("services")
            ? "pt-0"
            : "pt-24 sm:pt-28"
        } ${
          activePage === "home" ||
          activePage === "industries" ||
          activePage.startsWith("services")
            ? ""
            : "pb-12 sm:pb-16"
        } relative z-10`}
      >
        <div
          className={
            activePage === "home" ||
            activePage === "industries" ||
            activePage.startsWith("services")
              ? "w-full"
              : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          }
        >
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderCurrentView()}
          </div>
        </div>
      </main>

      <Footer
        setActivePage={handlePageChange}
      />

      {/* LEAD MODAL */}

      <LeadModal
        isOpen={
          submittedLead !==
          null
        }
        onClose={() =>
          setSubmittedLead(
            null
          )
        }
        leadData={
          submittedLead
        }
      />

      {/* COOKIE CONSENT (public site only) */}

      {!isAdminRoute && (
        <CookieConsent
        />
      )}

      {/* GLOBAL QUOTE */}

      {isGlobalQuoteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#03212D]/80 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">

            <button
              type="button"
              onClick={() =>
                setIsGlobalQuoteOpen(
                  false
                )
              }
              className="absolute top-4 right-4 text-slate-500 hover:text-[#062B3A] bg-[#F5F8FA] p-2 rounded-xl hover:bg-white border border-slate-200 transition-all z-50 cursor-pointer"
              aria-label="Close quote form"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[85vh] overflow-y-auto">
              <ContactForm
                onSuccess={(
                  data
                ) => {
                  setIsGlobalQuoteOpen(
                    false
                  );

                  handleFormSuccess(
                    data
                  );
                }}
              />
            </div>

          </div>

        </div>
      )}

      {/* FLOATING BUTTONS */}

      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col space-y-3 items-end">

        {/* CALL */}

        <a
          href={buildTel(
            COMPANY_DETAILS.phone
          )}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-white hover:bg-[#F5F8FA] text-[#062B3A] rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(6,43,58,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all group relative border border-slate-200"
          aria-label={`Call ${COMPANY_DETAILS.phone}`}
          title="Direct Dial Dispatch Desk"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B1A]" />
        </a>

        {/* WHATSAPP */}

        <a
          href={buildWhatsApp(
            {
              phone:
                COMPANY_DETAILS.whatsapp,
              context:
                "quote",
            }
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all group relative animate-whatsapp-pulse"
          aria-label="Chat with Arrowline Logistics on WhatsApp"
          title="WhatsApp"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 01-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 01-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.885 2.722.885.703 0 2.02-.42 2.35-1.09.216-.42.216-.783.144-.87-.058-.144-.286-.215-.63-.386zM24.14 7.9C21.94 5.7 19.03 4.5 15.97 4.5c-6.33 0-11.47 5.15-11.47 11.48 0 2.02.53 4 1.53 5.75L4.5 27.5l5.92-1.55c1.68.92 3.58 1.4 5.53 1.4h.01c6.33 0 11.5-5.15 11.5-11.48 0-3.07-1.2-5.96-3.36-8.15zm-8.18 17.66h-.01c-1.75 0-3.46-.47-4.96-1.36l-.36-.21-3.68.97.98-3.6-.23-.37a9.53 9.53 0 01-1.46-5.08c0-5.26 4.28-9.54 9.54-9.54 2.55 0 4.94.99 6.74 2.8 1.8 1.81 2.79 4.2 2.79 6.75-.01 5.27-4.29 9.55-9.55 9.55z" />
          </svg>
        </a>

      </div>

      {/* TOAST */}

      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#062B3A] border-l-4 border-emerald-500 rounded-xl px-4 py-3.5 shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-5 duration-200 text-white">

          <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>

          <div>
            <span className="block text-xs font-bold text-white leading-none">
              Status Update
            </span>

            <span className="block text-[10px] text-slate-300 mt-1">
              {toastMessage}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}