import { useEffect } from "react";
import { MainServiceData, SubServiceData } from "../../data/servicesData";
import ServiceHero from "./ServiceHero";
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
  // Update browser document title and meta description dynamically
  useEffect(() => {
    const pageTitle = service.seoTitle || `${service.title} | Arrowline Logistics India`;
    document.title = pageTitle;

    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute("content", service.seoDesc || service.shortDesc || "");
    }
  }, [service]);

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
          isSubService
            ? `${(subServiceData?.parentName || "ARROWLINE").toUpperCase()} • SPECIALIZED SERVICE`
            : `${service.title.toUpperCase()} • PAN-INDIA`
        }
        headline={service.heroHeadline || service.title}
        subheadline={service.heroSubheadline}
        description={(service as any).heroDescription || service.heroSubheadline || service.shortDesc}
        image={service.heroImage || service.aboutImage || "/images/hero-logistics.jpg"}
        videoUrl={service.heroVideo || service.videoUrl}
        fallbackImage={service.heroFallbackImage || service.aboutImage}
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
            image={service.aboutImage || service.heroImage || "/images/hero-logistics.jpg"}
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
            image={service.aboutImage || service.heroImage || "/images/hero-logistics.jpg"}
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
                window.location.hash = `#/services/${mainServiceData?.slug || service.slug}/${subSlug}`;
              }
            }}
          />

          {/* Cargo / Applications */}
          <ServiceApplications
            serviceName={service.title}
            applications={service.applications || []}
          />

          {/* Image Gallery (if present) */}
          {service.gallery && service.gallery.length > 0 && (
            <ServiceGallery
              serviceName={service.title}
              items={service.gallery}
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
            window.location.hash = "#/industries";
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
