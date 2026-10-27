import {
  getAllMainServices,
  getMainServiceBySlug,
  getSubServiceBySlug,
} from "../../data/servicesData";
import ServicePageTemplate from "./ServicePageTemplate";
import { ArrowRight, AlertCircle } from "lucide-react";
import { NotFoundMeta } from "../SEOMeta";

interface ServiceRouteViewProps {
  slug: string;
  onOpenQuote: () => void;
  onNavigateTo: (pageId: string) => void;
}

/**
 * Resolves a service route synchronously from the build-time published
 * snapshot. There is deliberately no loading state: the content exists in
 * the prerendered HTML and in the bundle before the first paint.
 */
export default function ServiceRouteView({
  slug,
  onOpenQuote,
  onNavigateTo,
}: ServiceRouteViewProps) {
  const parts = (slug || "").split("/").filter(Boolean);
  const mainSlug = parts[0] || "road-transportation";
  const subSlug = parts[1];

  const allMains = getAllMainServices();
  const otherMainServices = allMains.filter((service) => service.slug !== mainSlug);

  const parentService = getMainServiceBySlug(mainSlug);
  const serviceData = subSlug
    ? getSubServiceBySlug(mainSlug, subSlug)
    : parentService;

  const isSubService = Boolean(subSlug);
  const siblingSubServices =
    isSubService && parentService
      ? parentService.subServices.filter((sub) => sub.slug !== subSlug)
      : [];

  const handleNavigateToService = (serviceSlug: string, childSlug?: string) => {
    onNavigateTo(
      childSlug
        ? `services/${serviceSlug}/${childSlug}`
        : `services/${serviceSlug}`
    );
  };

  if (!serviceData) {
    return (
      <>
        <NotFoundMeta path={`/services/${slug}`} />
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F5F8FA] px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#FF6B1A] mb-5 shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#062B3A] tracking-tight mb-2">
            Service Not Found
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            The requested service URL{" "}
            <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded text-[#062B3A]">
              /services/{slug}
            </span>{" "}
            does not exist or has been updated.
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
      </>
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
