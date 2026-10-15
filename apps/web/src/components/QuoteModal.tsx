"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import ContactForm from "./ContactForm";
import {
  clearQuotePrefill,
  subscribeQuoteForm,
  type QuotePrefill,
} from "@/lib/estimator/quoteBus";

/**
 * Global quote dialog. Subscribes to the same quoteBus the estimator uses so
 * any widget can open the contact form pre-filled without prop-drilling.
 */
export default function QuoteModal() {
  const [prefill, setPrefill] = useState<QuotePrefill | null>(null);

  useEffect(() => subscribeQuoteForm((next) => setPrefill(next)), []);

  if (!prefill) return null;

  const close = () => {
    clearQuotePrefill();
    setPrefill(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Request a quote"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-dark/80 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close quote form"
          className="absolute right-4 top-4 z-50 rounded-xl border border-slate-200 bg-surface p-2 text-slate-500 transition-all hover:text-navy"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="max-h-[85vh] overflow-y-auto p-6">
          <ContactForm prefill={prefill} onCancel={close} />
        </div>
      </div>
    </div>
  );
}
