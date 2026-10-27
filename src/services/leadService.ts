/**
 * Lead submission service.
 *
 * Uses the configured backend URL when VITE_API_URL is set. In production,
 * it uses same-origin /api/lead when no explicit URL is configured. Failures
 * are returned to the caller; inquiries are never reported as stored locally.
 */

import { apiUrl, API_URL } from "../lib/api";

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

function shouldAttemptBackend(): boolean {
  return Boolean(API_URL) || import.meta.env.PROD === true;
}

function generateReferenceNumber(): string {
  return `ALQ-${Math.floor(100000 + Math.random() * 900000)}`;
}

async function readError(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.error || body?.message || `Backend request failed (${response.status})`;
}

/**
 * Submits a customer inquiry to the configured backend.
 * A failed request is never represented as a successful local submission.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  if (!shouldAttemptBackend()) {
    throw new Error("Backend is not configured for this environment");
  }

  const controller = new AbortController();
  // Render may need several seconds to wake a sleeping instance.
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(apiUrl("/api/lead"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    const data = await response.json();
    return {
      ok: true,
      referenceNumber: data.referenceNumber || generateReferenceNumber(),
      storedInDatabase: data.storedInDatabase === true,
      emailSent: data.emailSent === true,
      message: data.message,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "We couldn't connect to the quote service. Please try again in a moment, or contact our logistics desk directly."
      );
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "The quote service is taking longer than expected. Please try again shortly."
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
