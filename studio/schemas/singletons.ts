import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "companyName", title: "Company name", type: "string", initialValue: "Arrowline Logistics" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "mediaImage" }),
    defineField({ name: "phone", title: "Primary phone", type: "string" }),
    defineField({ name: "altPhone", title: "Secondary phone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string" }),
    defineField({ name: "address", title: "Head office address", type: "text", rows: 3 }),
    defineField({ name: "socials", title: "Social links", type: "array", of: [defineArrayMember({ type: "link" })] }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo" }),
    defineField({ name: "googleAnalyticsId", title: "Google Analytics ID", type: "string" }),
    defineField({
      name: "announcementBanner",
      title: "Announcement banner",
      type: "reference",
      to: [{ type: "banner" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "header", title: "Header navigation", type: "array", of: [defineArrayMember({ type: "navItem" })] }),
    defineField({
      name: "footerColumns",
      title: "Footer columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Column title", type: "string" }),
            defineField({ name: "links", title: "Links", type: "array", of: [defineArrayMember({ type: "link" })] }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({ name: "legalLinks", title: "Legal links", type: "array", of: [defineArrayMember({ type: "link" })] }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({ name: "heroBadge", title: "Hero badge", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero headline", type: "string" }),
    defineField({ name: "heroSubheadline", title: "Hero subheadline", type: "text", rows: 2 }),
    defineField({ name: "heroImage", title: "Hero image", type: "mediaImage" }),
    defineField({ name: "heroVideo", title: "Hero video URL", type: "url" }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "cta" }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "cta" }),
    defineField({ name: "stats", title: "Statistics", type: "array", of: [defineArrayMember({ type: "statItem" })] }),
    defineField({ name: "servicesHeading", title: "Services heading", type: "string" }),
    defineField({ name: "whyChooseUsHeading", title: "Why-choose-us heading", type: "string" }),
    defineField({ name: "testimonialsHeading", title: "Testimonials heading", type: "string" }),
    defineField({ name: "faqHeading", title: "FAQ heading", type: "string" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({ name: "heroHeading", title: "Hero heading", type: "string" }),
    defineField({ name: "heroSubheading", title: "Hero subheading", type: "text", rows: 2 }),
    defineField({ name: "heroImage", title: "Hero image", type: "mediaImage" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 5 }),
    defineField({ name: "pillars", title: "Pillars", type: "array", of: [defineArrayMember({ type: "pillar" })] }),
    defineField({ name: "milestones", title: "Milestones", type: "array", of: [defineArrayMember({ type: "milestone" })] }),
    defineField({ name: "differentiators", title: "Differentiators", type: "array", of: [defineArrayMember({ type: "differentiator" })] }),
    defineField({ name: "leadershipHeading", title: "Leadership heading", type: "string" }),
    defineField({ name: "leaders", title: "Leadership", type: "array", of: [defineArrayMember({ type: "leader" })] }),
    defineField({ name: "coreValues", title: "Core values", type: "array", of: [defineArrayMember({ type: "coreValue" })] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services page",
  type: "document",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Services page" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({ name: "formHeading", title: "Form heading", type: "string" }),
    defineField({ name: "mapEmbedUrl", title: "Map embed URL", type: "url" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});

export const singletonTypes = [siteSettings, navigation, homePage, aboutPage, servicesPage, contactPage];

/** Names used by the desk structure + config to lock singletons down. */
export const SINGLETON_NAMES = singletonTypes.map((type) => type.name);
