import { defineArrayMember, defineField, defineType } from "sanity";

/** Rich image with a mandatory alt text (accessibility + SEO). */
export const mediaImage = defineType({
  name: "mediaImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for screen readers and search engines.",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "e.g. /services/road-transportation or https://example.com",
      validation: (r) => r.required(),
    }),
    defineField({ name: "openInNewTab", title: "Open in new tab", type: "boolean", initialValue: false }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "label", title: "Button label", type: "string" }),
    defineField({ name: "href", title: "Button URL", type: "string" }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: "title", title: "Meta title", type: "string", validation: (r) => r.max(70) }),
    defineField({ name: "description", title: "Meta description", type: "text", rows: 3, validation: (r) => r.max(170) }),
    defineField({ name: "keywords", title: "Keywords", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "canonical", title: "Canonical URL", type: "url" }),
    defineField({ name: "ogImage", title: "Social share image", type: "mediaImage" }),
    defineField({ name: "noIndex", title: "Hide from search engines", type: "boolean", initialValue: false }),
  ],
});

export const navItem = defineType({
  name: "navItem",
  title: "Navigation item",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "URL or path", type: "string" }),
    defineField({
      name: "children",
      title: "Children",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
  ],
});

export const processStep = defineType({
  name: "processStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "icon", title: "Icon name", type: "string" }),
    defineField({ name: "image", title: "Image", type: "mediaImage" }),
  ],
  preview: { select: { title: "title", subtitle: "subtitle", media: "image" } },
});

export const showcaseItem = defineType({
  name: "showcaseItem",
  title: "Showcase item",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "image", title: "Image", type: "mediaImage", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "caption", media: "image" } },
});

export const cargoApplication = defineType({
  name: "cargoApplication",
  title: "Cargo & application",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Image", type: "mediaImage" }),
  ],
  preview: { select: { title: "title", media: "image" } },
});

export const pillar = defineType({
  name: "pillar",
  title: "Pillar",
  type: "object",
  fields: [
    defineField({ name: "icon", title: "Icon name", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
    defineField({ name: "color", title: "Accent colour", type: "string", initialValue: "emerald" }),
  ],
  preview: { select: { title: "title", subtitle: "text" } },
});

export const milestone = defineType({
  name: "milestone",
  title: "Milestone",
  type: "object",
  fields: [
    defineField({ name: "year", title: "Year", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "year" } },
});

export const differentiator = defineType({
  name: "differentiator",
  title: "Differentiator",
  type: "object",
  fields: [
    defineField({ name: "icon", title: "Icon name", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
    defineField({ name: "accent", title: "Accent", type: "string", initialValue: "orange" }),
  ],
  preview: { select: { title: "title", subtitle: "text" } },
});

export const leader = defineType({
  name: "leader",
  title: "Leader",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({ name: "image", title: "Photo", type: "mediaImage" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

export const coreValue = defineType({
  name: "coreValue",
  title: "Core value",
  type: "object",
  fields: [
    defineField({ name: "icon", title: "Icon name", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

export const statItem = defineType({
  name: "statItem",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "icon", title: "Icon name", type: "string" }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

/** Reusable long-form body (blog posts, CMS pages). */
export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({ type: "block" }),
    defineArrayMember({ type: "mediaImage" }),
  ],
});

export const objectTypes = [
  mediaImage,
  link,
  cta,
  seo,
  navItem,
  processStep,
  showcaseItem,
  cargoApplication,
  pillar,
  milestone,
  differentiator,
  leader,
  coreValue,
  statItem,
  portableText,
];
