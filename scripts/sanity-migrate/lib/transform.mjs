import { resolveImage } from "./sanity.mjs";
import { compact, key, onlyPublished, ref, slugify, sortByOrder, toPortableText, toStringList } from "./util.mjs";

/** Build an index of rows keyed by a chosen column (defaults to `id`). */
function indexById(rows, column = "id") {
  const map = new Map();
  for (const row of rows || []) {
    const id = row[column];
    if (id != null) map.set(id, row);
  }
  return map;
}

function groupBy(rows, column) {
  const map = new Map();
  for (const row of rows || []) {
    const id = row[column];
    if (id == null) continue;
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(row);
  }
  return map;
}

/**
 * Convert the Supabase CMS dump into Sanity documents.
 * Deterministic `_id`s make this idempotent — re-running updates, never duplicates.
 */
export async function buildDocuments(dump, { write = false } = {}) {
  const docs = [];
  const report = { byType: {}, warnings: [] };
  const add = (doc) => {
    docs.push(doc);
    report.byType[doc._type] = (report.byType[doc._type] || 0) + 1;
  };

  const image = (url, alt) => resolveImage(url, alt, { write });

  // ---- shared lookups -------------------------------------------------------
  const servicesById = indexById(dump.services);
  const serviceItemsById = indexById(dump.service_items);
  const industriesById = indexById(dump.industries);
  const blogCategoriesById = indexById(dump.blog_categories);

  const faqsByService = groupBy(dump.service_faqs, "service_id");
  const faqsByItem = groupBy(dump.service_faqs, "service_item_id");
  const stepsByService = groupBy(dump.service_process_steps, "service_id");
  const stepsByItem = groupBy(dump.service_process_steps, "service_item_id");
  const showcaseByService = groupBy(dump.service_visual_showcase, "service_id");
  const showcaseByItem = groupBy(dump.service_visual_showcase, "service_item_id");
  const cargoByService = groupBy(dump.service_cargo_applications, "service_id");
  const cargoByItem = groupBy(dump.service_cargo_applications, "service_item_id");
  const industriesByService = groupBy(dump.service_industries, "service_id");
  const industriesByItem = groupBy(dump.service_item_industries, "service_item_id");

  const industryRefs = (junctionRows, junctionColumn) =>
    sortByOrder(junctionRows)
      .map((row) => industriesById.get(row.industry_id))
      .filter(Boolean)
      .map((industry) => ref(`industry-${industry.slug}`));

  const buildFaqs = (rows) =>
    sortByOrder(onlyPublished(rows)).map((row) => ({
      _key: key("faq"),
      _type: "faqItem",
      question: row.question,
      answer: row.answer,
    }));

  const buildSteps = async (rows) =>
    Promise.all(
      sortByOrder(onlyPublished(rows)).map(async (row) => ({
        _key: key("step"),
        _type: "processStep",
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        icon: row.icon || undefined,
        image: await image(row.image, row.title),
      })),
    );

  const buildShowcase = async (rows) =>
    Promise.all(
      sortByOrder(onlyPublished(rows)).map(async (row) => ({
        _key: key("show"),
        _type: "showcaseItem",
        title: row.title || undefined,
        caption: row.caption || undefined,
        image: await image(row.image_url, row.alt_text || row.title),
      })),
    );

  const buildCargo = async (rows) =>
    Promise.all(
      sortByOrder(onlyPublished(rows)).map(async (row) => ({
        _key: key("cargo"),
        _type: "cargoApplication",
        title: row.title,
        description: row.description || undefined,
        image: await image(row.image_url, row.alt_text || row.title),
      })),
    );

  const serviceSeo = async (row, label) =>
    compact({
      _type: "seo",
      title: row.meta_title || undefined,
      description: row.meta_description || undefined,
      canonical: row.canonical_url || undefined,
      ogImage: await image(row.og_image, label),
    });

  // ---- site settings + key/value content ------------------------------------
  {
    const contentRows = [
      ...(dump.site_content || []).map((row) => ({
        key: row.content_key,
        value: row.content_value,
        section: row.section || undefined,
        type: row.content_type || "text",
      })),
      ...(dump.site_settings || []).map((row) => ({
        key: row.setting_key,
        value: row.setting_value,
        section: "Settings",
        type: row.setting_type || "text",
      })),
      // About image slots that have no structured home are preserved here too.
      ...(dump.about_images || [])
        .filter((row) => row.slot !== "hero" && row.image_url)
        .map((row) => ({ key: `about_image_${row.slot}`, value: row.image_url, section: "About Images", type: "image" })),
    ];

    const settingsDoc = {
      _id: "siteSettings",
      _type: "siteSettings",
      siteContent: contentRows.map((row) => ({
        _key: key("sc"),
        _type: "siteContentItem",
        key: row.key,
        value: row.value,
        section: row.section,
        type: row.type,
      })),
    };
    add(settingsDoc);
  }

  // ---- services + sub-services ---------------------------------------------
  for (const row of onlyPublished(dump.services)) {
    if (!row.slug) continue;
    add(
      compact({
        _id: `service-${row.slug}`,
        _type: "service",
        title: row.title,
        slug: { _type: "slug", current: row.slug },
        order: row.display_order ?? 0,
        shortDescription: row.short_description || undefined,
        fullDescription: row.full_description || undefined,
        heroImage: await image(row.hero_image, row.title),
        heroVideo: row.hero_video || undefined,
        capabilities: toStringList(row.capabilities),
        benefits: toStringList(row.benefits),
        showcaseHeading: row.showcase_heading || undefined,
        showcaseDescription: row.showcase_description || undefined,
        cargoHeading: row.cargo_heading || undefined,
        cargoDescription: row.cargo_description || undefined,
        showcase: await buildShowcase(showcaseByService.get(row.id)),
        cargoApplications: await buildCargo(cargoByService.get(row.id)),
        processSteps: await buildSteps(stepsByService.get(row.id)),
        faqs: buildFaqs(faqsByService.get(row.id)),
        industries: industryRefs(industriesByService.get(row.id)),
        seo: await serviceSeo(row, row.title),
        isPublished: true,
      }),
    );
  }

  for (const row of onlyPublished(dump.service_items)) {
    const parent = servicesById.get(row.service_id);
    const parentSlug = parent?.slug;
    if (!parentSlug || !row.slug) {
      report.warnings.push(`service_items: skipped "${row.title}" (missing parent or slug)`);
      continue;
    }
    add(
      compact({
        _id: `service-item-${parentSlug}-${row.slug}`,
        _type: "service",
        title: row.title,
        slug: { _type: "slug", current: row.slug },
        parent: ref(`service-${parentSlug}`),
        order: row.display_order ?? 0,
        shortDescription: row.short_description || undefined,
        fullDescription: row.full_description || undefined,
        heroImage: await image(row.hero_image, row.title),
        heroVideo: row.hero_video || undefined,
        capabilities: toStringList(row.capabilities),
        benefits: toStringList(row.benefits),
        showcaseHeading: row.showcase_heading || undefined,
        showcaseDescription: row.showcase_description || undefined,
        cargoHeading: row.cargo_heading || undefined,
        cargoDescription: row.cargo_description || undefined,
        showcase: await buildShowcase(showcaseByItem.get(row.id)),
        cargoApplications: await buildCargo(cargoByItem.get(row.id)),
        processSteps: await buildSteps(stepsByItem.get(row.id)),
        faqs: buildFaqs(faqsByItem.get(row.id)),
        industries: industryRefs(industriesByItem.get(row.id)),
        seo: await serviceSeo(row, row.title),
        isPublished: true,
      }),
    );
  }

  // ---- industries -----------------------------------------------------------
  for (const row of onlyPublished(dump.industries)) {
    if (!row.slug) continue;
    add(
      compact({
        _id: `industry-${row.slug}`,
        _type: "industry",
        title: row.title,
        slug: { _type: "slug", current: row.slug },
        description: row.description || undefined,
        icon: row.icon || undefined,
        cargoTypes: toStringList(row.cargo_types),
        image: await image(row.image, row.title),
        order: row.display_order ?? 0,
        isPublished: true,
      }),
    );
  }

  // ---- clients + trusted network (deduped by name) --------------------------
  {
    const seen = new Set();
    const norm = (name) => slugify(name);
    for (const row of onlyPublished(dump.clients)) {
      const id = norm(row.name);
      if (!id) continue;
      seen.add(id);
      add(
        compact({
          _id: `client-${id}`,
          _type: "clientLogo",
          name: row.name,
          category: row.category || undefined,
          website: row.website || undefined,
          isFeatured: row.is_featured === true,
          logo: await image(row.logo, row.name),
          order: row.display_order ?? 0,
          isPublished: true,
        }),
      );
    }
    for (const row of onlyPublished(dump.trusted_network)) {
      const id = norm(row.name);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      add(
        compact({
          _id: `network-${id}`,
          _type: "clientLogo",
          name: row.name,
          category: row.category || undefined,
          website: row.website || undefined,
          description: row.description || undefined,
          isFeatured: row.is_featured === true,
          logo: await image(row.logo || row.logo_public_id, row.logo_alt || row.name),
          order: row.display_order ?? 0,
          isPublished: true,
        }),
      );
    }
  }

  // ---- testimonials ---------------------------------------------------------
  for (const row of onlyPublished(dump.testimonials)) {
    add(
      compact({
        _id: `testimonial-${row.id}`,
        _type: "testimonial",
        customerName: row.customer_name,
        company: row.company || undefined,
        position: row.position || undefined,
        testimonial: row.testimonial,
        rating: row.rating != null ? Number(row.rating) : undefined,
        photo: await image(row.photo, row.customer_name),
        order: row.display_order ?? 0,
        isVerified: true,
        isPublished: true,
      }),
    );
  }

  // ---- faqs -----------------------------------------------------------------
  for (const row of onlyPublished(dump.faqs)) {
    add(
      compact({
        _id: `faq-${row.id}`,
        _type: "faq",
        question: row.question,
        answer: row.answer,
        category: row.category || undefined,
        order: row.display_order ?? 0,
        isPublished: true,
      }),
    );
  }

  // ---- statistics -----------------------------------------------------------
  for (const row of onlyPublished(dump.statistics)) {
    add(
      compact({
        _id: `statistic-${row.id}`,
        _type: "statistic",
        value: row.value,
        label: row.label,
        description: row.description || undefined,
        icon: row.icon || undefined,
        order: row.display_order ?? 0,
        isPublished: true,
      }),
    );
  }

  // ---- gallery --------------------------------------------------------------
  for (const row of onlyPublished(dump.gallery_items)) {
    const img = await image(row.image, row.alt_text || row.title);
    if (!img) continue;
    add(
      compact({
        _id: `gallery-${row.id}`,
        _type: "galleryImage",
        title: row.title || undefined,
        description: row.description || undefined,
        category: row.category || undefined,
        image: img,
        order: row.display_order ?? 0,
        isPublished: true,
      }),
    );
  }

  // ---- blog -----------------------------------------------------------------
  for (const row of onlyPublished(dump.blog_categories)) {
    if (!row.slug) continue;
    add(
      compact({
        _id: `blogCategory-${row.slug}`,
        _type: "blogCategory",
        title: row.name,
        slug: { _type: "slug", current: row.slug },
        description: row.description || undefined,
        isPublished: true,
      }),
    );
  }

  for (const row of onlyPublished(dump.blog_posts)) {
    if (!row.slug) continue;
    const category = row.category_id ? blogCategoriesById.get(row.category_id) : null;
    const keywords = String(row.keywords || "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    add(
      compact({
        _id: `blogPost-${row.slug}`,
        _type: "blogPost",
        title: row.title,
        slug: { _type: "slug", current: row.slug },
        category: category?.slug ? ref(`blogCategory-${category.slug}`) : undefined,
        author: row.author || undefined,
        coverImage: await image(row.featured_image, row.title),
        excerpt: row.excerpt || undefined,
        body: toPortableText(row.content),
        publishedAt: row.published_at || undefined,
        seo: compact({
          _type: "seo",
          title: row.meta_title || undefined,
          description: row.meta_description || undefined,
          keywords,
        }),
        isPublished: true,
      }),
    );
  }

  // ---- case studies ---------------------------------------------------------
  for (const row of onlyPublished(dump.case_studies)) {
    if (!row.slug) continue;
    const gallery = Array.isArray(row.images) ? row.images : [];
    add(
      compact({
        _id: `caseStudy-${row.slug}`,
        _type: "caseStudy",
        title: row.title,
        slug: { _type: "slug", current: row.slug },
        clientName: row.client_name || undefined,
        industry: row.industry || undefined,
        location: row.location || undefined,
        description: row.description || undefined,
        challenge: row.challenge || undefined,
        solution: row.solution || undefined,
        results: row.results || undefined,
        coverImage: await image(row.featured_image, row.title),
        gallery: (
          await Promise.all(gallery.map((url) => image(typeof url === "string" ? url : url?.url, row.title)))
        ).filter(Boolean),
        seo: compact({
          _type: "seo",
          title: row.meta_title || undefined,
          description: row.meta_description || undefined,
        }),
        order: row.display_order ?? 0,
        isPublished: true,
      }),
    );
  }

  // ---- social videos --------------------------------------------------------
  for (const row of onlyPublished(dump.social_videos)) {
    add(
      compact({
        _id: `socialVideo-${row.id}`,
        _type: "socialVideo",
        title: row.title,
        videoUrl: row.video_url || undefined,
        embedUrl: row.embed_url || undefined,
        thumbnail: await image(row.thumbnail, row.title),
        platform: row.platform || undefined,
        description: row.description || undefined,
        order: row.display_order ?? 0,
        isPublished: true,
      }),
    );
  }

  // ---- locations ------------------------------------------------------------
  for (const row of onlyPublished(dump.locations)) {
    if (!row.slug) continue;
    add(
      compact({
        _id: `location-${row.slug}`,
        _type: "location",
        name: row.name,
        slug: { _type: "slug", current: row.slug },
        state: row.state || undefined,
        city: row.city || undefined,
        address: row.address || undefined,
        description: row.description || undefined,
        image: await image(row.image, row.name),
        mapUrl: row.map_url || undefined,
        seo: compact({
          _type: "seo",
          title: row.meta_title || undefined,
          description: row.meta_description || undefined,
        }),
        order: row.display_order ?? 0,
        isPublished: true,
      }),
    );
  }

  // ---- about page -----------------------------------------------------------
  {
    const pillars = sortByOrder(onlyPublished(dump.about_pillars)).map((row) => ({
      _key: key("pillar"),
      _type: "pillar",
      icon: row.icon || undefined,
      title: row.title,
      text: row.text || undefined,
      color: row.color || undefined,
    }));
    const milestones = sortByOrder(onlyPublished(dump.about_milestones)).map((row) => ({
      _key: key("stone"),
      _type: "milestone",
      year: String(row.year),
      title: row.title,
      text: row.text || undefined,
    }));
    const differentiators = sortByOrder(onlyPublished(dump.about_differentiators)).map((row) => ({
      _key: key("diff"),
      _type: "differentiator",
      icon: row.icon || undefined,
      title: row.title,
      text: row.text || undefined,
      accent: row.accent || undefined,
    }));
    const leaders = await Promise.all(
      sortByOrder(onlyPublished(dump.leadership)).map(async (row) => ({
        _key: key("leader"),
        _type: "leader",
        name: row.name,
        role: row.role || undefined,
        location: row.location || undefined,
        email: row.email || undefined,
        bio: row.bio || undefined,
        image: await image(row.image, row.image_alt || row.name),
      })),
    );
    const coreValues = sortByOrder(onlyPublished(dump.core_values)).map((row) => ({
      _key: key("value"),
      _type: "coreValue",
      icon: row.icon || undefined,
      title: row.title,
      description: row.description || undefined,
    }));

    const heroSlot = (dump.about_images || []).find((row) => row.slot === "hero");

    const aboutDoc = compact({
      _id: "aboutPage",
      _type: "aboutPage",
      heroImage: await image(heroSlot?.image_url, heroSlot?.alt_text || "Arrowline Logistics"),
      pillars,
      milestones,
      differentiators,
      leaders,
      coreValues,
    });

    if (
      aboutDoc.heroImage ||
      pillars.length ||
      milestones.length ||
      differentiators.length ||
      leaders.length ||
      coreValues.length
    ) {
      add(aboutDoc);
    }
  }

  return { docs, report };
}
