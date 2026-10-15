/**
 * Transit & delivery-window estimator for Arrowline.
 *
 * The logistics rules live here and are UI-agnostic: given a *road distance*
 * and a *driving duration* — which now come from the Google Directions service
 * for the live map — plus a vehicle/service class, it produces the realistic
 * delivery window by applying vehicle-specific daily driving windows and
 * origin/destination buffers.
 *
 * `estimateRoute` (haversine * highway factor) is retained as an offline
 * fallback so the tool still returns a sensible estimate when the Maps API key
 * is absent or unreachable.
 */

import type { LucideIcon } from "lucide-react";
import {
  Container,
  Truck,
  Loader2,
  Ship,
  Boxes,
} from "lucide-react";

import type { City } from "../data/indianCities";
import { findCityByName } from "../data/indianCities";

export type VehicleKey =
  | "container"
  | "ftl"
  | "trailer"
  | "odc"
  | "project";

export interface VehicleProfile {
  key: VehicleKey;
  label: string;
  short: string;
  blurb: string;
  serviceTitle: string;
  icon: LucideIcon;
  /** Indicative cruising speed on trunk national highways (km/h) — informational only with live routing. */
  speedKph: number;
  /** Realistic daily driving window (hours). */
  driveHoursPerDay: number;
  /** Origin-side buffer days (port gate, docs, permits). */
  pickupDays: number;
  /** Destination-side buffer days (unloading, yard slot). */
  dropDays: number;
}

export const VEHICLES: VehicleProfile[] = [
  {
    key: "container",
    label: "Container Haulage",
    short: "20ft / 40ft Chassis",
    blurb: "Standard & high-cube container trailers — Mundra gate-out sync.",
    serviceTitle: "Container Transportation",
    icon: Container,
    speedKph: 52,
    driveHoursPerDay: 10,
    pickupDays: 1,
    dropDays: 1,
  },
  {
    key: "ftl",
    label: "FTL — Full Truck Load",
    short: "Dedicated Truck",
    blurb: "Dedicated open / closed-bodied trucks, direct point-to-point.",
    serviceTitle: "Full Truck Load (FTL)",
    icon: Truck,
    speedKph: 55,
    driveHoursPerDay: 10,
    pickupDays: 1,
    dropDays: 1,
  },
  {
    key: "trailer",
    label: "Trailer / Multi-Axle",
    short: "Flatbed & Low-Bed",
    blurb: "High-capacity flatbeds, low-beds and extendable multi-axles.",
    serviceTitle: "Road Transportation",
    icon: Loader2,
    speedKph: 45,
    driveHoursPerDay: 9,
    pickupDays: 1,
    dropDays: 1,
  },
  {
    key: "odc",
    label: "ODC / Heavy Haulage",
    short: "Oversized Cargo",
    blurb: "Hydraulic modular axles with route surveys & statutory permits.",
    serviceTitle: "Heavy Cargo & ODC",
    icon: Ship,
    speedKph: 32,
    driveHoursPerDay: 7,
    pickupDays: 4,
    dropDays: 2,
  },
  {
    key: "project",
    label: "Project Cargo",
    short: "EPC / Turnkey",
    blurb: "Synchronized multi-package convoys matching site readiness.",
    serviceTitle: "Heavy Cargo & ODC",
    icon: Boxes,
    speedKph: 40,
    driveHoursPerDay: 8,
    pickupDays: 3,
    dropDays: 2,
  },
];

/** Corridor region grouping, so long lists of states collapse into 5 belts. */
export type CorridorRegion =
  | "north"
  | "west"
  | "central"
  | "south"
  | "east";

const REGION_BY_STATE: Record<string, CorridorRegion> = {
  Gujarat: "west",
  Maharashtra: "west",
  Goa: "west",
  Rajasthan: "north",
  Delhi: "north",
  Haryana: "north",
  Punjab: "north",
  "Uttar Pradesh": "north",
  "Jammu & Kashmir": "north",
  "Madhya Pradesh": "central",
  Chhattisgarh: "central",
  Telangana: "south",
  Karnataka: "south",
  "Tamil Nadu": "south",
  "Andhra Pradesh": "south",
  Kerala: "south",
  Odisha: "east",
  Jharkhand: "east",
  "West Bengal": "east",
  Bihar: "east",
  Assam: "east",
};

