import { useEffect } from "react";
import { MainServiceData, SubServiceData } from "../../data/servicesData";
import ServiceHero from "./ServiceHero";
import { FALLBACK_IMAGE } from "../ui/SmartImage";
import ServiceAbout from "./ServiceAbout";
import ServiceSubServices from "./ServiceSubServices";
import ServiceApplications from "./ServiceApplications";
import ServiceFAQ from "./ServiceFAQ";
import ServiceGallery from "./ServiceGallery";
import ServiceVideo from "./ServiceVideo";
import ServiceRelated from "./ServiceRelated";
import TrackTraceBar from "../TrackTraceBar";
import ServiceCTA from "./ServiceCTA";
import ServiceSchema from "./ServiceSchema";
import { SITE_URL } from "../../utils/navigation";

// ── Common Home-Page Sections (shared across ALL service pages) ──
import TrustStrip from "../TrustStrip";
import WhyChooseUsSection from "../WhyChooseUsSection";
import ProcessSection from "../ProcessSection";
import IndustriesPreviewBar from "../IndustriesPreviewBar";
import TestimonialsSection from "../TestimonialsSection";

interface ServicePageTemplateProps {
  service: MainServiceData | SubServiceData;
  isSubService?: boolean;
  parentService?: MainServiceData;
  siblingSubServices?: SubServiceData[];
  otherMainServices?: MainServiceData[];
  onOpenQuote: () => void;
  onNavigateToService?: (serviceSlug: string, subSlug?: string) => void;
  onNavigateTo?: (pageId: string) => void;
}

