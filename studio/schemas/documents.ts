import { defineArrayMember, defineField, defineType } from "sanity";

const slugField = (source = "title") =>
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: { source, maxLength: 96 },
    validation: (r) => r.required(),
  });

const orderField = defineField({
  name: "order",
  title: "Display order",
  type: "number",
  initialValue: 0,
});

const publishedField = defineField({
  name: "isPublished",
  title: "Published",
  type: "boolean",
  initialValue: true,
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({
      name: "parent",
      title: "Parent service",
      type: "reference",
      to: [{ type: "service" }],
      description: "Leave empty for a main service; set it to make this a sub-service.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["road", "rail", "project-cargo", "warehousing", "other"] },
    }),
    orderField,
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 2 }),
    defineField({ name: "fullDescription", title: "Full description", type: "text", rows: 5 }),
    defineField({ name: "icon", title: "Icon name", type: "string" }),
    defineField({ name: "heroMedia", title: "Hero image", type: "mediaImage" }),
    defineField({ name: "heroVideo", title: "Hero video URL", type: "url" }),
    defineField({ name: "heroBadge", title: "Hero badge", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero headline", type: "string" }),
    defineField({ name: "heroSubheadline", title: "Hero subheadline", type: "string" }),
    defineField({ name: "capabilities", title: "Capabilities", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "benefits", title: "Benefits", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "aboutHeading", title: "About heading", type: "string" }),
    defineField({ name: "aboutBody", title: "About body", type: "text", rows: 4 }),
    defineField({ name: "aboutImage", title: "About image", type: "mediaImage" }),
    defineField({ name: "processSteps", title: "Process steps", type: "array", of: [defineArrayMember({ type: "processStep" })] }),
    defineField({ name: "showcase", title: "Visual showcase", type: "array", of: [defineArrayMember({ type: "showcaseItem" })] }),
    defineField({ name: "cargoApplications", title: "Cargo & applications", type: "array", of: [defineArrayMember({ type: "cargoApplication" })] }),
    defineField({ name: "faqs", title: "FAQs", type: "array", of: [defineArrayMember({ type: "faqItem" })] }),
    defineField({
      name: "industries",
      title: "Industries",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "industry" }] })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    publishedField,
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "category" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `Service · ${subtitle}` : "Service" }),
  },
});

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "icon", title: "Icon name", type: "string" }),
    defineField({ name: "cargoTypes", title: "Cargo types", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "image", title: "Image", type: "mediaImage" }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "title", media: "image" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "customerName", title: "Customer name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", title: "Company", type: "string" }),
    defineField({ name: "position", title: "Position", type: "string" }),
    defineField({ name: "testimonial", title: "Testimonial", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "photo", title: "Photo", type: "mediaImage" }),
    defineField({ name: "rating", title: "Rating (1-5)", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "isVerified", title: "Verified", type: "boolean", initialValue: true }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "customerName", subtitle: "company", media: "photo" } },
});

export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client / trusted-network logo",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", title: "Logo", type: "mediaImage" }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "website", title: "Website", type: "url" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "isFeatured", title: "Featured", type: "boolean", initialValue: false }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "name", subtitle: "category", media: "logo" } },
});

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question" } },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "category", title: "Category", type: "string" }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "question", subtitle: "category" } },
});

export const statistic = defineType({
  name: "statistic",
  title: "Statistic",
  type: "document",
  fields: [
    defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "icon", title: "Icon name", type: "string" }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "image", title: "Image", type: "mediaImage", validation: (r) => r.required() }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});

export const blogCategory = defineType({
  name: "blogCategory",
  title: "Blog category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    publishedField,
  ],
  preview: { select: { title: "title" } },
});

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "blogCategory" }] }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "coverImage", title: "Cover image", type: "mediaImage" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Body", type: "portableText" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "title", subtitle: "author", media: "coverImage" } },
});

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "clientName", title: "Client name", type: "string" }),
    defineField({ name: "industry", title: "Industry", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "challenge", title: "Challenge", type: "text", rows: 3 }),
    defineField({ name: "solution", title: "Solution", type: "text", rows: 3 }),
    defineField({ name: "results", title: "Results", type: "text", rows: 3 }),
    defineField({ name: "coverImage", title: "Cover image", type: "mediaImage" }),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [defineArrayMember({ type: "mediaImage" })] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "title", subtitle: "clientName", media: "coverImage" } },
});

export const socialVideo = defineType({
  name: "socialVideo",
  title: "Social video",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "videoUrl", title: "Video URL", type: "url" }),
    defineField({ name: "embedUrl", title: "Embed URL", type: "url" }),
    defineField({ name: "thumbnail", title: "Thumbnail", type: "mediaImage" }),
    defineField({ name: "platform", title: "Platform", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "title", subtitle: "platform", media: "thumbnail" } },
});

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    slugField("name"),
    defineField({ name: "state", title: "State", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 3 }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Image", type: "mediaImage" }),
    defineField({ name: "mapUrl", title: "Map URL", type: "url" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    orderField,
    publishedField,
  ],
  preview: { select: { title: "name", subtitle: "city" } },
});

export const banner = defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Internal title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "message", title: "Message", type: "string" }),
    defineField({ name: "link", title: "Link", type: "link" }),
    defineField({ name: "active", title: "Active", type: "boolean", initialValue: true }),
    defineField({ name: "startsAt", title: "Starts at", type: "datetime" }),
    defineField({ name: "endsAt", title: "Ends at", type: "datetime" }),
    orderField,
  ],
  preview: { select: { title: "title", subtitle: "message" } },
});

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "body", title: "Body", type: "portableText" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    publishedField,
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

export const documentTypes = [
  service,
  industry,
  testimonial,
  clientLogo,
  faq,
  faqItem,
  statistic,
  galleryImage,
  blogCategory,
  blogPost,
  caseStudy,
  socialVideo,
  location,
  banner,
  page,
];
