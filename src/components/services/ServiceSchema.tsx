import React, { useEffect } from "react";
import { MainServiceData, SubServiceData } from "../../data/servicesData";
import { COMPANY_DETAILS } from "../../data/logisticsData";

interface ServiceSchemaProps {
  service: MainServiceData | SubServiceData;
  isSubService?: boolean;
  parentService?: MainServiceData;
  canonicalUrl?: string;
}

export default function ServiceSchema({
  service,
  isSubService = false,
  parentService,
  canonicalUrl,
}: ServiceSchemaProps) {
  useEffect(() => {
    const siteUrl = "https://www.arrowlinelogistics.in";
    const pageUrl = canonicalUrl || `${siteUrl}/#/services/${
      isSubService ? `${parentService?.slug || (service as SubServiceData).parentSlug}/${service.slug}` : service.slug
    }`;

    // 1. Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "LogisticsService",
      "name": "Arrowline Logistics",
      "legalName": "Arrowline Logistics Private Limited",
      "url": siteUrl,
      "logo": `${siteUrl}/images/arrowline-logo.png`,
      "image": `${siteUrl}/images/hero-logistics.jpg`,
      "description": COMPANY_DETAILS.aboutShort,
      "telephone": COMPANY_DETAILS.phone,
      "email": COMPANY_DETAILS.primaryEmail,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office 204, Portview Commercial Complex, Near Adani House, Mundra Port Road",
        "addressLocality": "Mundra",
        "addressRegion": "Gujarat",
        "postalCode": "370421",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.8394,
        "longitude": 69.7258
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "knowsAbout": [
        "Multimodal Freight Transportation",
        "Container Trucking",
        "Full Truckload Haulage",
        "Rail Logistics",
        "ODC and Heavy Lift Cargo",
        "Mundra Port Customs Clearance",
        "Industrial Warehousing"
      ]
    };

    // 2. Service Schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.title,
      "serviceType": isSubService ? `${parentService?.title || "Logistics"} Sub-Service` : "Core Logistics Service",
      "description": service.shortDesc || service.aboutDescription,
      "provider": {
        "@type": "LogisticsService",
        "name": "Arrowline Logistics",
        "url": siteUrl,
        "telephone": COMPANY_DETAILS.phone
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "url": pageUrl,
      "termsOfService": `${siteUrl}/#/contact`,
      "serviceAudience": {
        "@type": "Audience",
        "audienceType": "Industrial Manufacturers, Exporters, Importers, EPC Contractors, Infrastructure Developers"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${service.title} Solutions`,
        "itemListElement": isSubService
          ? (service as SubServiceData).capabilities?.map((cap, idx) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": cap.title,
                "description": cap.desc
              },
              "position": idx + 1
            })) || []
          : (service as MainServiceData).subServices?.map((sub, idx) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": sub.title,
                "description": sub.shortDesc,
                "url": `${siteUrl}/#/services/${service.slug}/${sub.slug}`
              },
              "position": idx + 1
            })) || []
      }
    };

    // 3. BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": isSubService
        ? [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${siteUrl}/#/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Services",
              "item": `${siteUrl}/#/services`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": parentService?.title || (service as SubServiceData).parentName || "Service",
              "item": `${siteUrl}/#/services/${parentService?.slug || (service as SubServiceData).parentSlug}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": service.title,
              "item": pageUrl
            }
          ]
        : [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${siteUrl}/#/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Services",
              "item": `${siteUrl}/#/services`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": service.title,
              "item": pageUrl
            }
          ]
    };

    // 4. FAQPage Schema (if FAQs are present)
    const faqSchema = service.faqs && service.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": service.faqs.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          }))
        }
      : null;

    // Inject Script into DOM
    const scriptId = "arrowline-service-schema";
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = scriptId;
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    const schemasToInject = [organizationSchema, serviceSchema, breadcrumbSchema];
    if (faqSchema) {
      schemasToInject.push(faqSchema);
    }

    scriptTag.text = JSON.stringify(schemasToInject);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.remove();
      }
    };
  }, [service, isSubService, parentService, canonicalUrl]);

  return null;
}
