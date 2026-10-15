/**
 * Google Directions wrapper used by the Transit Time Estimator.
 *
 * Turns two selected `MapPlace`s into a real driving route (polyline, road
 * distance, drive time). No distance/ETA is ever hardcoded — everything comes
 * from the Directions service for the selected coordinates.
 */

import type { DrivingRoute, MapPlace } from "./types";

function describeDirectionsError(err: unknown): string {
  const candidate = err as { status?: string; message?: string } | null;
  const status = candidate?.status;
  if (status === "ZERO_RESULTS") {
    return "Google couldn't find a driving route between these two locations — they may not be road-connected.";
  }
  if (status === "NOT_FOUND") {
    return "One of the selected locations couldn't be mapped. Pick both ends from the search suggestions.";
  }
  if (status === "OVER_QUERY_LIMIT") {
    return "Google Maps hit a temporary request limit. Please wait a moment and try again.";
  }
  if (status === "REQUEST_DENIED") {
    return "Google Maps is not enabled for these APIs (Maps JavaScript / Directions / Places). Please check the API key configuration.";
  }
  return (
    candidate?.message?.trim() ||
    "Couldn't plot a driving route for this lane. Verify both places and try again — or ask our desk for a route survey."
  );
}

export function requestDirections(
  maps: typeof google.maps,
  origin: MapPlace,
  destination: MapPlace
): Promise<DrivingRoute> {
  const service = new maps.DirectionsService();
  return service
    .route({
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      travelMode: maps.TravelMode.DRIVING,
      provideRouteAlternatives: false,
    })
    .then((result) => {
      const route = result.routes[0];
      const leg = route?.legs[0];
      if (!route || !leg) {
        throw new Error("Google didn't return a driving route for this lane.");
      }
      return {
        overviewPolyline: route.overview_polyline ?? "",
        distanceMeters: leg.distance?.value ?? 0,
        distanceText: leg.distance?.text ?? "",
        durationSeconds: leg.duration?.value ?? 0,
        durationText: leg.duration?.text ?? "",
        originAddress: leg.start_address ?? "",
        destinationAddress: leg.end_address ?? "",
      };
    })
    .catch((err: unknown) => {
      throw new Error(describeDirectionsError(err));
    });
}