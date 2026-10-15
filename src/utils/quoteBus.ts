/**
 * Tiny module-level event bus that lets any in-page widget (like the Transit
 * Time Estimator) open the global quote modal with a pre-filled service and
 * message — without threading `onOpenQuote` props through every consumer.
 *
 * The global modal in App.tsx subscribes once; existing `onOpenQuote()`
 * callers that open the modal directly are unaffected.
 */

export interface QuotePrefill {
  service?: string;
  message?: string;
}

type Listener = (prefill: QuotePrefill | null) => void;

let currentPrefill: QuotePrefill | null = null;
const listeners = new Set<Listener>();

/** Open the global quote form, optionally pre-filled. */
export function openQuoteForm(prefill: QuotePrefill | null = null): void {
  currentPrefill = prefill;
  listeners.forEach((listener) => listener(prefill));
}

/** Subscribe to quote-modal-open events. Returns an unsubscribe function. */
export function subscribeQuoteForm(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getQuotePrefill(): QuotePrefill | null {
  return currentPrefill;
}

/** Clear the pending pre-fill (should be called when the modal closes). */
export function clearQuotePrefill(): void {
  currentPrefill = null;
}