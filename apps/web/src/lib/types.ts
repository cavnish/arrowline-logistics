import type { SanityImageValue } from "@/lib/sanity/image";

export interface SeoFields {
  title?: string | null;
  description?: string | null;
  keywords?: string[] | null;
  canonical?: string | null;
  ogImage?: SanityImageValue | null;
  noIndex?: boolean | null;
}

export interface LinkValue {
  label?: string;
  href?: string;
  openInNewTab?: boolean;
}

export interface ServiceSummary {
  _id: string;
  title: string;
  slug: string;
  category?: string | null;
  shortDescription?: string | null;
  icon?: string | null;
  heroImage?: SanityImageValue | null;
  seo?: SeoFields | null;
}

export interface ServiceDetail extends ServiceSummary {
  fullDescription?: string | null;
  heroVideo?: string | null;
  heroBadge?: string | null;
  heroHeadline?: string | null;
  heroSubheadline?: string | null;
  capabilities?: string[] | null;
  benefits?: string[] | null;
  aboutHeading?: string | null;
  aboutBody?: string | null;
  aboutImage?: SanityImageValue | null;
  processSteps?: Array<{ title?: string; subtitle?: string; description?: string; icon?: string; image?: SanityImageValue | null }> | null;
  showcase?: Array<{ title?: string; caption?: string; image?: SanityImageValue | null }> | null;
  cargoApplications?: Array<{ title?: string; description?: string; image?: SanityImageValue | null }> | null;
  faqs?: Array<{ question: string; answer: string }> | null;
  industries?: Array<{ _id: string; title: string; slug: string; icon?: string | null }> | null;
  parent?: { title?: string; slug?: string } | null;
}

export interface Testimonial {
  _id: string;
  customerName: string;
  company?: string | null;
  position?: string | null;
  testimonial: string;
  rating?: number | null;
  isVerified?: boolean | null;
  photo?: SanityImageValue | null;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category?: string | null;
}

export interface Industry {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  cargoTypes?: string[] | null;
  image?: SanityImageValue | null;
}

export interface GalleryItem {
  _id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  image: SanityImageValue;
}

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  author?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  coverImage?: SanityImageValue | null;
  category?: { title?: string; slug?: string } | null;
}

export interface CmsPage {
  _id: string;
  title: string;
  slug: string;
  body?: unknown[] | null;
  seo?: SeoFields | null;
}

export interface Navigation {
  header?: Array<{ label: string; href?: string; children?: LinkValue[] }> | null;
  footerColumns?: Array<{ title?: string; links?: LinkValue[] }> | null;
  legalLinks?: LinkValue[] | null;
}

export interface SiteSettings {
  companyName?: string | null;
  tagline?: string | null;
  logo?: SanityImageValue | null;
  phone?: string | null;
  altPhone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  socials?: LinkValue[] | null;
  announcement?: { title?: string; message?: string; link?: LinkValue } | null;
}
