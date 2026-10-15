// Central GROQ queries. Keep them small and explicit so the shape is easy to
// reason about on the component side.

const IMAGE = `{ ..., "url": asset->url }`;

export const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  companyName, tagline,
  "logo": logo${IMAGE},
  phone, altPhone, email, whatsapp, address,
  socials[]{ label, href, openInNewTab },
  "announcement": announcementBanner->{ title, message, link }
}`;

export const navigationQuery = /* groq */ `*[_type == "navigation"][0]{
  header[]{ label, href, children[]{ label, href, openInNewTab } },
  footerColumns[]{ title, links[]{ label, href, openInNewTab } },
  legalLinks[]{ label, href }
}`;

export const homePageQuery = /* groq */ `*[_type == "homePage"][0]{
  heroBadge, heroHeadline, heroSubheadline,
  "heroImage": heroImage${IMAGE},
  heroVideo, primaryCta, secondaryCta,
  stats[]{ value, label, description, icon },
  servicesHeading, whyChooseUsHeading, testimonialsHeading, faqHeading,
  "seo": seo{ title, description, keywords, canonical, "ogImage": ogImage${IMAGE}, noIndex }
}`;

export const aboutPageQuery = /* groq */ `*[_type == "aboutPage"][0]{
  heroHeading, heroSubheading,
  "heroImage": heroImage${IMAGE},
  intro,
  pillars[]{ icon, title, text, color },
  milestones[]{ year, title, text },
  differentiators[]{ icon, title, text, accent },
  leadershipHeading,
  leaders[]{ name, role, location, email, bio, "image": image${IMAGE} },
  coreValues[]{ icon, title, description },
  "seo": seo{ title, description, keywords, canonical, "ogImage": ogImage${IMAGE}, noIndex }
}`;

export const servicesPageQuery = /* groq */ `*[_type == "servicesPage"][0]{
  heading, intro, "seo": seo{ title, description, keywords, canonical, "ogImage": ogImage${IMAGE}, noIndex }
}`;

export const contactPageQuery = /* groq */ `*[_type == "contactPage"][0]{
  heading, intro, formHeading, mapEmbedUrl,
  "seo": seo{ title, description, keywords, canonical, "ogImage": ogImage${IMAGE}, noIndex }
}`;

/** Main services (no parent). */
export const servicesQuery = /* groq */ `*[_type == "service" && !defined(parent) && isPublished != false] | order(order asc){
  _id, title, "slug": slug.current, category, shortDescription, icon,
  "heroImage": heroImage${IMAGE},
  "seo": seo{ title, description, canonical, "ogImage": ogImage${IMAGE}, noIndex }
}`;

/** Every service slug + parent slug, for generateStaticParams. */
export const serviceParamsQuery = /* groq */ `*[_type == "service" && defined(slug.current) && isPublished != false]{
  "slug": slug.current,
  "parent": parent->slug.current
}`;

export const serviceBySlugQuery = /* groq */ `*[_type == "service" && slug.current == $slug && isPublished != false][0]{
  _id, title, "slug": slug.current, category,
  shortDescription, fullDescription, icon,
  "heroImage": heroImage${IMAGE}, heroVideo, heroBadge, heroHeadline, heroSubheadline,
  capabilities, benefits,
  aboutHeading, aboutBody, "aboutImage": aboutImage${IMAGE},
  processSteps[]{ title, subtitle, description, icon, "image": image${IMAGE} },
  showcase[]{ title, caption, "image": image${IMAGE} },
  cargoApplications[]{ title, description, "image": image${IMAGE} },
  faqs[]{ question, answer },
  industries[]->{ _id, title, "slug": slug.current, icon },
  "seo": seo{ title, description, keywords, canonical, "ogImage": ogImage${IMAGE}, noIndex },
  "parent": parent->{ title, "slug": slug.current }
}`;

export const subServiceQuery = /* groq */ `*[_type == "service" && slug.current == $subSlug && parent->slug.current == $parentSlug && isPublished != false][0]{
  _id, title, "slug": slug.current, category,
  shortDescription, fullDescription, icon,
  "heroImage": heroImage${IMAGE}, heroVideo, heroBadge, heroHeadline, heroSubheadline,
  capabilities, benefits,
  aboutHeading, aboutBody, "aboutImage": aboutImage${IMAGE},
  processSteps[]{ title, subtitle, description, icon, "image": image${IMAGE} },
  showcase[]{ title, caption, "image": image${IMAGE} },
  cargoApplications[]{ title, description, "image": image${IMAGE} },
  faqs[]{ question, answer },
  "seo": seo{ title, description, keywords, canonical, "ogImage": ogImage${IMAGE}, noIndex },
  "parent": parent->{ title, "slug": slug.current }
}`;

export const serviceSlugsByParentQuery = /* groq */ `*[_type == "service" && parent->slug.current == $parentSlug && defined(slug.current)]{ "slug": slug.current }`;

export const industriesQuery = /* groq */ `*[_type == "industry" && isPublished != false] | order(order asc){
  _id, title, "slug": slug.current, description, icon, cargoTypes,
  "image": image${IMAGE}
}`;

export const testimonialsQuery = /* groq */ `*[_type == "testimonial" && isPublished != false] | order(order asc){
  _id, customerName, company, position, testimonial, rating, isVerified,
  "photo": photo${IMAGE}
}`;

export const faqsQuery = /* groq */ `*[_type == "faq" && isPublished != false] | order(order asc){
  _id, question, answer, category
}`;

export const statisticsQuery = /* groq */ `*[_type == "statistic" && isPublished != false] | order(order asc){
  _id, value, label, description, icon
}`;

export const clientsQuery = /* groq */ `*[_type == "clientLogo" && isPublished != false] | order(order asc){
  _id, name, category, website, description, isFeatured, "logo": logo${IMAGE}
}`;

export const galleryQuery = /* groq */ `*[_type == "galleryImage" && isPublished != false] | order(order asc){
  _id, title, description, category, "image": image${IMAGE}
}`;

export const blogPostsQuery = /* groq */ `*[_type == "blogPost" && isPublished != false] | order(order asc, publishedAt desc){
  _id, title, "slug": slug.current, author, excerpt, publishedAt,
  "coverImage": coverImage${IMAGE},
  "category": category->{ title, "slug": slug.current }
}`;

export const blogPostBySlugQuery = /* groq */ `*[_type == "blogPost" && slug.current == $slug && isPublished != false][0]{
  _id, title, "slug": slug.current, author, excerpt, body, publishedAt,
  "coverImage": coverImage${IMAGE},
  "category": category->{ title, "slug": slug.current },
  "seo": seo{ title, description, keywords, canonical, "ogImage": ogImage${IMAGE}, noIndex }
}`;

export const pageBySlugQuery = /* groq */ `*[_type == "page" && slug.current == $slug && isPublished != false][0]{
  _id, title, "slug": slug.current, body,
  "seo": seo{ title, description, keywords, canonical, "ogImage": ogImage${IMAGE}, noIndex }
}`;

export const pageSlugsQuery = /* groq */ `*[_type == "page" && defined(slug.current) && isPublished != false]{ "slug": slug.current }`;

export const sitemapQuery = /* groq */ `{
  "services": *[_type == "service" && defined(slug.current) && isPublished != false]{
    "slug": slug.current, "parent": parent->slug.current, _updatedAt
  },
  "posts": *[_type == "blogPost" && defined(slug.current) && isPublished != false]{
    "slug": slug.current, _updatedAt
  },
  "pages": *[_type == "page" && defined(slug.current) && isPublished != false]{
    "slug": slug.current, _updatedAt
  },
  "industries": *[_type == "industry" && defined(slug.current) && isPublished != false]{
    "slug": slug.current, _updatedAt
  }
}`;
