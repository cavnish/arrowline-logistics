import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, AlertTriangle, RefreshCw } from "lucide-react";

import type { DrivingRoute, MapPlace } from "../../services/maps/types";
import {
  loadGoogleMaps,
  resetGoogleMapsLoader,
  mapsFailureReason,
} from "../../services/maps/loadGoogleMaps";
import { cn } from "../../utils/cn";

/** Subtle, brand-aligned map styling (de-emphasises POIs/transit labels). */
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ saturation: -20 }] },
];

function pinUrl(color: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">` +
    `<path d="M16 38C8 29 1 21 1 13A15 15 0 0 1 31 13C31 21 24 29 16 38Z" fill="${color}"/>` +
    `<path d="M16 38C8 29 1 21 1 13A15 15 0 0 1 31 13C31 21 24 29 16 38Z" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="1.4"/>` +
    `<circle cx="16" cy="13" r="6" fill="#ffffff"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface RouteMapProps {
  origin: MapPlace | null;
  destination: MapPlace | null;
  route?: DrivingRoute | null;
  busy?: boolean;
  showOfflineFallback?: boolean;
  className?: string;
}

export default function RouteMap({
  origin,
  destination,
  route,
  busy = false,
  showOfflineFallback = false,
  className,
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<{ origin?: google.maps.Marker; destination?: google.maps.Marker }>({});

  const [maps, setMaps] = useState<typeof google.maps | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const showPreview = Boolean(origin || destination);
  const missingApiKey = Boolean(failed?.includes("VITE_GOOGLE_MAPS_API_KEY is not set"));

  // Lazy-load the Maps library only once there is something to show.
  useEffect(() => {
    if (!showPreview) return;
    let active = true;
    loadGoogleMaps().then((m) => {
      if (!active) return;
      setMaps(m);
      if (!m) setFailed(mapsFailureReason() || "Google Maps could not be reached right now.");
    });
    return () => {
      active = false;
    };
  }, [showPreview]);

  // Initialise the Map instance once the library is available.
  useEffect(() => {
    if (!maps || mapRef.current || !containerRef.current) return;
    mapRef.current = new maps.Map(containerRef.current, {
      center: { lat: 22.84, lng: 78.96 },
      zoom: 5,
      mapTypeId: maps.MapTypeId.ROADMAP,
      styles: MAP_STYLES,
      clickableIcons: false,
      fullscreenControl: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      minZoom: 2,
    });
  }, [maps]);

  // Sync markers, the route polyline, and fitted bounds with the inputs.
  useEffect(() => {
    if (!maps || !mapRef.current) return;
    const map = mapRef.current;

    // Real route polyline (Google overview path), or clear the previous one.
    if (route?.overviewPolyline && maps.geometry) {
      try {
        const path = maps.geometry.encoding.decodePath(route.overviewPolyline);
        let pl = polylineRef.current;
        if (!pl) {
          pl = new maps.Polyline({
            strokeColor: "#FF6B1A",
            strokeOpacity: 0.95,
            strokeWeight: 5,
          });
          pl.setMap(map);
          polylineRef.current = pl;
        }
        pl.setPath(path);
        const bounds = new maps.LatLngBounds();
        path.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds, { top: 56, bottom: 56, left: 56, right: 56 });
      } catch {
        /* malformed polyline — fall through to marker bounds below */
      }
    } else if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const place = (p: MapPlace | null, kind: "origin" | "destination") => {
      const existing = markersRef.current[kind];
      if (p && existing) {
        existing.setPosition({ lat: p.lat, lng: p.lng });
      } else if (p && !existing) {
        markersRef.current[kind] = new maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          title: p.label,
          zIndex: kind === "origin" ? 2 : 3,
          icon: {
            url: pinUrl(kind === "origin" ? "#062B3A" : "#FF6B1A"),
            scaledSize: new maps.Size(32, 40),
            anchor: new maps.Point(16, 38),
          },
        });
      } else if (!p && existing) {
        existing.setMap(null);
        markersRef.current[kind] = undefined;
      }
    };
    place(origin, "origin");
    place(destination, "destination");

    // Preview (no route yet): fit both markers so the lane is always in view.
    if (!route?.overviewPolyline && origin && destination) {
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat: origin.lat, lng: origin.lng });
      bounds.extend({ lat: destination.lat, lng: destination.lng });
      map.fitBounds(bounds, { top: 64, bottom: 64, left: 64, right: 64 });
    }
  }, [maps, origin, destination, route]);

  const hint = !origin
    ? "Pick an origin to start."
    : !destination
      ? "Now pick a destination."
      : "Both ends placed — hit Estimate Transit Time for the live route.";

  return (
    <div
      data-lenis-prevent
      className={cn(
        "relative rounded-2xl border border-slate-200 bg-[#EAF3F6] overflow-hidden",
        "h-[300px] sm:h-[360px] lg:h-[420px]",
        className
      )}
    >
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Live tap targets hint (preview only) */}
      {showPreview && !route && !busy && maps && !failed && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-[#062B3A]/90 text-white px-3 py-1.5 text-[10px] font-bold shadow-lg backdrop-blur-sm">
          <MapPin className="w-3 h-3 text-[#FF6B1A]" />
          <span>{hint}</span>
        </div>
      )}

      {/* Routing / initial-load spinner */}
      {(busy || (!!maps === false && showPreview && !failed)) && (
        <div className="absolute inset-0 z-20 bg-white/85 backdrop-blur-[2px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2.5">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF6B1A]" />
            <p className="text-[11px] font-black uppercase tracking-wider text-[#062B3A]">
              {busy ? "Routing via Google Maps…" : "Loading map…"}
            </p>
          </div>
        </div>
      )}

      {/* Professional failure state */}
      {failed && missingApiKey && showOfflineFallback && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#F5F8FA] p-5 text-center">
          <div className="flex items-center gap-2 rounded-full border border-[#D6E7EE] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#062B3A]">
            <MapPin className="h-3.5 w-3.5 text-[#FF6B1A]" />
            Arrowline offline network
          </div>
          <div className="flex w-full max-w-md items-center justify-center gap-3 sm:gap-5">
            <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Origin</span>
              <span className="mt-1 block truncate text-xs font-black text-[#062B3A]">{origin?.label || "Select a location"}</span>
            </div>
            <div className="h-px w-8 shrink-0 bg-[#FF6B1A] sm:w-12" aria-hidden="true" />
            <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Destination</span>
              <span className="mt-1 block truncate text-xs font-black text-[#062B3A]">{destination?.label || "Select a location"}</span>
            </div>
          </div>
          <p className="max-w-sm text-[11px] leading-relaxed text-slate-500">
            Map preview is unavailable, but you can still estimate routes between supported hubs below.
          </p>
        </div>
      )}

      {failed && !missingApiKey && (
        <div className="absolute inset-0 z-20 bg-[#F5F8FA] flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-600 max-w-xs leading-relaxed">{failed}</p>
          <button
            type="button"
            onClick={() => {
              resetGoogleMapsLoader();
              setFailed(null);
              setMaps(null);
              mapRef.current = null;
              polylineRef.current = null;
              markersRef.current = {};
              loadGoogleMaps().then((m) => {
                setMaps(m);
                if (!m) setFailed(mapsFailureReason() || "Google Maps could not be reached.");
              });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#062B3A] hover:bg-[#0B3D50] text-white text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try loading map again
          </button>
        </div>
      )}
    </div>
  );
}
