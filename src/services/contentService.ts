import { supabase } from '../lib/supabaseClient';
import {
  getMainServiceBySlug as getStaticMainServiceBySlug,
  getSubServiceBySlug as getStaticSubServiceBySlug,
  getAllMainServices as getStaticAllMainServices,
  MainServiceData,
  SubServiceData,
} from '../data/servicesData';

// Types for our service data
export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  hero_image: string | null;
  hero_video: string | null;
  hero_fallback_image: string | null;
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

// Normalizes alias slugs like rail-multimodal-logistics -> rail-transportation
function normalizeSlug(slug: string): string {
  if (slug === 'rail-multimodal-logistics') return 'rail-transportation';
  return slug;
}

class ContentService {
  // Services
  async getServices(): Promise<Service[]> {
    if (!supabase) {
      console.warn('[ContentService] Supabase not configured, returning empty services array');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('display_order');

      if (error) {
        console.error('[ContentService] getServices error:', error);
        throw error;
      }
      return data || [];
    } catch (err) {
      console.error('[ContentService] getServices catch:', err);
      return [];
    }
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    if (!supabase) return null;

    const targetSlug = normalizeSlug(slug);

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', targetSlug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) {
        console.error(`[ContentService] getServiceBySlug(${slug}) error:`, error);
        return null;
      }
      return data || null;
    } catch (err) {
      console.error(`[ContentService] getServiceBySlug(${slug}) catch:`, err);
      return null;
    }
  }

  // Service Items (Sub-services)
  async getServiceItems(): Promise<ServiceItem[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .eq('is_published', true)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[ContentService] getServiceItems catch:', err);
      return [];
    }
  }

  async getServiceItemsByServiceSlug(serviceSlug: string): Promise<ServiceItem[]> {
    if (!supabase) return [];

    try {
      const service = await this.getServiceBySlug(serviceSlug);
      if (!service) return [];

      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .eq('is_published', true)
        .eq('service_id', service.id)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`[ContentService] getServiceItemsByServiceSlug(${serviceSlug}) catch:`, err);
      return [];
    }
  }

  async getServiceItemBySlug(serviceSlug: string, itemSlug: string): Promise<ServiceItem | null> {
    if (!supabase) return null;

    try {
      const service = await this.getServiceBySlug(serviceSlug);
      if (!service) return null;

      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .eq('slug', itemSlug)
        .eq('service_id', service.id)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      return data || null;
    } catch (err) {
      console.error(`[ContentService] getServiceItemBySlug(${serviceSlug}, ${itemSlug}) catch:`, err);
      return null;
    }
  }

  // FAQs
  async getServiceFAQs(serviceSlug: string): Promise<ServiceFAQ[]> {
    if (!supabase) return [];

    try {
      const service = await this.getServiceBySlug(serviceSlug);
      if (!service) return [];

      const { data, error } = await supabase
        .from('service_faqs')
        .select('*')
        .eq('is_published', true)
        .eq('service_id', service.id)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`[ContentService] getServiceFAQs(${serviceSlug}) catch:`, err);
      return [];
    }
  }

  async getServiceItemFAQs(serviceSlug: string, itemSlug: string): Promise<ServiceFAQ[]> {
    if (!supabase) return [];

    try {
      const item = await this.getServiceItemBySlug(serviceSlug, itemSlug);
      if (!item) return [];

      const { data, error } = await supabase
        .from('service_faqs')
        .select('*')
        .eq('is_published', true)
        .eq('service_item_id', item.id)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`[ContentService] getServiceItemFAQs(${serviceSlug}, ${itemSlug}) catch:`, err);
      return [];
    }
  }

  // Process Steps
  async getServiceProcessSteps(serviceSlug: string): Promise<ServiceProcessStep[]> {
    if (!supabase) return [];

    try {
      const service = await this.getServiceBySlug(serviceSlug);
      if (!service) return [];

      const { data, error } = await supabase
        .from('service_process_steps')
        .select('*')
        .eq('is_published', true)
        .eq('service_id', service.id)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`[ContentService] getServiceProcessSteps(${serviceSlug}) catch:`, err);
      return [];
    }
  }

  async getServiceItemProcessSteps(serviceSlug: string, itemSlug: string): Promise<ServiceProcessStep[]> {
    if (!supabase) return [];

    try {
      const item = await this.getServiceItemBySlug(serviceSlug, itemSlug);
      if (!item) return [];

      const { data, error } = await supabase
        .from('service_process_steps')
        .select('*')
        .eq('is_published', true)
        .eq('service_item_id', item.id)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`[ContentService] getServiceItemProcessSteps(${serviceSlug}, ${itemSlug}) catch:`, err);
      return [];
    }
  }

  // Industries
  async getIndustries(): Promise<Industry[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .eq('is_published', true)
        .order('display_order');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('[ContentService] getIndustries catch:', err);
      return [];
    }
  }

  async getServiceIndustries(serviceSlug: string): Promise<Industry[]> {
    if (!supabase) return [];

    try {
      const service = await this.getServiceBySlug(serviceSlug);
      if (!service) return [];

      const { data, error } = await supabase
        .from('service_industries')
        .select('industry_id, industries(*)')
        .eq('service_id', service.id);

      if (error) throw error;
      return data?.map((item: any) => item.industries).filter(Boolean) || [];
    } catch (err) {
      console.error(`[ContentService] getServiceIndustries(${serviceSlug}) catch:`, err);
      return [];
    }
  }

  async getServiceItemIndustries(serviceSlug: string, itemSlug: string): Promise<Industry[]> {
    if (!supabase) return [];

    try {
      const item = await this.getServiceItemBySlug(serviceSlug, itemSlug);
      if (!item) return [];

      const { data, error } = await supabase
        .from('service_item_industries')
        .select('industry_id, industries(*)')
        .eq('service_item_id', item.id);

      if (error) throw error;
      return data?.map((item: any) => item.industries).filter(Boolean) || [];
    } catch (err) {
      console.error(`[ContentService] getServiceItemIndustries(${serviceSlug}, ${itemSlug}) catch:`, err);
      return [];
    }
  }

  // Transforms a Supabase service record into MainServiceData format with static fallback
  async getServiceDetail(slug: string): Promise<MainServiceData | null> {
    const staticFallback = getStaticMainServiceBySlug(slug) || getStaticMainServiceBySlug(normalizeSlug(slug));

    try {
      const service = await this.getServiceBySlug(slug);
      if (!service) return staticFallback || null;

      const subItems = await this.getServiceItemsByServiceSlug(service.slug);

      // Convert sub-service items to SubServiceData
      const subServices: SubServiceData[] = subItems.map(item => this.mapItemToSubServiceData(item, service));

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
        heroImage: service.hero_image || staticFallback?.heroImage || '/images/hero-logistics.jpg',
        heroVideo: service.hero_video || staticFallback?.heroVideo,
        heroFallbackImage: service.hero_fallback_image || staticFallback?.heroFallbackImage,
        highlights: service.highlights || staticFallback?.highlights || [],
        aboutBadge: service.about_badge || staticFallback?.aboutBadge || 'ABOUT THIS SERVICE',
        aboutHeading: service.about_heading || staticFallback?.aboutHeading || `${service.title} Excellence`,
        aboutDescription: service.about_description || service.full_description || staticFallback?.aboutDescription || '',
        aboutBulletPoints: service.about_bullet_points || staticFallback?.aboutBulletPoints || [],
        aboutImage: service.about_image || staticFallback?.aboutImage || service.hero_image || '/images/hero-logistics.jpg',
        whyArrowline: service.why_arrowline || staticFallback?.whyArrowline || [],
        processSteps: service.process_steps || staticFallback?.processSteps || [],
        applications: service.applications || staticFallback?.applications || [],
        industries: service.industries || staticFallback?.industries || [],
        networkDescription: service.network_description || staticFallback?.networkDescription || '',
        faqs: service.faqs || staticFallback?.faqs || [],
        gallery: service.gallery || staticFallback?.gallery || [],
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

  // Transforms a Supabase service_item record into SubServiceData format with static fallback
  async getServiceItemDetail(serviceSlug: string, itemSlug: string): Promise<SubServiceData | null> {
    const staticFallback = getStaticSubServiceBySlug(serviceSlug, itemSlug) || getStaticSubServiceBySlug(normalizeSlug(serviceSlug), itemSlug);

    try {
      const service = await this.getServiceBySlug(serviceSlug);
      if (!service) return staticFallback || null;

      const item = await this.getServiceItemBySlug(service.slug, itemSlug);
      if (!item) return staticFallback || null;

      return this.mapItemToSubServiceData(item, service, staticFallback);
    } catch (err) {
      console.warn(`[ContentService] getServiceItemDetail(${serviceSlug}, ${itemSlug}) fallback to static:`, err);
      return staticFallback || null;
    }
  }

  private mapItemToSubServiceData(item: ServiceItem, parentService: Service, fallback?: SubServiceData): SubServiceData {
    return {
      id: item.id,
      slug: item.slug,
      parentSlug: parentService.slug,
      parentName: parentService.title,
      title: item.title,
      shortDesc: item.short_description || fallback?.shortDesc || '',
      heroHeadline: item.hero_headline || fallback?.heroHeadline || item.title,
      heroSubheadline: item.hero_subheadline || fallback?.heroSubheadline || item.short_description || '',
      heroBadge: item.hero_badge || fallback?.heroBadge || `${parentService.title.toUpperCase()} • SPECIALIZED SERVICE`,
      heroImage: item.hero_image || fallback?.heroImage || parentService.hero_image || '/images/hero-logistics.jpg',
      heroVideo: item.hero_video || fallback?.heroVideo,
      heroFallbackImage: item.hero_fallback_image || fallback?.heroFallbackImage,
      aboutBadge: item.about_badge || fallback?.aboutBadge || 'OPERATIONAL CAPABILITY',
      aboutHeading: item.about_heading || fallback?.aboutHeading || `${item.title} Built Around Your Cargo`,
      aboutDescription: item.about_description || item.full_description || fallback?.aboutDescription || '',
      aboutBulletPoints: item.about_bullet_points || fallback?.aboutBulletPoints || [],
      aboutImage: item.about_image || fallback?.aboutImage || item.hero_image || parentService.hero_image || '/images/hero-logistics.jpg',
      capabilities: Array.isArray(item.capabilities) ? item.capabilities : (fallback?.capabilities || []),
      whyArrowline: item.why_arrowline || fallback?.whyArrowline || [],
      processSteps: item.process_steps || fallback?.processSteps || [],
      applications: item.applications || fallback?.applications || [],
      industries: item.industries || fallback?.industries || [],
      faqs: item.faqs || fallback?.faqs || [],
      gallery: item.gallery || fallback?.gallery || [],
      videoUrl: item.video_url || fallback?.videoUrl,
      videoPoster: item.video_poster || fallback?.videoPoster,
      ctaHeadline: item.cta_headline || fallback?.ctaHeadline || "Ready to Coordinate Your Shipment?",
      seoTitle: item.seo_title || item.meta_title || fallback?.seoTitle || item.title,
      seoDescription: item.seo_desc || item.meta_description || fallback?.seoDescription || item.short_description || '',
      seoDesc: item.seo_desc || item.meta_description || fallback?.seoDesc || item.short_description || '',
      canonicalUrl: item.canonical_url || fallback?.canonicalUrl,
      isPublished: item.is_published,
      displayOrder: item.display_order,
      keywords: item.keywords || fallback?.keywords || [],
    };
  }
}

export const contentService = new ContentService();