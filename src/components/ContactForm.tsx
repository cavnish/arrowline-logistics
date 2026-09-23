import { useRef, useState } from "react";
import { Mail, Phone, Building2, User, ChevronDown, MessageSquare, AlertCircle, Sparkles, Send, ShieldCheck } from "lucide-react";
import { CORE_SERVICES, COMPANY_DETAILS } from "../data/logisticsData";
import { submitLead } from "../services/leadService";
import { cn } from "../utils/cn";
import { useSiteContent } from "../hooks/useSiteContent";

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  referenceNumber?: string;
  storedInDatabase?: boolean;
  emailSent?: boolean;
}

interface ContactFormProps {
  onSuccess: (data: LeadFormData) => void;
  defaultService?: string;
  isCompact?: boolean;
}

export default function ContactForm({ onSuccess, defaultService = "", isCompact = false }: ContactFormProps) {
  const content = useSiteContent();
  const phone = content("contact_phone", COMPANY_DETAILS.phone);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: defaultService,
    message: "",
    consent: false,
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Guard against double submissions (double-click, re-entrancy) without
  // introducing any artificial delay.
  const submittingRef = useRef(false);

  const fieldIds = {
    name: "cf-name",
    company: "cf-company",
    email: "cf-email",
    phone: "cf-phone",
    service: "cf-service",
    message: "cf-message",
    consent: "cf-consent",
    honeypot: "cf-hp",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (submitError) setSubmitError(null);
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.company.trim()) newErrors.company = "Company/Organization name is required.";
    if (!formData.email.trim()) newErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[+]?[0-9\s-]{10,14}$/.test(formData.phone)) newErrors.phone = "Provide a valid 10-12 digit phone number.";
    if (!formData.service) newErrors.service = "Please select a logistics service.";
    if (!formData.consent) newErrors.consent = "You must agree to operational communications.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;
    if (submittingRef.current) return;
    if (!validateForm()) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Submit to the configured production backend.
      const result = await submitLead({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
      });

      onSuccess({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        referenceNumber: result.referenceNumber,
        storedInDatabase: result.storedInDatabase,
        emailSent: result.emailSent,
      });
      setFormData({
        name: "", company: "", email: "", phone: "",
        service: defaultService, message: "", consent: false, honeypot: "",
      });
    } catch (err) {
      console.error("Lead submission error: ", err);
      setSubmitError(
        err instanceof Error ? err.message : "Unable to submit your request. Please try again."
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full bg-[#FEF9F0] text-xs py-2.5 pl-9 pr-3.5 rounded-lg border text-[#1E3A8A] placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:bg-white focus-visible:ring-[#FF7A00]/30";
  const inputOk = "border-slate-200 focus:border-[#FF7A00] focus:ring-[#FF7A00]/20";
  const inputErr = "border-red-400 focus:ring-red-400/20";

  const fieldLabelClass =
    "block text-[10px] font-bold text-[#1E3A8A] uppercase tracking-[0.1em]";
  const fieldErrorClass =
    "text-red-500 text-[10px] flex items-center space-x-1 mt-0.5";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "bg-white border border-slate-200 rounded-2xl relative shadow-xl overflow-hidden",
        isCompact ? "p-4 sm:p-5 space-y-3" : "p-5 sm:p-6 space-y-4"
      )}
    >
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#FF7A00] to-[#FFB366]" />

      {!isCompact && (
        <div className="space-y-0.5 pb-1">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FF7A00] flex items-center space-x-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Mundra Port Dispatch Desk</span>
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#1E3A8A] tracking-tight leading-tight">
            Request a Free <span className="text-[#FF7A00]">Shipping Quote</span>
          </h3>
          <p className="text-[11px] leading-snug text-slate-500">
            Optimized door-to-door multimodal rates, compiled by our routing architects within 2 hours.
          </p>
        </div>
      )}

      {isCompact && (
        <div className="space-y-0.5 pb-0.5">
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#FF7A00]">
            Quick Quote Request
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#1E3A8A] tracking-tight leading-tight">
            Get an <span className="text-[#FF7A00]">Instant Estimate</span>
          </h3>
        </div>
      )}

      <div aria-live="polite">
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 flex items-start space-x-2" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={fieldIds.honeypot}>Leave this blank</label>
        <input type="text" id={fieldIds.honeypot} name="honeypot" value={formData.honeypot} onChange={handleChange} autoComplete="off" tabIndex={-1} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor={fieldIds.name} className={fieldLabelClass}>
            Full Name <span className="text-[#FF7A00]">*</span>
          </label>
          <div className="relative">
            <User className={iconClass} />
            <input
              type="text"
              id={fieldIds.name}
              name="name"
              placeholder="e.g. Ramesh Patel"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "cf-name-error" : undefined}
              className={cn(inputBase, errors.name ? inputErr : inputOk)}
            />
          </div>
          {errors.name && <p id="cf-name-error" className={fieldErrorClass}><AlertCircle className="w-3 h-3" /><span>{errors.name}</span></p>}
        </div>

        <div className="space-y-1">
          <label htmlFor={fieldIds.company} className={fieldLabelClass}>
            Company <span className="text-[#FF7A00]">*</span>
          </label>
          <div className="relative">
            <Building2 className={iconClass} />
            <input
              type="text"
              id={fieldIds.company}
              name="company"
              placeholder="e.g. Adani Exports Pvt Ltd"
              value={formData.company}
              onChange={handleChange}
              autoComplete="organization"
              aria-required="true"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "cf-company-error" : undefined}
              className={cn(inputBase, errors.company ? inputErr : inputOk)}
            />
          </div>
          {errors.company && <p id="cf-company-error" className={fieldErrorClass}><AlertCircle className="w-3 h-3" /><span>{errors.company}</span></p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor={fieldIds.email} className={fieldLabelClass}>
            Email <span className="text-[#FF7A00]">*</span>
          </label>
          <div className="relative">
            <Mail className={iconClass} />
            <input
              type="email"
              id={fieldIds.email}
              name="email"
              placeholder="ramesh@company.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "cf-email-error" : undefined}
              className={cn(inputBase, errors.email ? inputErr : inputOk)}
            />
          </div>
          {errors.email && <p id="cf-email-error" className={fieldErrorClass}><AlertCircle className="w-3 h-3" /><span>{errors.email}</span></p>}
        </div>

        <div className="space-y-1">
          <label htmlFor={fieldIds.phone} className={fieldLabelClass}>
            Phone <span className="text-[#FF7A00]">*</span>
          </label>
          <div className="relative">
            <Phone className={iconClass} />
            <input
              type="tel"
              id={fieldIds.phone}
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              aria-required="true"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "cf-phone-error" : undefined}
              className={cn(inputBase, errors.phone ? inputErr : inputOk)}
            />
          </div>
          {errors.phone && <p id="cf-phone-error" className={fieldErrorClass}><AlertCircle className="w-3 h-3" /><span>{errors.phone}</span></p>}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor={fieldIds.service} className={fieldLabelClass}>
          Service of Interest <span className="text-[#FF7A00]">*</span>
        </label>
        <div className="relative">
          <select
            id={fieldIds.service}
            name="service"
            value={formData.service}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "cf-service-error" : undefined}
            className={cn("w-full bg-[#FEF9F0] text-xs py-2.5 px-4 pr-9 rounded-lg border text-[#1E3A8A] appearance-none transition-all focus:outline-none focus:ring-2 focus:bg-white focus-visible:ring-[#FF7A00]/30 cursor-pointer",
              errors.service ? "border-red-400 focus:ring-red-400/20" : "border-slate-200 focus:border-[#FF7A00] focus:ring-[#FF7A00]/20")}
          >
            <option value="" disabled>-- Select Logistics Vertical --</option>
            {CORE_SERVICES.map((srv) => (
              <option key={srv.id} value={srv.title}>{srv.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
        {errors.service && <p id="cf-service-error" className={fieldErrorClass}><AlertCircle className="w-3 h-3" /><span>{errors.service}</span></p>}
      </div>

      <div className="space-y-1">
        <label htmlFor={fieldIds.message} className={fieldLabelClass}>
          Message & Cargo Specifications <span className="text-slate-400 normal-case">(optional)</span>
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <textarea
            id={fieldIds.message}
            name="message"
            rows={isCompact ? 2 : 3}
            placeholder="e.g. Dimensions, tonnage, cargo type, loading schedules..."
            value={formData.message}
            onChange={handleChange}
            autoComplete="off"
            className="w-full bg-[#FEF9F0] text-xs py-2.5 pl-9 pr-3.5 rounded-lg border border-slate-200 text-[#1E3A8A] placeholder-slate-400 resize-none transition-all focus:outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 focus:bg-white focus-visible:ring-[#FF7A00]/30" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-start space-x-2 text-[11px] text-slate-600 select-none">
          <input
            type="checkbox"
            id={fieldIds.consent}
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "cf-consent-error" : undefined}
            className="mt-0.5 rounded text-[#FF7A00] bg-white border-slate-300 focus:ring-[#FF7A00]/30 h-3.5 w-3.5 flex-shrink-0 cursor-pointer accent-[#FF7A00]"
          />
          <label htmlFor={fieldIds.consent} className="leading-snug cursor-pointer">
            I agree to receive transactional updates and tariff quotes from Arrowline via email, SMS, and WhatsApp per our <span className="text-[#1E3A8A] underline font-semibold">Terms of Carriage</span>.
          </label>
        </div>
        {errors.consent && <p id="cf-consent-error" className={fieldErrorClass}><AlertCircle className="w-3 h-3" /><span>{errors.consent}</span></p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={cn(
            "w-full py-3 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00]/50 focus-visible:ring-offset-2",
            isSubmitting
              ? "bg-slate-400 cursor-wait"
              : "bg-[#FF7A00] hover:bg-[#E56D00] active:scale-[0.99] hover:shadow-[0_8px_24px_rgba(255,122,0,0.35)] hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
          )}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Submitting inquiry…</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Request Free Quote →</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[10px] text-center text-slate-500 leading-normal flex items-center justify-center space-x-1">
        <ShieldCheck className="w-3 h-3 text-slate-400" />
        <span>
          Secured with anti-spam honeypot. Priority dispatch: <strong className="text-[#1E3A8A]">{phone}</strong>
        </span>
      </p>
    </form>
  );
}