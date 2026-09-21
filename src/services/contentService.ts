import {
  getMainServiceBySlug as getStaticMainServiceBySlug,
  getSubServiceBySlug as getStaticSubServiceBySlug,
  MainServiceData,
  SubServiceData,
} from '../data/servicesData';

// Types for our service data (mirrors the Express public API, which is the
// single source of truth for the browser — no direct Supabase reads).
export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  hero_image: string | null;
  hero_video: string | null;
  hero_fallback_image: string | null;
  image_alt?: string | null;
  image_public_id?: string | null;
  is_published: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  capabilities: any;
  benefits: any;
  category?: string | null;
  key_capability?: string | null;
  hero_badge?: string | null;
  hero_headline?: string | null;
  hero_subheadline?: string | null;
  hero_description?: string | null;
  highlights?: any;
  about_badge?: string | null;
  about_heading?: string | null;
  about_description?: string | null;
  about_bullet_points?: any;
  about_image?: string | null;
  why_arrowline?: any;
  process_steps?: any;
  applications?: any;
  industries?: any;
  network_description?: string | null;
  faqs?: any;
  gallery?: any;
  video_url?: string | null;
  video_poster?: string | null;
  cta_headline?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  seo_title?: string | null;
  seo_desc?: string | null;
  showcase_heading?: string | null;
  showcase_description?: string | null;
  cargo_heading?: string | null;
  cargo_description?: string | null;
  showcaseItems?: any[] | null;
  cargoApplications?: any[] | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  service_id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  hero_image: string | null;
  hero_video: string | null;
  hero_fallback_image: string | null;
  image_alt?: string | null;
  image_public_id?: string | null;
  is_published: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  capabilities: any;
  benefits: any;
  parent_slug?: string | null;
  parent_name?: string | null;
  hero_badge?: string | null;
  hero_headline?: string | null;
  hero_subheadline?: string | null;
  about_badge?: string | null;
  about_heading?: string | null;
  about_description?: string | null;
  about_bullet_points?: any;
  about_image?: string | null;
  why_arrowline?: any;
  process_steps?: any;
  applications?: any;
  industries?: any;
  faqs?: any;
  gallery?: any;
  video_url?: string | null;
  video_poster?: string | null;
  cta_headline?: string | null;
  seo_title?: string | null;
  seo_desc?: string | null;
  keywords?: any;
  showcase_heading?: string | null;
  showcase_description?: string | null;
  cargo_heading?: string | null;
  cargo_description?: string | null;
  showcaseItems?: any[] | null;
  cargoApplications?: any[] | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceFAQ {
  id: string;
  service_id: string | null;
  service_item_id: string | null;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceProcessStep {
  id: string;
  service_id: string | null;
  service_item_id: string | null;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string | null;
  image: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Industry {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  cargo_types: string[];
  image: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const API_URL = String((import.meta as any).env?.VITE_API_URL || "").trim().replace(/\/$/, "");

// Single API helper for all public reads. Same-origin in production when
// VITE_API_URL is unset (frontend is served by the same Express process).
// Static fallbacks kick in on any API failure, so this helper is tuned to
// fail fast: a short timeout plus an immediate content-type check avoids
// wasting time parsing an SPA-fallback HTML document as JSON when the API
// (or a VITE_API_URL) is not actually serving this route.
async function apiGet(path: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error(`API returned non-JSON content (${contentType || "unknown"})`);
    }
    const body = await response.json();
    return body?.data ?? null;
  } finally {
    clearTimeout(timeout);
  }
}

// Normalizes alias slugs like rail-multimodal-logistics -> rail-transportation
function normalizeSlug(slug: string): string {
  if (slug === 'rail-multimodal-logistics') return 'rail-transportation';
  return slug;
}

// DB columns default to empty arrays/strings which are truthy and would
// otherwise suppress the static fallback content. Treat empty values as absent.
function pickValue(value: any, fallback: any): any {
  if (value === null || value === undefined || value === '') return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}

// The public API attaches the parent service to sub-service responses.
function toParent(partial: any): { slug: string; title: string } {
  return { slug: partial?.slug || '', title: partial?.title || '' };
}

// Relational Visual Showcase rows (service_visual_showcase) take priority over
// the legacy JSONB gallery. Returns rows shaped for ServiceGallery.
function resolveShowcase(record: any, fallbackGallery: any, serviceName: string): any[] {
  const rows = Array.isArray(record?.showcaseItems) && record.showcaseItems.length > 0
    ? record.showcaseItems
    : null;
  if (rows) {
    return rows.map((row: any) => ({
      id: row.id,
      url: row.image_url,
      title: row.title || `${serviceName} operations`,
      caption: row.caption || undefined,
      alt_text: row.alt_text || undefined,
    }));
  }
  return pickValue(record?.gallery, fallbackGallery) || [];
}

// Relational Cargo & Applications rows (service_cargo_applications) take
// priority over the legacy JSONB applications. Returns rows shaped for
// ServiceApplications.
function resolveCargo(record: any, fallbackApplications: any): any[] {
  const rows = Array.isArray(record?.cargoApplications) && record.cargoApplications.length > 0
    ? record.cargoApplications
    : null;
  if (rows) {
    return rows.map((row: any) => ({
      title: row.title,
      desc: row.description || '',
      image: row.image_url || 'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg',
      alt_text: row.alt_text || undefined,
    }));
  }
  return pickValue(record?.applications, fallbackApplications) || [];
}

class ContentService {
  // Services
  async getServices(): Promise<Service[]> {
    try {
      const data = await apiGet('/api/services');
      return Array.isArray(data) ? (data as Service[]) : [];
    } catch (err) {
      console.error('[ContentService] getServices error:', err);
      return [];
    }
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const targetSlug = normalizeSlug(slug);
    try {
      const data = await apiGet(`/api/services/${encodeURIComponent(targetSlug)}`);
      return data ? (data as Service) : null;
    } catch (err) {
      console.error(`[ContentService] getServiceBySlug(${slug}) error:`, err);
      return null;
    }
  }

  // Service Items (Sub-services)
  async getServiceItems(): Promise<ServiceItem[]> {
    try {
      const data = await apiGet('/api/service-items');
      return Array.isArray(data) ? (data as ServiceItem[]) : [];
    } catch (err) {
      console.error('[ContentService] getServiceItems error:', err);
      return [];
    }
  }

  async getServiceItemsByServiceSlug(serviceSlug: string): Promise<ServiceItem[]> {
    try {
      // /api/services/:slug embeds its published sub-services.
      const data = await apiGet(`/api/services/${encodeURIComponent(normalizeSlug(serviceSlug))}`);
      if (!data) return [];
      const subItems = (data as any).subServices;
      return Array.isArray(subItems) ? (subItems as ServiceItem[]) : [];
    } catch (err) {
      console.error(`[ContentService] getServiceItemsByServiceSlug(${serviceSlug}) error:`, err);
      return [];
    }
  }

  async getServiceItemBySlug(serviceSlug: string, itemSlug: string): Promise<ServiceItem | null> {
    try {
      const data = await apiGet(
        `/api/services/${encodeURIComponent(normalizeSlug(serviceSlug))}/${encodeURIComponent(itemSlug)}`
      );
      if (!data) return null;
      const item = { ...data } as ServiceItem;
      item.parent_slug = toParent(data.parentService).slug;
      item.parent_name = toParent(data.parentService).title;
      return item;
    } catch (err) {
      console.error(`[ContentService] getServiceItemBySlug(${serviceSlug}, ${itemSlug}) error:`, err);
      return null;
    }
  }

  // Industries
  async getIndustries(): Promise<Industry[]> {
    try {
      const data = await apiGet('/api/industries');
      return Array.isArray(data) ? (data as Industry[]) : [];
    } catch (err) {
      console.error('[ContentService] getIndustries error:', err);
      return [];
    }
  }

  // Leadership team
  async getLeadership(): Promise<any[]> {
    try {
      const data = await apiGet('/api/leadership');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[ContentService] getLeadership error:', err);
      return [];
    }
  }

  // Core values
  async getCoreValues(): Promise<any[]> {
    try {
      const data = await apiGet('/api/core-values');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('[ContentService] getCoreValues error:', err);
      return [];
    }
  }

  // About page (consolidated CMS payload from /api/about)
  async getAbout(): Promise<any | null> {
    try {
      const data = await apiGet('/api/about');
      if (!data || typeof data !== 'object') return null;
      return {
        siteContent: data.siteContent || {},
        images: Array.isArray(data.images) ? data.images : [],
        pillars: Array.isArray(data.pillars) ? data.pillars : [],
        milestones: Array.isArray(data.milestones) ? data.milestones : [],
        differentiators: Array.isArray(data.differentiators) ? data.differentiators : [],
      };
    } catch (err) {
      console.error('[ContentService] getAbout error:', err);
      return null;
    }
  }

  // Transforms a service record into MainServiceData format with static fallback
  async getServiceDetail(slug: string): Promise<MainServiceData | null> {
    const staticFallback = getStaticMainServiceBySlug(slug) || getStaticMainServiceBySlug(normalizeSlug(slug));

    try {
      const service = await this.getServiceBySlug(slug);
      if (!service) return staticFallback || null;

      const subItems: ServiceItem[] = (service as any).subServices || [];
      const subServices: SubServiceData[] = subItems.map(item => this.mapItemToSubServiceData(item, toParent(service)));

      return {
        id: service.id,
        slug: service.slug,
        title: service.title,
        shortDesc: service.short_description || staticFallback?.shortDesc || '',
        category: service.category || staticFallback?.category || 'LOGISTICS VERTICAL',
        keyCapability: service.key_capability || staticFallback?.keyCapability || '',
        heroBadge: service.hero_badge || staticFallback?.heroBadge || 'ARROWLINE CORE VERTICAL',
        heroHeadline: service.hero_headline || staticFallback?.heroHeadline || service.title,
        heroSubheadline: service.hero_subheadline || staticFallback?.heroSubheadline || service.short_description || '',
        heroDescription: service.hero_description || service.full_description || staticFallback?.heroDescription || '',
        heroImage: service.hero_image || staticFallback?.heroImage || 'https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg',
        heroVideo: service.hero_video || staticFallback?.heroVideo,
        heroFallbackImage: service.hero_fallback_image || staticFallback?.heroFallbackImage,
        imageAlt: service.image_alt || staticFallback?.imageAlt || '',
        highlights: pickValue(service.highlights, staticFallback?.highlights) || [],
        aboutBadge: service.about_badge || staticFallback?.aboutBadge || 'ABOUT THIS SERVICE',
        aboutHeading: service.about_heading || staticFallback?.aboutHeading || `${service.title} Excellence`,
        aboutDescription: service.about_description || service.full_description || staticFallback?.aboutDescription || '',
        aboutBulletPoints: pickValue(service.about_bullet_points, staticFallback?.aboutBulletPoints) || [],
        aboutImage: service.about_image || staticFallback?.aboutImage || service.hero_image || 'https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg',
        whyArrowline: pickValue(service.why_arrowline, staticFallback?.whyArrowline) || [],
        processSteps: pickValue(service.process_steps, staticFallback?.processSteps) || [],
        applications: resolveCargo(service, staticFallback?.applications),
        industries: pickValue(service.industries, staticFallback?.industries) || [],
        networkDescription: service.network_description || staticFallback?.networkDescription || '',
        faqs: pickValue(service.faqs, staticFallback?.faqs) || [],
        gallery: resolveShowcase(service, staticFallback?.gallery, service.title),
        showcaseHeading: service.showcase_heading || `${service.title} in Action`,
        showcaseDescription: service.showcase_description || "Real-world fleet operations, port handling, terminal staging, and heavy transport execution.",
        cargoHeading: service.cargo_heading || "What We Transport & Handle",
        cargoDescription: service.cargo_description || `Specialized handling protocols configured specifically for ${service.title.toLowerCase()} cargo profiles.`,
        videoUrl: service.video_url || staticFallback?.videoUrl,
        videoPoster: service.video_poster || staticFallback?.videoPoster,
        ctaHeadline: service.cta_headline || staticFallback?.ctaHeadline || "Ready to Streamline Your Freight?",
        seoTitle: service.seo_title || service.meta_title || staticFallback?.seoTitle || service.title,
        seoDesc: service.seo_desc || service.meta_description || staticFallback?.seoDesc || service.short_description || '',
        canonicalUrl: service.canonical_url || staticFallback?.canonicalUrl,
        isPublished: service.is_published,
        displayOrder: service.display_order,
        subServices: subServices.length > 0 ? subServices : (staticFallback?.subServices || []),
      };
    } catch (err) {
      console.warn(`[ContentService] getServiceDetail(${slug}) fallback to static:`, err);
      return staticFallback || null;
    }
  }

  // Transforms a service_item record into SubServiceData format with static fallback
  async getServiceItemDetail(serviceSlug: string, itemSlug: string): Promise<SubServiceData | null> {
    const staticFallback = getStaticSubServiceBySlug(serviceSlug, itemSlug) || getStaticSubServiceBySlug(normalizeSlug(serviceSlug), itemSlug);

    try {
      const item = await this.getServiceItemBySlug(serviceSlug, itemSlug);
      if (!item) return staticFallback || null;
      return this.mapItemToSubServiceData(item, toParent({ slug: item.parent_slug, title: item.parent_name }), staticFallback);
    } catch (err) {
      console.warn(`[ContentService] getServiceItemDetail(${serviceSlug}, ${itemSlug}) fallback to static:`, err);
      return staticFallback || null;
    }
  }

  private mapItemToSubServiceData(item: ServiceItem, parentService: { slug: string; title: string }, fallback?: SubServiceData): SubServiceData {
    return {
      id: item.id,
      slug: item.slug,
      parentSlug: parentService.slug || item.parent_slug || '',
      parentName: parentService.title || item.parent_name || '',
      title: item.title,
      shortDesc: item.short_description || fallback?.shortDesc || '',
      heroHeadline: item.hero_headline || fallback?.heroHeadline || item.title,
      heroSubheadline: item.hero_subheadline || fallback?.heroSubheadline || item.short_description || '',
      heroBadge: item.hero_badge || fallback?.heroBadge || `${(parentService.title || 'Service').toUpperCase()} • SPECIALIZED SERVICE`,
      heroImage: item.hero_image || fallback?.heroImage || 'https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg',
      heroVideo: item.hero_video || fallback?.heroVideo,
      heroFallbackImage: item.hero_fallback_image || fallback?.heroFallbackImage,
      imageAlt: item.image_alt || fallback?.imageAlt || '',
      aboutBadge: item.about_badge || fallback?.aboutBadge || 'OPERATIONAL CAPABILITY',
      aboutHeading: item.about_heading || fallback?.aboutHeading || `${item.title} Built Around Your Cargo`,
      aboutDescription: item.about_description || item.full_description || fallback?.aboutDescription || '',
      aboutBulletPoints: pickValue(item.about_bullet_points, fallback?.aboutBulletPoints) || [],
      aboutImage: item.about_image || fallback?.aboutImage || item.hero_image || 'https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg',
      capabilities: Array.isArray(item.capabilities) && item.capabilities.length > 0 ? item.capabilities : (fallback?.capabilities || []),
      whyArrowline: pickValue(item.why_arrowline, fallback?.whyArrowline) || [],
      processSteps: pickValue(item.process_steps, fallback?.processSteps) || [],
      applications: resolveCargo(item, fallback?.applications),
      industries: pickValue(item.industries, fallback?.industries) || [],
      faqs: pickValue(item.faqs, fallback?.faqs) || [],
      gallery: resolveShowcase(item, fallback?.gallery, item.title),
      showcaseHeading: item.showcase_heading || `${item.title} in Action`,
      showcaseDescription: item.showcase_description || "Real-world fleet operations, port handling, terminal staging, and heavy transport execution.",
      cargoHeading: item.cargo_heading || "What We Transport & Handle",
      cargoDescription: item.cargo_description || `Specialized handling protocols configured specifically for ${item.title.toLowerCase()} cargo profiles.`,
      videoUrl: item.video_url || fallback?.videoUrl,
      videoPoster: item.video_poster || fallback?.videoPoster,
      ctaHeadline: item.cta_headline || fallback?.ctaHeadline || "Ready to Coordinate Your Shipment?",
      seoTitle: item.seo_title || item.meta_title || fallback?.seoTitle || item.title,
      seoDesc: item.seo_desc || item.meta_description || fallback?.seoDesc || item.short_description || '',
      canonicalUrl: item.canonical_url || fallback?.canonicalUrl,
      isPublished: item.is_published,
      displayOrder: item.display_order,
    };
  }
}

export const contentService = new ContentService();