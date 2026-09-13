import { useState } from "react";
import { Mail, Phone, Building2, User, ChevronDown, MessageSquare, AlertCircle, Sparkles, Send } from "lucide-react";
import { CORE_SERVICES, COMPANY_DETAILS } from "../data/logisticsData";
import { submitLead } from "../services/leadService";
import { cn } from "../utils/cn";

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
    if (!validateForm()) return;
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
      setIsSubmitting(false);
    }
  };

  const inputBase = "w-full bg-[#FEF9F0] text-xs py-3 pl-10 pr-4 rounded-xl border text-[#1E3A8A] placeholder-slate-400 focus:outline-none focus:ring-2 transition-all focus:bg-white";
  const inputOk = "border-slate-200 focus:border-[#FF7A00] focus:ring-[#FF7A00]/20";
  const inputErr = "border-red-400 focus:ring-red-400/20";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-white border border-slate-200 rounded-2xl relative shadow-xl overflow-hidden",
        isCompact ? "p-5 space-y-4" : "p-6 lg:p-10 space-y-5"
      )}
    >
      <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-[#FF7A00] to-[#FFB366]" />

      {!isCompact && (
        <div className="space-y-1.5 pb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mundra Port Dispatch Desk</span>
          </span>
          <h3 className="text-xl lg:text-2xl font-black text-[#1E3A8A] tracking-tight">
            Request a Free <span className="text-[#FF7A00]">Shipping Quote</span>
          </h3>
          <p className="text-xs text-slate-500">
            Submit your cargo metrics. Our routing architects will compile optimized door-to-door multimodal rates within 2 hours.
          </p>
        </div>
      )}

      {isCompact && (
        <div className="space-y-1 pb-1">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FF7A00]">
            Quick Quote Request
          </span>
          <h3 className="text-lg font-black text-[#1E3A8A] tracking-tight">
            Get an <span className="text-[#FF7A00]">Instant Estimate</span>
          </h3>
        </div>
      )}

      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start space-x-2" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="form_username_track">Leave this blank</label>
        <input type="text" id="form_username_track" name="honeypot" value={formData.honeypot} onChange={handleChange} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">
            Full Name <span className="text-[#FF7A00]">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" name="name" placeholder="e.g. Ramesh Patel" value={formData.name} onChange={handleChange}
              className={cn(inputBase, errors.name ? inputErr : inputOk)} />
          </div>
          {errors.name && <p className="text-red-500 text-[10px] flex items-center space-x-1 mt-1"><AlertCircle className="w-3 h-3" /><span>{errors.name}</span></p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">
            Company <span className="text-[#FF7A00]">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" name="company" placeholder="e.g. Adani Exports Pvt Ltd" value={formData.company} onChange={handleChange}
              className={cn(inputBase, errors.company ? inputErr : inputOk)} />
          </div>
          {errors.company && <p className="text-red-500 text-[10px] flex items-center space-x-1 mt-1"><AlertCircle className="w-3 h-3" /><span>{errors.company}</span></p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">
            Email <span className="text-[#FF7A00]">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="email" name="email" placeholder="ramesh@company.com" value={formData.email} onChange={handleChange}
              className={cn(inputBase, errors.email ? inputErr : inputOk)} />
          </div>
          {errors.email && <p className="text-red-500 text-[10px] flex items-center space-x-1 mt-1"><AlertCircle className="w-3 h-3" /><span>{errors.email}</span></p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">
            Phone <span className="text-[#FF7A00]">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange}
              className={cn(inputBase, errors.phone ? inputErr : inputOk)} />
          </div>
          {errors.phone && <p className="text-red-500 text-[10px] flex items-center space-x-1 mt-1"><AlertCircle className="w-3 h-3" /><span>{errors.phone}</span></p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">
          Service of Interest <span className="text-[#FF7A00]">*</span>
        </label>
        <div className="relative">
          <select name="service" value={formData.service} onChange={handleChange}
            className={cn("w-full bg-[#FEF9F0] text-xs py-3 px-4 rounded-xl border text-[#1E3A8A] appearance-none focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer",
              errors.service ? "border-red-400 focus:ring-red-400/20" : "border-slate-200 focus:border-[#FF7A00] focus:ring-[#FF7A00]/20")}>
            <option value="" disabled>-- Select Logistics Vertical --</option>
            {CORE_SERVICES.map((srv) => (
              <option key={srv.id} value={srv.title}>{srv.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {errors.service && <p className="text-red-500 text-[10px] flex items-center space-x-1 mt-1"><AlertCircle className="w-3 h-3" /><span>{errors.service}</span></p>}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">
          Message & Cargo Specifications (Optional)
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <textarea name="message" rows={isCompact ? 2 : 4}
            placeholder="e.g. Dimensions of ODC, tonnage, cargo type, loading schedules from Mundra, destinations..."
            value={formData.message} onChange={handleChange}
            className="w-full bg-[#FEF9F0] text-xs py-3 pl-10 pr-4 rounded-xl border border-slate-200 text-[#1E3A8A] placeholder-slate-400 focus:outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 focus:bg-white transition-all resize-none" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="flex items-start space-x-2 text-xs text-slate-600 select-none cursor-pointer">
          <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange}
            className="mt-0.5 rounded text-[#FF7A00] bg-white border-slate-300 focus:ring-[#FF7A00]/30 h-4 w-4 flex-shrink-0 cursor-pointer accent-[#FF7A00]" />
          <span className="leading-tight">
            I agree to receive transactional updates and tariff quotes from Arrowline via email, SMS, and WhatsApp per our <span className="text-[#1E3A8A] underline font-semibold">Terms of Carriage</span>.
          </span>
        </label>
        {errors.consent && <p className="text-red-500 text-[10px] flex items-center space-x-1 mt-1"><AlertCircle className="w-3 h-3" /><span>{errors.consent}</span></p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-4 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-md",
            isSubmitting
              ? "bg-slate-400 cursor-wait"
              : "bg-[#FF7A00] hover:bg-[#E56D00] hover:shadow-[0_8px_24px_rgba(255,122,0,0.4)] hover:-translate-y-0.5"
          )}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Authenticating Route...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Request Free Quote →</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[10px] text-center text-slate-500 leading-normal">
        Secured with anti-spam honeypot. Priority dispatch: <strong className="text-[#1E3A8A]">{COMPANY_DETAILS.phone}</strong>
      </p>
    </form>
  );
}
