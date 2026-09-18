import { useEffect } from "react";
import { MainServiceData, SubServiceData } from "../../data/servicesData";
import { COMPANY_DETAILS } from "../../data/logisticsData";
import { SITE_URL } from "../../utils/navigation";

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
    const pageUrl = canonicalUrl || `${SITE_URL}/services/${
      isSubService ? `${parentService?.slug || (service as SubServiceData).parentSlug}/${service.slug}` : service.slug
    }`;

    // 1. Service Schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.title,
      "serviceType": isSubService ? `${parentService?.title || "Logistics"} Sub-Service` : "Core Logistics Service",
      "description": service.shortDesc || service.aboutDescription,
      "provider": {
        "@type": "Organization",
        "name": COMPANY_DETAILS.name,
        "url": SITE_URL,
        "telephone": COMPANY_DETAILS.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Office 204, Portview Commercial Complex, Near Adani House, Mundra Port Road",
          "addressLocality": "Mundra",
          "addressRegion": "Gujarat",
          "postalCode": "370421",
          "addressCountry": "IN"
        }
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "url": pageUrl,
      "termsOfService": `${SITE_URL}/contact`,
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
                "url": `${SITE_URL}/services/${service.slug}/${sub.slug}`
              },
              "position": idx + 1
            })) || []
      }
    };

    // 2. BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": isSubService
        ? [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${SITE_URL}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Services",
              "item": `${SITE_URL}/services`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": parentService?.title || (service as SubServiceData).parentName || "Service",
              "item": `${SITE_URL}/services/${parentService?.slug || (service as SubServiceData).parentSlug}`
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
              "item": `${SITE_URL}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Services",
              "item": `${SITE_URL}/services`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": service.title,
              "item": pageUrl
            }
          ]
    };

    // 3. FAQPage Schema (if FAQs are present)
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

    const schemasToInject: object[] = [serviceSchema, breadcrumbSchema];
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