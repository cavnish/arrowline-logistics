/**
 * Lazy, singleton Google Maps JavaScript API loader.
 *
 * The Maps script is only injected on first demand — when the Transit Time
 * Estimator is actually being used (first focus on a From/To field, or the
 * first time a place is selected). Nothing is loaded globally on other pages.
 *
 * Security: the key comes from `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — a public, client-
 * side key that MUST be restricted in Google Cloud Console to the Maps
 * JavaScript / Places / Directions APIs and to the production referrer
 * (https://arrowlinelogistics.in/*). No secret ever belongs in this repo.
 */

export type MapsLoadState = "idle" | "loading" | "ready" | "failed";

export interface MapsLoaderRecord {
  promise: Promise<typeof google.maps | null>;
  state: MapsLoadState;
  /** Human-readable explanation when `state === "failed"`. */
  reason?: string;
}

const LOADER_GLOBAL = "__arrowlineGoogleMapsLoader";

declare global {
  interface Window {
    __arrowlineGoogleMapsLoader?: MapsLoaderRecord;
  }
}

function mapsLibraryPresent(): boolean {
  return typeof window !== "undefined"
    && typeof (window as unknown as { google?: { maps?: unknown } }).google !== "undefined"
    && Boolean((window as unknown as { google?: { maps?: unknown } }).google?.maps);
}

function persist(key: string, record: MapsLoaderRecord): Promise<typeof google.maps | null> {
  (window as unknown as Record<string, unknown>)[key] = record;
  return record.promise;
}

/**
 * Load (or return an in-flight / already-loaded copy of) the Google Maps JS
 * library. Resolves `google.maps` on success and `null` when no API key is
 * configured or the script fails to load.
 */
export function loadGoogleMaps(): Promise<typeof google.maps | null> {
  const existing = window.__arrowlineGoogleMapsLoader;
  if (existing) return existing.promise;

  if (mapsLibraryPresent()) {
    const readyPromise = Promise.resolve(google.maps);
    return persist(LOADER_GLOBAL, { promise: readyPromise, state: "ready" });
  }

  const apiKey = String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "").trim();
  if (!apiKey) {
    return persist(LOADER_GLOBAL, {
      promise: Promise.resolve(null),
      state: "failed",
      reason:
        "Live Google Maps isn't enabled on this environment (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set). " +
        "Showing Arrowline's offline network estimate instead.",
    });
  }

  const promise = new Promise<typeof google.maps | null>((resolve) => {
    const callbackName = `__arrowlineMapsInit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const callbacks = window as unknown as Record<string, unknown>;

    const cleanup = () => {
      window.clearTimeout(timeout);
      delete callbacks[callbackName];
    };

    const timeout = window.setTimeout(() => {
      callbacks[callbackName] = undefined;
      cleanup();
      resolve(null);
    }, 20000);

    callbacks[callbackName] = () => {
      cleanup();
      resolve(mapsLibraryPresent() ? google.maps : null);
    };

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.dataset.arrowlineMaps = "1";
    script.src =
      "https://maps.googleapis.com/maps/api/js" +
      `?key=${encodeURIComponent(apiKey)}` +
      "&v=weekly" +
      "&libraries=places,geometry" +
      "&loading=async" +
      `&callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return persist(LOADER_GLOBAL, { promise, state: "loading" });
}

/** Human-readable failure reason, or `null` when maps are fine/not attempted. */
export function mapsFailureReason(): string | null {
  return window.__arrowlineGoogleMapsLoader?.reason ?? null;
}

/** Forget the cached loader state so `loadGoogleMaps()` retries from scratch. */
export function resetGoogleMapsLoader(): void {
  document.querySelector("script[data-arrowline-maps]")?.remove();
  window.__arrowlineGoogleMapsLoader = undefined;
}