export default function ServicePageTemplate({
  service,
  isSubService = false,
  parentService,
  siblingSubServices = [],
  otherMainServices = [],
  onOpenQuote,
  onNavigateToService,
  onNavigateTo,
}: ServicePageTemplateProps) {
  // Update browser document title, meta description, canonical and OG tags
  useEffect(() => {
    const pageTitle = service.seoTitle || `${service.title} | Arrowline Logistics India`;
    document.title = pageTitle;

    const cleanCanonical = (service.canonicalUrl || `${SITE_URL}/services/${
      isSubService ? `${parentService?.slug || (service as SubServiceData).parentSlug}/${service.slug}` : service.slug
    }`).split("#")[0];

    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute("content", service.seoDesc || service.shortDesc || "");
    }

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.setAttribute("href", cleanCanonical);
    }

    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.setAttribute("content", cleanCanonical);
    }

    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute("content", pageTitle);
    }

    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) {
      ogDescTag.setAttribute("content", service.seoDesc || service.shortDesc || "");
    }

    const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleTag) {
      twitterTitleTag.setAttribute("content", pageTitle);
    }

    const twitterDescTag = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescTag) {
      twitterDescTag.setAttribute("content", service.seoDesc || service.shortDesc || "");
    }
  }, [service, isSubService, parentService]);

  const subServiceData = isSubService ? (service as SubServiceData) : null;
  const mainServiceData = !isSubService ? (service as MainServiceData) : null;

  return (
    <div className="min-h-screen bg-[#F5F8FA] text-[#062B3A] font-sans antialiased selection:bg-[#FF6B1A] selection:text-white">
      {/* Dynamic SEO JSON-LD Structured Data Schema */}
      <ServiceSchema
        service={service}
        isSubService={isSubService}
        parentService={parentService}
        canonicalUrl={service.canonicalUrl}
      />

      {/* 1. HERO SECTION */}
      <ServiceHero
        badge={
          service.heroBadge ||
          (isSubService
            ? `${(subServiceData?.parentName || "ARROWLINE").toUpperCase()} • SPECIALIZED SERVICE`
            : `${service.title.toUpperCase()} • PAN-INDIA`)
        }
        breadcrumb={
          isSubService
            ? [
                "Home",
                "Services",
                parentService?.title || subServiceData?.parentName || "Road Freight",
                service.title,
              ]
            : ["Home", "Services", service.title]
        }
        headline={service.heroHeadline || service.title}
        subheadline={service.heroSubheadline}
        description={(service as any).heroDescription || service.heroSubheadline || service.shortDesc}
        image={service.heroImage || service.aboutImage || FALLBACK_IMAGE}
        videoUrl={service.heroVideo || service.videoUrl}
        fallbackImage={service.heroFallbackImage || service.aboutImage}
        imageAlt={service.imageAlt || service.title}
        onOpenQuote={onOpenQuote}
      />

      {/* 2. TRUSTED BY INDUSTRY LEADERS (Common — matches Home) */}
      <TrustStrip />

      {/* =========================================================================
          SERVICE-SPECIFIC CONTENT (branched for Main vs Sub-Service)
         ========================================================================= */}
      {isSubService ? (
        <>
          {/* Sub-Service Introduction / About */}
          <ServiceAbout
            badge={subServiceData?.aboutBadge || "OPERATIONAL CAPABILITY"}
            heading={service.aboutHeading || `${service.title} for Industrial Freight`}
            description={service.aboutDescription || service.shortDesc}
            bulletPoints={
              (service as any).aboutBulletPoints ||
              (service as any).aboutChecklist ||
              []
            }
            image={service.aboutImage || service.heroImage || "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg"}
            onOpenQuote={onOpenQuote}
          />

          {/* Service Information / Capabilities */}
          <ServiceSubServices
            isSubServicePage={true}
            parentSlug={subServiceData?.parentSlug}
            capabilities={subServiceData?.capabilities || []}
            sectionTitle="Specialized Operational Scope"
            sectionSubtitle="Engineered operational parameters configured for route reliability, safety compliance, and maximum throughput."
          />

          {/* Related Images / Gallery */}
          {service.gallery && service.gallery.length > 0 && (
            <ServiceGallery
              serviceName={service.title}
              items={service.gallery}
              heading={(service as SubServiceData).showcaseHeading}
              description={(service as SubServiceData).showcaseDescription}
            />
          )}

          {/* Video If Available */}
          {service.videoUrl && (
            <ServiceVideo
              serviceName={service.title}
              videoUrl={service.videoUrl}
              posterImage={service.videoPoster || service.heroImage || service.aboutImage}
            />
          )}

          {/* Applications / Cargo */}
          <ServiceApplications
            serviceName={service.title}
            applications={service.applications || []}
            heading={(service as SubServiceData).cargoHeading}
            description={(service as SubServiceData).cargoDescription}
          />
        </>
      ) : (
        <>
          {/* About / Introduction */}
          <ServiceAbout
            badge={mainServiceData?.aboutBadge || `${service.title.toUpperCase()}`}
            heading={service.aboutHeading || `${service.title} Built Around Your Cargo`}
            description={service.aboutDescription || service.shortDesc}
            bulletPoints={
              (service as any).aboutBulletPoints ||
              (service as any).aboutChecklist ||
              []
            }
            image={service.aboutImage || service.heroImage || "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg"}
            onOpenQuote={onOpenQuote}
          />

          {/* Service-Specific Sub-Services Grid */}
          <ServiceSubServices
            isSubServicePage={false}
            parentSlug={mainServiceData?.slug}
            subServices={mainServiceData?.subServices || []}
            sectionTitle={`Specialized ${service.title} Solutions`}
            sectionSubtitle={`Explore dedicated ${service.title.toLowerCase()} configurations tailored to specific industrial freight profiles.`}
            onNavigateToSubService={(subSlug) => {
              if (onNavigateToService) {
                onNavigateToService(mainServiceData?.slug || service.slug, subSlug);
              } else {
                window.location.pathname = `/services/${mainServiceData?.slug || service.slug}/${subSlug}`;
              }
            }}
          />

          {/* Cargo / Applications */}
          <ServiceApplications
            serviceName={service.title}
            applications={service.applications || []}
            heading={(service as MainServiceData).cargoHeading}
            description={(service as MainServiceData).cargoDescription}
          />

          {/* Image Gallery (if present) */}
          {service.gallery && service.gallery.length > 0 && (
            <ServiceGallery
              serviceName={service.title}
              items={service.gallery}
              heading={(service as MainServiceData).showcaseHeading}
              description={(service as MainServiceData).showcaseDescription}
            />
          )}

          {/* Video Showcase (if present) */}
          {service.videoUrl && (
            <ServiceVideo
              serviceName={service.title}
              videoUrl={service.videoUrl}
              posterImage={service.videoPoster || service.heroImage || service.aboutImage}
            />
          )}
        </>
      )}

      {/* =========================================================================
          COMMON SECTIONS (Identical to Home Page — shared across ALL service pages)
         ========================================================================= */}

      {/* 3. OUR CORE ADVANTAGES — Why Corporate India Chooses Arrowline */}
      <WhyChooseUsSection />

      {/* 4. WORKFLOW SYNERGY — 6-Stage Process */}
      <ProcessSection />

      {/* 5. SPECIALIZED SECTOR LOGISTICS — Industries Preview */}
      <IndustriesPreviewBar
        onNavigateToIndustries={() => {
          if (onNavigateTo) {
            onNavigateTo("industries");
          } else {
            window.location.pathname = "/industries";
          }
        }}
      />

      {/* 6. WHAT OUR CLIENTS SAY — Testimonials */}
      <TestimonialsSection />

      {/* 8. SERVICE-SPECIFIC FAQ */}
      <ServiceFAQ
        serviceName={service.title}
        faqs={service.faqs || []}
      />

      {/* 9. RELATED SERVICES */}
      <ServiceRelated
        currentSlug={service.slug}
        isSubService={isSubService}
        parentService={parentService}
        siblingSubServices={siblingSubServices}
        otherMainServices={otherMainServices}
        onNavigateToService={onNavigateToService}
      />

      {/* 10. TRACK YOUR CARGO (Standard Pan-Site Section) */}
      <TrackTraceBar />

      {/* 11. FINAL HIGH-CONVERSION QUOTE CTA */}
      <ServiceCTA
        headline={
          service.ctaHeadline ||
          (isSubService
            ? `Move Your Cargo With Confidence`
            : `Move More Cargo Through Smarter ${service.title}`)
        }
        onOpenQuote={onOpenQuote}
      />
    </div>
  );
}
