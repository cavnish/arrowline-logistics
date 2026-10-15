import { createClient, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

/** True once NEXT_PUBLIC_SANITY_PROJECT_ID is set. Until then the site renders
 *  section-level fallbacks so local builds don't fail on missing credentials. */
export const isSanityConfigured = Boolean(projectId);

export const sanityClient: SanityClient = createClient({
  projectId: projectId || "unconfigured",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

/**
 * Fetch from the Sanity Content Lake. Returns `null` when Sanity is not yet
 * configured so a missing project id degrades to fallback UI instead of a crash.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  if (!isSanityConfigured) return null;
  return sanityClient.fetch<T>(query, params);
}
