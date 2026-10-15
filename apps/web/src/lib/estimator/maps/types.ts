/**
 * Shared value types for the Google Maps-backed Transit Time Estimator.
 *
 * `MapPlace` is the canonical "selected location" carried by the From/To
 * inputs — always a place with real coordinates (from Google Places or our
 * offline city hub dataset), never raw typed text. `DrivingRoute` is the
 * serialisable result of a Google Directions request; components store it as
 * plain data so it survives JSON round-trips and strict mode re-renders.
 */

export type PlaceSource = "places" | "city";

export interface MapPlace {
  /** Stable id ("places:<place_id>" or "city:<city_id>"). */
  key: string;
  /** Short display name. */
  label: string;
  /** Secondary line (state / region / address hint). */
  detail: string;
  /** State name when derivable (drives the corridor-region mapping). */
  state?: string;
  lat: number;
  lng: number;
  /** Full formatted address (Google Places only). */
  address?: string;
  source: PlaceSource;
}

export interface DrivingRoute {
  /** Encoded overview polyline (lat/lng pairs) rendered on the map. */
  overviewPolyline: string;
  distanceMeters: number;
  distanceText: string;
  durationSeconds: number;
  durationText: string;
  originAddress: string;
  destinationAddress: string;
}