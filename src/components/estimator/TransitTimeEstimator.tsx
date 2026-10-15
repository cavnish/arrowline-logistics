import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  CalendarDays,
  Gauge,
  Route,
  AlertCircle,
  ShieldCheck,
  Info,
  ChevronRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import LocationAutocomplete, { cityToPlace } from "./LocationAutocomplete";
import RouteMap from "./RouteMap";

import type { MapPlace, DrivingRoute } from "../../services/maps/types";
import { loadGoogleMaps } from "../../services/maps/loadGoogleMaps";
import { requestDirections } from "../../services/maps/directions";
import { findCityByName } from "../../data/indianCities";
import {
  VEHICLES,
  QUICK_LANES,
  estimateRoute,
  estimateFromDirections,
  estimateToPrefill,
  resolveQuickLane,
  formatDate,
  type RouteEstimate,
  type EstimateEndpoint,
  type VehicleKey,
} from "../../services/routeEstimator";
import { openQuoteForm } from "../../utils/quoteBus";
import { navigate } from "../../utils/navigation";
import { cn } from "../../utils/cn";

interface TransitTimeEstimatorProps {
  variant?: "section" | "page";
}

type Phase = "idle" | "loading" | "result";

/** Mundra defaults as a real geo place (from the offline hub dataset). */
const defaultOrigin = (() => {
  const mundra = findCityByName("Mundra");
  return mundra ? cityToPlace(mundra) : null;
})();

function toEndpoint(place: MapPlace): EstimateEndpoint {
  return {
    name: place.label,
    state: place.state,
    lat: place.lat,
    lng: place.lng,
    address: place.address,
  };
}

