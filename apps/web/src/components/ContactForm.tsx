"use client";

import { useState, type FormEvent } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

import { apiUrl } from "@/lib/api";

const SERVICES = [
  "Container Transportation",
  "FTL / LTL Transportation",
  "Rail Freight",
  "ODC & Heavy Haulage",
  "Project Cargo",
  "Warehousing & Storage",
  "Other",
];

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
  honeypot: string;
}

const EMPTY: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  consent: false,
  honeypot: "",
};

export default function ContactForm({ formHeading }: { formHeading?: string | null }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (form.honeypot) return; // bot

    if (!form.name || !form.company || !form.email || !form.phone || !form.service || !form.consent) {
      setError("Please complete all required fields and accept the consent checkbox.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(apiUrl("/api/lead"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          service: form.service,
          message: form.message,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "We couldn't submit your enquiry. Please try again.");
      }
      setReference(data.referenceNumber || "received");
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <ShieldCheck className="h-8 w-8 text-emerald-600" aria-hidden />
        <h3 className="mt-3 text-lg font-black text-navy">Enquiry received</h3>
        <p className="mt-1 text-sm text-slate-600">
          Your reference number is <strong>{reference}</strong>. Our routing team will respond within 2 hours.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-orange focus:ring-2 focus:ring-orange/20";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <h2 className="text-xl font-black text-navy">{formHeading || "Request a quotation"}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Name *</span>
          <input className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Company *</span>
          <input className={inputClass} value={form.company} onChange={(e) => update("company", e.target.value)} required />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Email *</span>
          <input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Phone *</span>
          <input className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Service *</span>
        <select className={inputClass} value={form.service} onChange={(e) => update("service", e.target.value)} required>
          <option value="">Select a service</option>
          {SERVICES.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">Cargo details</span>
        <textarea
          className={inputClass}
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </label>

      {/* Honeypot: hidden from users, tempting to bots */}
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={form.honeypot}
        onChange={(e) => update("honeypot", e.target.value)}
      />

      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} required />
        <span>I consent to Arrowline Logistics contacting me about this enquiry.</span>
      </label>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-orange-bright disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {submitting ? "Submitting…" : "Submit enquiry"}
      </button>
    </form>
  );
}
