import { getSnapshotSiteContent } from "../data/snapshot";

/**
 * Reads admin-managed site content from the build-time published snapshot.
 * No runtime backend request is made, so content is present before JS runs
 * and the page still renders when Supabase/Express are offline.
 */
export function useSiteContent() {
  return (key: string, fallback: string) =>
    getSnapshotSiteContent(key, fallback);
}