export default function TransitTimeEstimator({
  variant = "page",
}: TransitTimeEstimatorProps) {
  const [from, setFrom] = useState<MapPlace | null>(defaultOrigin);
  const [to, setTo] = useState<MapPlace | null>(null);
  const [vehicle, setVehicle] = useState<VehicleKey>("ftl");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<DrivingRoute | null>(null);
  const [estimate, setEstimate] = useState<RouteEstimate | null>(null);
  const [fallbackActive, setFallbackActive] = useState(false);

  const busyRef = useRef(false);

  /** Clear a stale route/estimate as soon as an input changes. */
  const invalidate = () => {
    if (busyRef.current) return;
    setRoute(null);
    setEstimate(null);
    setError(null);
    setFallbackActive(false);
    if (phase === "result") setPhase("idle");
  };

  const computeRoute = async (o: MapPlace, d: MapPlace, veh: VehicleKey) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setFallbackActive(false);
    setRoute(null);
    setEstimate(null);
    setPhase("loading");

    const maps = await loadGoogleMaps();
    if (!maps || !maps.DirectionsService) {
      // Offline fallback — keep the tool usable when Maps isn't configured.
      const originCity = findCityByName(o.label);
      const destCity = findCityByName(d.label);
      if (originCity && destCity) {
        setEstimate(estimateRoute(originCity, destCity, veh));
        setFallbackActive(true);
        setPhase("result");
      } else {
        setError(
          "Live Google routing is unavailable, and this location isn't in Arrowline's offline hub list. Please pick a place from the search suggestions."
        );
        setPhase("idle");
      }
      busyRef.current = false;
      return;
    }

    try {
      const drivingRoute = await requestDirections(maps, o, d);
      setRoute(drivingRoute);
      setEstimate(
        estimateFromDirections({
          route: drivingRoute,
          from: toEndpoint(o),
          to: toEndpoint(d),
          vehicleKey: veh,
        })
      );
      setPhase("result");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't plot a driving route for this lane. Try again or contact our desk for a route survey."
      );
      setPhase("idle");
    } finally {
      busyRef.current = false;
    }
  };

  const handleSubmit = () => {
    if (busyRef.current) return;
    const o = from;
    const d = to;
    if (!o || !d) {
      setError(
        !o && !d
          ? "Select both an origin and a destination — pick them from the search suggestions."
          : !o
            ? "Select an origin — pick it from the search suggestions."
            : "Select a destination — pick it from the search suggestions."
      );
      setRoute(null);
      setEstimate(null);
      setPhase("idle");
      return;
    }
    if (o.key === d.key) {
      setError("Origin and destination must be two different locations.");
      setRoute(null);
      setEstimate(null);
      setPhase("idle");
      return;
    }
    void computeRoute(o, d, vehicle);
  };

  const handleSwap = () => {
    const previousFrom = from;
    const previousTo = to;
    setFrom(previousTo);
    setTo(previousFrom);
    if (busyRef.current) return;
    setRoute(null);
    setEstimate(null);
    setError(null);
    setFallbackActive(false);
    setPhase("idle");
    if (previousFrom && previousTo && previousFrom.key !== previousTo.key) {
      void computeRoute(previousTo, previousFrom, vehicle);
    }
  };

  const handleVehicleChange = (k: VehicleKey) => {
    setVehicle(k);
    if (busyRef.current || phase !== "result") return;
    if (route && from && to) {
      setEstimate(
        estimateFromDirections({ route, from: toEndpoint(from), to: toEndpoint(to), vehicleKey: k })
      );
    } else if (estimate?.fallback && from && to) {
      const originCity = findCityByName(from.label);
      const destCity = findCityByName(to.label);
      if (originCity && destCity) setEstimate(estimateRoute(originCity, destCity, k));
    }
  };

  const applyQuickLane = (fromName: string, toName: string) => {
    const lane = resolveQuickLane(fromName, toName);
    if (!lane) return;
    const o = cityToPlace(lane.from);
    const d = cityToPlace(lane.to);
    setFrom(o);
    setTo(d);
    void computeRoute(o, d, vehicle);
  };

  const handleRequestQuote = () => {
    if (!estimate) return;
    openQuoteForm({
      service: estimate.vehicle.serviceTitle,
      message: estimateToPrefill(estimate),
    });
  };

  const busy = phase === "loading";

  const card = (
    <div className="relative bg-white border border-slate-200 rounded-3xl shadow-[0_24px_60px_-30px_rgba(6,43,58,0.35)] overflow-hidden">
      <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-[#FF6B1A] via-[#FFB366] to-[#062B3A]" />

      <div className="p-4 sm:p-6 lg:p-7 space-y-5">
        {/* Route inputs */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-end">
          <LocationAutocomplete
            id="tte-from"
            label="From (Origin)"
            placeholder="e.g. Mundra Port, Ahmedabad…"
            value={from}
            onChange={(place) => {
              setFrom(place);
              invalidate();
            }}
            hasError={Boolean(error && !from)}
          />

          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap origin and destination"
            className="hidden md:flex mb-1 mx-auto w-9 h-9 rounded-full border border-slate-200 bg-[#F5F8FA] items-center justify-center text-[#062B3A] hover:text-white hover:bg-[#062B3A] hover:border-[#062B3A] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]/40"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <LocationAutocomplete
            id="tte-to"
            label="To (Destination)"
            placeholder="e.g. Delhi NCR, Mumbai Port…"
            value={to}
            onChange={(place) => {
              setTo(place);
              invalidate();
            }}
            hasError={Boolean(error && !to)}
          />
        </div>

        <button
          type="button"
          onClick={handleSwap}
          aria-label="Swap origin and destination"
          className="md:hidden w-full py-2 rounded-xl border border-slate-200 bg-[#F5F8FA] text-[11px] font-bold text-[#062B3A] flex items-center justify-center gap-2 cursor-pointer hover:bg-white transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap origin & destination</span>
        </button>

        {/* Vehicle selection */}
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-[#062B3A] uppercase tracking-[0.1em]">
            Vehicle / Service class
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {VEHICLES.map((v) => {
              const Icon = v.icon;
              const isSelected = v.key === vehicle;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => handleVehicleChange(v.key)}
                  aria-pressed={isSelected}
                  title={v.blurb}
                  className={cn(
                    "group relative text-left rounded-xl border p-3 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]/40",
                    isSelected
                      ? "border-[#FF6B1A] bg-[#FFF6EF] shadow-[0_8px_20px_-12px_rgba(255,107,26,0.6)]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-[#FAFCFD]"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-lg mb-2 transition-colors",
                      isSelected
                        ? "bg-[#FF6B1A] text-white"
                        : "bg-[#F0F5FA] text-[#062B3A] group-hover:text-[#FF6B1A]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span
                    className={cn(
                      "block text-[11px] leading-tight",
                      isSelected ? "font-black text-[#062B3A]" : "font-bold text-[#2C4A5A]"
                    )}
                  >
                    {v.label}
                  </span>
                  <span className="block text-[9.5px] text-slate-400 mt-0.5 truncate">
                    {v.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error banner */}
        <div aria-live="polite">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
              {from && to && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="shrink-0 text-[10px] font-black uppercase tracking-wider text-red-700 underline underline-offset-2 hover:text-red-900 cursor-pointer"
                >
                  Try again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={busy}
            aria-busy={busy}
            className={cn(
              "flex-1 py-3.5 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]/50 focus-visible:ring-offset-2",
              busy
                ? "bg-slate-400 cursor-wait"
                : "bg-gradient-to-r from-[#FF6B1A] to-[#FF8C2A] hover:from-[#E55A0D] hover:to-[#FF7A00] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(255,107,26,0.55)] motion-reduce:transform-none motion-reduce:transition-none"
            )}
          >
            {busy ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Routing via Google Maps…</span>
              </>
            ) : (
              <>
                <Route className="w-4 h-4" />
                <span>Estimate Transit Time</span>
              </>
            )}
          </button>
        </div>

        {/* Quick lanes */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Popular lanes:
          </span>
          {QUICK_LANES.map((lane) => (
            <button
              key={lane.label}
              type="button"
              onClick={() => applyQuickLane(lane.from, lane.to)}
              className="px-2.5 py-1 rounded-full border border-slate-200 bg-[#F5F8FA] text-[10px] font-bold text-[#062B3A] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-all cursor-pointer"
            >
              {lane.label}
            </button>
          ))}
        </div>

        {/* Live map + results */}
        {(from || to || estimate || phase !== "idle") && (
          <div className="space-y-3">
            {/* Compact stats — above the map */}
            {phase === "result" && estimate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
              >
                <div className="rounded-xl border border-slate-200 bg-[#F8FBFC] p-3">
                  <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                    <Route className="w-3 h-3 text-[#FF6B1A]" />
                    Road Distance
                  </span>
                  <span className="block text-lg font-black text-[#062B3A] mt-1 tabular-nums">
                    {route?.distanceText || `${estimate.roadDistanceKm.toLocaleString("en-IN")} km`}
                  </span>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">
                    Google route · straight line ≈ {estimate.straightLineKm.toLocaleString("en-IN")} km
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#F8FBFC] p-3">
                  <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                    <Gauge className="w-3 h-3 text-[#FF6B1A]" />
                    Estimated Transit
                  </span>
                  <span className="block text-lg font-black text-[#062B3A] mt-1 tabular-nums">
                    {route?.durationText || `≈ ${estimate.transitHours} h`}
                  </span>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">
                    ≈ {estimate.transitDays} driving day(s)
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#F8FBFC] p-3">
                  <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                    <CalendarDays className="w-3 h-3 text-[#FF6B1A]" />
                    Delivery Window
                  </span>
                  <span className="block text-lg font-black text-[#062B3A] mt-1 tabular-nums">
                    {estimate.earliestDays}–{estimate.latestDays} days
                  </span>
                  <span className="block text-[9.5px] text-slate-500 mt-0.5">
                    {formatDate(estimate.window.earliest)} → {formatDate(estimate.window.latest)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Offline-model notice */}
            {fallbackActive && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[10.5px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  Live Google routing isn't available here, so this uses Arrowline's offline
                  network model. For exact SLAs and tariffs contact our desk.
                </span>
              </div>
            )}

            {/* Real Google Map */}
            <RouteMap origin={from} destination={to} route={route} busy={busy} />

            {/* Route summary + CTA — below the map */}
            {phase === "result" && estimate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-[#D6E7EE] bg-[#F2F8FA] p-3.5 sm:p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px]">
                  <span className="font-black text-[#062B3A]">{from?.label}</span>
                  <span className="text-[#FF6B1A] font-black">→</span>
                  <span className="font-black text-[#062B3A]">{to?.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6B1A] text-white text-[9px] font-black uppercase tracking-wider">
                    {estimate.corridor.highway}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-[#062B3A]">Route summary: </span>
                  {estimate.corridor.via}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={handleRequestQuote}
                    className="flex-1 py-3 bg-[#062B3A] hover:bg-[#0B3D50] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]/50 focus-visible:ring-offset-2 motion-reduce:transform-none"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                    <span>Get Exact Quote</span>
                    <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
                  </button>
                </div>

                <p className="flex items-start gap-1.5 text-[10px] text-slate-500 leading-relaxed">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px text-slate-400" />
                  <span>
                    Opens our quote form pre-filled with this route, vehicle class, and corridor.
                    Real traffic, weather, permits, and port schedules can still shift actual transit
                    — our desk confirms a binding window with your tariff.
                  </span>
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (variant === "section") {
    return (
      <section className="py-12 sm:py-14 lg:py-16 bg-[#F5F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 lg:pt-6 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#FF7A00] block">
                Transit Planning Tool · Live Google Routing
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#062B3A] tracking-tight leading-tight">
                Plan your lane in{" "}
                <span className="text-[#FF7A00]">seconds</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pick any two Indian locations and a vehicle class — Google Maps
                plots the real driving route, and we translate distance and drive
                time into a delivery window calibrated to our Mundra Port dispatch
                model. Then hand the route to our desk for a binding tariff.
              </p>
              <ul className="space-y-2 pt-1">
                {[
                  "Live Google Maps routes between any two Indian locations",
                  "Vehicle-aware speeds for containers, FTL, trailers, ODC & project cargo",
                  "One tap pre-fills your quote request with the full route summary",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-[11.5px] text-slate-600">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF6B1A] flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate("transit-time-estimator")}
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#062B3A] hover:text-[#FF6B1A] transition-colors cursor-pointer group"
              >
                <span>Open full-page tool</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="lg:col-span-8">{card}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      {card}
      {variant === "page" && (
        <div className="flex items-start gap-2 rounded-xl bg-[#FEF9F0] border border-[#FF7A00]/20 px-3.5 py-2.5">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#FF7A00]" />
          <p className="text-[10.5px] text-slate-600 leading-relaxed">
            Live Google Maps distance and drive time, with Arrowline pickup/offload
            buffers applied per vehicle class. For binding SLAs and tariffs our
            desk responds within <strong className="text-[#062B3A]">2 hours</strong>.
          </p>
        </div>
      )}
    </div>
  );
}