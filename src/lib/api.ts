/**
 * Central API base URL configuration for the Arrowline frontend.
 *
 * Resolution order:
 * 1. `VITE_API_URL` when set
 *    - Local dev:  http://localhost:5000
 *    - Vercel:     https://YOUR-RENDER-SERVICE.onrender.com
 * 2. Dev fallback: http://localhost:5000 (local Express backend on the
 *    default port, so `npm run dev` works even without a `.env` file).
 * 3. Otherwise (production build without VITE_API_URL): same-origin /api/*
 *    — preserves the legacy model where the Express server hosts dist/.
 *
 * Backend-only secrets must never be exposed through VITE_* variables.
 */

const configuredApiUrl = String(import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/+$/, "");

export const API_URL: string =
  configuredApiUrl ||
  (import.meta.env.DEV === true ? "http://localhost:5000" : "");

/** Builds an absolute (or same-origin) URL for an API path. */
export function apiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return API_URL ? `${API_URL}${cleanPath}` : cleanPath;
}