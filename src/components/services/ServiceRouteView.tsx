import { useEffect, useState } from "react";
import {
  getAllMainServices,
  getMainServiceBySlug,
  MainServiceData,
  SubServiceData,
} from "../../data/servicesData";
import { contentService } from "../../services/contentService";
import ServicePageTemplate from "./ServicePageTemplate";
import { ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

interface ServiceRouteViewProps {
  slug: string;
  onOpenQuote: () => void;
  onNavigateTo: (pageId: string) => void;
}

export default function ServiceRouteView({
  slug,
  onOpenQuote,
  onNavigateTo,
}: ServiceRouteViewProps) {
  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState<MainServiceData | SubServiceData | null>(null);
  const [parentService, setParentService] = useState<MainServiceData | undefined>(undefined);
  const [siblingSubServices, setSiblingSubServices] = useState<SubServiceData[]>([]);
  const [otherMainServices, setOtherMainServices] = useState<MainServiceData[]>([]);
  const [isSubService, setIsSubService] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    async function loadService() {
      try {
        const parts = (slug || "").split("/").filter(Boolean);
        const mainSlug = parts[0] || "road-transportation";
        const subSlug = parts[1];

        const allMains = getAllMainServices();
        const otherMains = allMains.filter((m) => m.slug !== mainSlug);

        if (!subSlug) {
          // Main Service Page
          const main = await contentService.getServiceDetail(mainSlug);
          if (!isMounted) return;

          if (main) {
            setServiceData(main);
            setIsSubService(false);
            setParentService(undefined);
            setSiblingSubServices([]);
            setOtherMainServices(otherMains);
          } else {
            setNotFound(true);
          }
        } else {
          // Sub-Service Page
          const sub = await contentService.getServiceItemDetail(mainSlug, subSlug);
          const parent = getMainServiceBySlug(mainSlug);
          if (!isMounted) return;

          if (sub) {
            setServiceData(sub);
            setIsSubService(true);
            setParentService(parent);
            setSiblingSubServices(
              parent ? parent.subServices.filter((s) => s.slug !== subSlug) : []
            );
            setOtherMainServices(otherMains);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error("[ServiceRouteView] Error loading service:", err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadService();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleNavigateToService = (serviceSlug: string, subSlug?: string) => {
    const targetHash = subSlug
      ? `services/${serviceSlug}/${subSlug}`
      : `services/${serviceSlug}`;
    onNavigateTo(targetHash);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F5F8FA] px-4 py-20">
        <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-[#FF6B1A] animate-spin mb-4" />
        <p className="text-sm font-bold text-[#062B3A] tracking-wider uppercase">
          Loading Arrowline Logistics Solution...
        </p>
      </div>
    );
  }

  // Not Found State
  if (notFound || !serviceData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F5F8FA] px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#FF6B1A] mb-5 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#062B3A] tracking-tight mb-2">
          Service Not Found
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          The requested service URL <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded text-[#062B3A]">/services/{slug}</span> does not exist or has been updated.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigateTo("services/road-transportation")}
            className="px-6 py-3 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Explore Road Transportation</span>
            <ArrowRight className="w-4 h-4 text-[#FF6B1A]" />
          </button>
          <button
            onClick={() => onNavigateTo("home")}
            className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-[#062B3A] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <ServicePageTemplate
      service={serviceData}
      isSubService={isSubService}
      parentService={parentService}
      siblingSubServices={siblingSubServices}
      otherMainServices={otherMainServices}
      onOpenQuote={onOpenQuote}
      onNavigateToService={handleNavigateToService}
      onNavigateTo={onNavigateTo}
    />
  );
}
