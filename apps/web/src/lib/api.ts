/**
 * Base URL of the private Express API (forms, leads, admin).
 * Server-only secrets never live here — this is a public origin.
 */
const configured = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");

export const API_URL = configured;

export function apiUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return API_URL ? `${API_URL}${clean}` : clean;
}
