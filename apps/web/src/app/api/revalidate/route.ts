import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Sanity webhook → on-demand revalidation.
 *
 * Configure a Sanity webhook (on create/update/delete) pointing at
 *   https://<site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 * with a projection that includes `_type`, `slug` and `parent`:
 *   { "_type": _type, "slug": slug.current, "parent": parent->slug.current }
 *
 * Because pages are statically generated (SSG) and also declare a time-based
 * `revalidate = 300` fallback, this handler is what makes publish → live refresh
 * near-instant.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Revalidation is not configured (SANITY_REVALIDATE_SECRET missing)." },
      { status: 501 },
    );
  }

  const provided =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-revalidate-secret") ||
    "";

  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid secret." }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // Some webhook configs send no body; fall back to revalidating everything.
  }

  const type = typeof body._type === "string" ? body._type : undefined;
  const slug = normalizeSlug(body.slug);
  const parentSlug = normalizeSlug(body.parent);

  const paths = new Set<string>(["/", "/sitemap.xml"]);

  switch (type) {
    case "service":
      paths.add("/services");
      if (parentSlug && slug) paths.add(`/services/${parentSlug}/${slug}`);
      else if (slug) paths.add(`/services/${slug}`);
      break;
    case "industry":
      paths.add("/industries");
      break;
    case "galleryImage":
      paths.add("/gallery");
      break;
    case "blogPost":
    case "blogCategory":
      paths.add("/blog");
      if (slug) paths.add(`/blog/${slug}`);
      break;
    case "page":
      if (slug) paths.add(`/${slug}`);
      break;
    case "aboutPage":
      paths.add("/about");
      break;
    case "contactPage":
      paths.add("/contact");
      break;
    case "servicesPage":
      paths.add("/services");
      break;
    case "testimonial":
    case "faq":
    case "statistic":
    case "clientLogo":
    case "homePage":
      // These feed the home page and category listings.
      paths.add("/");
      paths.add("/industries");
      break;
    case "siteSettings":
    case "navigation":
    case "banner":
      // Global chrome — refresh the main entry points.
      paths.add("/about");
      paths.add("/contact");
      paths.add("/services");
      paths.add("/industries");
      paths.add("/gallery");
      paths.add("/blog");
      break;
    default:
      break;
  }

  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ ok: true, revalidated: [...paths], type: type ?? null });
}

function normalizeSlug(value: unknown): string | undefined {
  if (typeof value === "string" && value.length > 0) return value;
  if (value && typeof value === "object" && "current" in value) {
    const current = (value as { current?: unknown }).current;
    if (typeof current === "string" && current.length > 0) return current;
  }
  return undefined;
}