interface Corridor {
  highway: string;
  via: string;
}

const CORRIDORS: Record<string, Corridor> = {
  "west-west": {
    highway: "NH-48",
    via: "Vadodara – Surat – Mumbai western coastal belt; intra-state legs via NH-48 / NH-27",
  },
  "west-north": {
    highway: "NH-48 / NH-44",
    via: "Surat – Vadodara – Udaipur – Ajmer – Jaipur – Delhi-NCR, then NH-44 north",
  },
  "west-central": {
    highway: "NH-47 / NH-53",
    via: "Godhra – Jhabua – Indore (MP belt) and Nashik – Nagpur legs",
  },
  "west-south": {
    highway: "NH-48 / NH-52",
    via: "Mumbai – Pune – Belagavi – Bengaluru corridor, fanning to Chennai / Hyderabad",
  },
  "west-east": {
    highway: "NH-16 / NH-44",
    via: "Nagpur – Raipur – Kolkata (East–West Corridor) via NH-44 to NH-16",
  },
  "north-west": {
    highway: "NH-48 / NH-44",
    via: "Surat – Vadodara – Udaipur – Ajmer – Jaipur – Delhi-NCR, then NH-44 north",
  },
  "north-north": {
    highway: "NH-44 / NH-27",
    via: "Delhi – Ambala – Ludhiana belt and Agra – Lucknow links",
  },
  "north-central": {
    highway: "NH-44 / NH-27",
    via: "Jhansi – Kanpur (NH-27) and Gwalior – Bhopal (NH-44/46) links",
  },
  "north-south": {
    highway: "NH-44",
    via: "Agra – Gwalior – Jhansi – Nagpur – Hyderabad – Bengaluru (North–South Corridor)",
  },
  "north-east": {
    highway: "NH-27 / NH-19",
    via: "Prayagraj – Varanasi – Patna – Kolkata belt",
  },
  "central-west": {
    highway: "NH-47 / NH-53",
    via: "Godhra – Jhabua – Indore (MP belt) and Nashik – Nagpur legs",
  },
  "central-north": {
    highway: "NH-44 / NH-27",
    via: "Jhansi – Kanpur (NH-27) and Gwalior – Bhopal (NH-44/46) links",
  },
  "central-central": {
    highway: "NH-46 / NH-45",
    via: "Inter-state MP / Chhattisgarh highway belt",
  },
  "central-south": {
    highway: "NH-44 / NH-63",
    via: "Nagpur – Hyderabad (NH-44) and Gwalior link legs",
  },
  "central-east": {
    highway: "NH-53 / NH-16",
    via: "Raipur – Bilaspur – Ranchi – Kolkata belt",
  },
  "south-west": {
    highway: "NH-48 / NH-52",
    via: "Mumbai – Pune – Belagavi – Bengaluru corridor, fanning to Chennai / Hyderabad",
  },
  "south-north": {
    highway: "NH-44",
    via: "Agra – Gwalior – Jhansi – Nagpur – Hyderabad – Bengaluru (North–South Corridor)",
  },
  "south-central": {
    highway: "NH-44 / NH-63",
    via: "Nagpur – Hyderabad (NH-44) and Gwalior link legs",
  },
  "south-south": {
    highway: "NH-44 / NH-48",
    via: "Bengaluru – Chennai – Vellore and coastal plateau links",
  },
  "south-east": {
    highway: "NH-16",
    via: "Chennai – Vijayawada – Kolkata (Eastern Coastal Corridor, NH-16)",
  },
  "east-west": {
    highway: "NH-16 / NH-44",
    via: "Nagpur – Raipur – Kolkata (East–West Corridor) via NH-44 to NH-16",
  },
  "east-north": {
    highway: "NH-27 / NH-19",
    via: "Prayagraj – Varanasi – Patna – Kolkata belt",
  },
  "east-central": {
    highway: "NH-53 / NH-16",
    via: "Raipur – Bilaspur – Ranchi – Kolkata belt",
  },
  "east-south": {
    highway: "NH-16",
    via: "Chennai – Vijayawada – Kolkata (Eastern Coastal Corridor, NH-16)",
  },
  "east-east": {
    highway: "NH-16 / NH-27",
    via: "Regional NH network across Odisha, Bengal, Jharkhand & NE",
  },
};

