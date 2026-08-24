/**
 * Lead submission service.
 *
 * Auto-detects where to send inquiries:
 *
 *   1. If VITE_API_URL is set → uses that (e.g. https://api.arrowlinelogistics.in)
 *   2. Otherwise → uses same-origin /api/lead
 *      (this "just works" on Vercel where the /api folder becomes serverless
 *      functions at the same domain)
 *   3. If both fail → gracefully falls back to a client-side mock so the UX
 *      is never blocked during development.
 *
 * See SETUP_MONGODB.md for full deployment instructions.
 */

export interface LeadPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface LeadResponse {
  ok: boolean;
  referenceNumber: string;
  storedInDatabase: boolean;
  emailSent: boolean;
  message?: string;
}

/**
 * Resolves the endpoint URL for a given API path.
 * If VITE_API_URL is empty, uses same-origin (Vercel-friendly).
 */
function apiUrl(path: string): string {
  const base = (import.meta as any).env?.VITE_API_URL || "";
  if (base) return `${base.replace(/\/$/, "")}${path}`;
  return path; // relative → resolved against current origin
}

function generateReferenceNumber(): string {
  return `ALQ-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Whether the backend appears to be configured (either explicit URL or
 * we can attempt same-origin requests).
 */
function isBackendConfigurable(): boolean {
  const explicit = (import.meta as any).env?.VITE_API_URL;
  if (explicit) return true;
  // In dev, same-origin will just be Vite's dev server which doesn't have /api.
  // Only attempt same-origin when running in production (built site).
  return (import.meta as any).env?.PROD === true;
}

/**
 * Submits a customer inquiry.
 * Attempts the live backend first, then gracefully falls back to a mock.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  if (isBackendConfigurable()) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(apiUrl("/api/lead"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        return {
          ok: true,
          referenceNumber: data.referenceNumber || generateReferenceNumber(),
          storedInDatabase: data.storedInDatabase ?? true,
          emailSent: data.emailSent ?? true,
          message: data.message,
        };
      }

      const errText = await response.text().catch(() => "");
      console.warn(
        `[leadService] Backend responded with ${response.status}. Falling back to mock. ${errText}`
      );
    } catch (err) {
      console.warn("[leadService] Backend unreachable, using mock:", err);
    }
  }

  // Mock fallback (simulate ~1.2s latency)
  await new Promise((res) => setTimeout(res, 1200));

  return {
    ok: true,
    referenceNumber: generateReferenceNumber(),
    storedInDatabase: false,
    emailSent: false,
    message:
      "Simulated success — backend not reachable. See SETUP_MONGODB.md to enable MongoDB & email.",
  };
}

/**
 * Optional health-check for the admin/status badge.
 * Returns null if the backend cannot be reached.
 */
export async function checkBackendHealth(): Promise<{
  ok: boolean;
  mongo: string;
  smtp: string;
} | null> {
  if (!isBackendConfigurable()) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(apiUrl("/api/health"), { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const data = await response.json();
    // Handle both response formats:
    //   Express server:  { ok, checks: { mongo, smtp } }
    //   Vercel function: { ok, checks: { mongo, smtp } }
    //   Legacy:          { ok, mongo, smtp }
    const checks = data.checks || {};
    return {
      ok: data.ok === true,
      mongo: checks.mongo || data.mongo || "unknown",
      smtp: checks.smtp || data.smtp || "unknown",
    };
  } catch {
    return null;
  }
}