const DEFAULT_CORRIDOR: Corridor = {
  highway: "NH Network",
  via: "Optimized National Highway corridor — final route confirmed at tariff evaluation",
};

function regionOf(place: { state?: string }): CorridorRegion {
  return (place.state && REGION_BY_STATE[place.state]) || "east";
}

function suggestCorridor(from: { state?: string }, to: { state?: string }): Corridor {
  const a = regionOf(from);
  const b = regionOf(to);
  return (
    CORRIDORS[`${a}-${b}`] ||
    CORRIDORS[`${b}-${a}`] ||
    DEFAULT_CORRIDOR
  );
}

/** Great-circle distance between two coordinates in kilometres. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Indicative road network factor used only by the offline fallback. */
export const ROAD_NETWORK_FACTOR = 1.25;

/** A route endpoint (city from the offline dataset, or a Google-selected place). */
export interface EstimateEndpoint {
  name: string;
  state?: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface DeliveryWindow {
  earliest: Date;
  latest: Date;
  /** Whole days between the two window bounds (informative). */
  spanDays: number;
}

export interface RouteEstimate {
  from: EstimateEndpoint;
  to: EstimateEndpoint;
  vehicle: VehicleProfile;
  straightLineKm: number;
  roadDistanceKm: number;
  /** On-road driving time in hours (1 decimal). */
  transitHours: number;
  /** Raw driving time (seconds) as reported by the routing provider. */
  drivingSeconds: number;
  /** Full driving days implied by the daily driving limit. */
  transitDays: number;
  /** Days from today until the first possible delivery. */
  earliestDays: number;
  /** Days from today until the last planned delivery. */
  latestDays: number;
  window: DeliveryWindow;
  corridor: Corridor;
  /** When true, this estimate used the offline haversine model (Maps unavailable). */
  fallback: boolean;
}

const pad = (n: number) => `${n}`.padStart(2, "0");

export function formatDate(d: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function resolveVehicle(vehicleKey: VehicleKey): VehicleProfile {
  return VEHICLES.find((v) => v.key === vehicleKey) || VEHICLES[1];
}

/**
 * Core estimator: applies the Arrowline service-class rules to a real route
 * (road distance + driving duration from Google Directions).
 */
export function buildEstimate(opts: {
  from: EstimateEndpoint;
  to: EstimateEndpoint;
  vehicleKey: VehicleKey;
  roadDistanceKm: number;
  drivingSeconds: number;
  fallback?: boolean;
}): RouteEstimate {
  const vehicle = resolveVehicle(opts.vehicleKey);
  const straightLineKm = haversineKm(opts.from.lat, opts.from.lng, opts.to.lat, opts.to.lng);
  const drivingHours = Math.max(1, opts.drivingSeconds / 3600);
  // A driver switch can keep heavy routes moving close to the limit, but we
  // still cap the practical daily window for safety & rest compliance.
  const transitDays = Math.max(1, Math.ceil(drivingHours / vehicle.driveHoursPerDay));
  const earliestDays = vehicle.pickupDays + transitDays;
  const latestDays = earliestDays + vehicle.dropDays;

  const today = new Date();
  const earliest = new Date(today);
  earliest.setDate(today.getDate() + earliestDays);
  const latest = new Date(today);
  latest.setDate(today.getDate() + latestDays);

  return {
    from: opts.from,
    to: opts.to,
    vehicle,
    straightLineKm: Math.round(straightLineKm),
    roadDistanceKm: Math.round(opts.roadDistanceKm),
    transitHours: Math.round(drivingHours * 10) / 10,
    drivingSeconds: opts.drivingSeconds,
    transitDays,
    earliestDays,
    latestDays,
    window: { earliest, latest, spanDays: vehicle.dropDays + 1 },
    corridor: suggestCorridor(opts.from, opts.to),
    fallback: opts.fallback ?? false,
  };
}

/** Estimate from a live Google Directions route (primary path). */
export function estimateFromDirections(opts: {
  route: { distanceMeters: number; durationSeconds: number };
  from: EstimateEndpoint;
  to: EstimateEndpoint;
  vehicleKey: VehicleKey;
}): RouteEstimate {
  return buildEstimate({
    from: opts.from,
    to: opts.to,
    vehicleKey: opts.vehicleKey,
    roadDistanceKm: opts.route.distanceMeters / 1000,
    drivingSeconds: opts.route.durationSeconds,
  });
}

function cityToEndpoint(city: City): EstimateEndpoint {
  return { name: city.name, state: city.state, lat: city.lat, lng: city.lng };
}

/**
 * Offline fallback: estimates road distance via haversine * Indian highway
 * network factor. Only used when the live Maps library cannot be loaded.
 */
export function estimateRoute(from: City, to: City, vehicleKey: VehicleKey): RouteEstimate {
  const vehicle = resolveVehicle(vehicleKey);
  const straightLineKm = haversineKm(from.lat, from.lng, to.lat, to.lng);
  const roadDistanceKm = Math.round((straightLineKm * (straightLineKm < 100 ? 1.15 : ROAD_NETWORK_FACTOR)) / 10) * 10;
  return buildEstimate({
    from: cityToEndpoint(from),
    to: cityToEndpoint(to),
    vehicleKey,
    roadDistanceKm,
    drivingSeconds: (roadDistanceKm / vehicle.speedKph) * 3600,
    fallback: true,
  });
}

/** Builds the ContactForm pre-fill message from a finished estimate. */
export function estimateToPrefill(estimate: RouteEstimate): string {
  const lines = [
    "[Transit Time Estimator] Route:",
    `${estimate.from.name}${estimate.from.state ? ` (${estimate.from.state})` : ""} → ${estimate.to.name}${estimate.to.state ? ` (${estimate.to.state})` : ""}`,
    `Vehicle: ${estimate.vehicle.label}`,
    estimate.fallback
      ? `Indicative distance: ~${estimate.roadDistanceKm.toLocaleString("en-IN")} km | Transit ~${estimate.transitDays} day(s)`
      : `Google Maps route: ~${estimate.roadDistanceKm.toLocaleString("en-IN")} km | Driving ≈ ${estimate.transitHours} h (~${estimate.transitDays} driving day(s))`,
    `Delivery window: ${formatDate(estimate.window.earliest)} – ${formatDate(estimate.window.latest)}`,
    `Suggested corridor: ${estimate.corridor.highway}${estimate.corridor.via ? ` via ${estimate.corridor.via}` : ""}`,
    "Please share exact tariff and the earliest dispatch slot.",
  ];
  if (estimate.from.address) lines.splice(1, 0, `Origin address: ${estimate.from.address}`);
  if (estimate.to.address) lines.splice(2, 0, `Destination address: ${estimate.to.address}`);
  return lines.join("\n");
}

/** Quick lanes surfaced on the widget (resolved by hub name from the dataset). */
export function resolveQuickLane(fromName: string, toName: string): { from: City; to: City } | null {
  const from = findCityByName(fromName);
  const to = findCityByName(toName);
  if (!from || !to || from.id === to.id) return null;
  return { from, to };
}

export const QUICK_LANES: Array<{ from: string; to: string; label: string }> = [
  { from: "Mundra", to: "Delhi", label: "Mundra → Delhi NCR" },
  { from: "Mundra", to: "Mumbai", label: "Mundra → Mumbai" },
  { from: "Mundra", to: "Jaipur", label: "Mundra → Jaipur" },
  { from: "Mundra", to: "Bengaluru", label: "Mundra → Bengaluru" },
  { from: "Ahmedabad", to: "Pune", label: "Ahmedabad → Pune" },
];