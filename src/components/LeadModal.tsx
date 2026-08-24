import { CheckCircle2, X, Download, ShieldCheck, Mail, Phone, ExternalLink, Database, AlertTriangle } from "lucide-react";
import { COMPANY_DETAILS } from "../data/logisticsData";
import { generateLeadPDF } from "../utils/generateLeadPDF";
import { ContactChoiceMenu } from "./ContactLink";
import { buildMailto, buildTel } from "../utils/contactLinks";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData:
    | {
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
    | null;
}

export default function LeadModal({ isOpen, onClose, leadData }: LeadModalProps) {
  if (!isOpen || !leadData) return null;

  const handleDownloadPDF = () => {
    generateLeadPDF({
      name: leadData.name,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone,
      service: leadData.service,
      message: leadData.message,
      referenceNumber: leadData.referenceNumber,
    });
  };

  const isConnected = leadData.storedInDatabase && leadData.emailSent;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1E3A8A]/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg bg-white border border-[#FF7A00]/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <div className="h-2 bg-gradient-to-r from-[#FF7A00] to-[#FFB366]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-[#1E3A8A] bg-[#FEF9F0] p-1.5 rounded-lg border border-slate-200 hover:bg-white transition-all z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 lg:p-8 text-center space-y-5">
          {/* Success animation */}
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-400/40 animate-number-pop">
            <CheckCircle2 className="w-9 h-9 text-emerald-500" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl lg:text-2xl font-black text-[#1E3A8A] tracking-tight">
              Inquiry Queued Successfully!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your multimodal shipping query has been logged. Our routing desk is compiling your pricing.
            </p>
          </div>

          {/* Reference number pill */}
          {leadData.referenceNumber && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FEF9F0] to-[#FFF4DC] border-2 border-[#FF7A00]/30 rounded-full">
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                Ref No:
              </span>
              <span className="text-sm font-black text-[#FF7A00] tracking-wider">
                {leadData.referenceNumber}
              </span>
            </div>
          )}

          {/* Backend / Email confirmations */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className={`px-3 py-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1.5 ${
                leadData.storedInDatabase
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{leadData.storedInDatabase ? "Saved to DB" : "Mock Mode"}</span>
            </div>
            <div
              className={`px-3 py-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1.5 ${
                leadData.emailSent
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{leadData.emailSent ? "Email Sent" : "Email Pending"}</span>
            </div>
          </div>

          {/* Warning if backend is offline */}
          {!isConnected && (
            <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-left">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 leading-relaxed">
                <strong>Backend not connected.</strong> Inquiry logged locally only. Set{" "}
                <code className="px-1 bg-amber-100 rounded">VITE_API_URL</code> to enable
                MongoDB storage and email notifications.
              </p>
            </div>
          )}

          {/* Inquiry summary */}
          <div className="bg-[#FEF9F0] border border-slate-200 rounded-xl p-4 text-left space-y-2.5">
            <span className="text-[9px] font-black text-[#FF7A00] uppercase tracking-widest block border-b border-slate-200 pb-1">
              Inquiry Specifications
            </span>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[11px]">
              <div>
                <span className="text-slate-500 block">Contact:</span>
                <span className="text-[#1E3A8A] font-bold">{leadData.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Company:</span>
                <span className="text-[#1E3A8A] font-bold">{leadData.company}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Service:</span>
                <span className="text-[#FF7A00] font-bold">{leadData.service.split(" (")[0]}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone:</span>
                <span className="text-[#1E3A8A] font-bold">{leadData.phone}</span>
              </div>
            </div>
            {leadData.message && (
              <div className="pt-1.5 border-t border-slate-200 text-[10px] text-slate-600">
                <span className="font-semibold text-[#1E3A8A]">Message: </span>
                <span className="italic">"{leadData.message}"</span>
              </div>
            )}
          </div>

          <div className="flex justify-around py-2 border-y border-slate-200 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Safe-Lashed Transit</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <ExternalLink className="w-4 h-4 text-[#FF7A00] flex-shrink-0" />
              <span>Mundra Dispatch Log</span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#152C6B] hover:from-[#152C6B] hover:to-[#0F214F] text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Slip</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 bg-[#FF7A00] hover:bg-[#E56D00] text-xs font-black uppercase tracking-widest text-white rounded-xl hover:shadow-[0_4px_15px_rgba(255,122,0,0.3)] transition-all active:scale-95"
            >
              Close Window
            </button>
          </div>

          {/* Follow-up quick-action row: Email / Call / WhatsApp
              — each opens with a pre-filled support-context template */}
          <div className="pt-1 flex justify-center">
            <ContactChoiceMenu
              email={COMPANY_DETAILS.primaryEmail}
              context="support"
              size="sm"
            />
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-center gap-4 pt-1">
            <a
              href={buildMailto({
                to: COMPANY_DETAILS.primaryEmail,
                subject: leadData.referenceNumber
                  ? `Follow-up on Inquiry ${leadData.referenceNumber}`
                  : "Follow-up on My Inquiry",
                body:
                  `Hello Arrowline Team,\r\n\r\n` +
                  `I would like to follow up on my recent inquiry` +
                  (leadData.referenceNumber ? ` (Ref: ${leadData.referenceNumber})` : ``) +
                  `.\r\n\r\nThank you,\r\n`,
              })}
              className="flex items-center gap-1 hover:text-[#1E3A8A] transition-colors"
              aria-label="Send follow-up email"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>Email</span>
            </a>
            <span>·</span>
            <a
              href={buildTel(COMPANY_DETAILS.phone)}
              className="flex items-center gap-1 hover:text-[#1E3A8A] transition-colors"
              aria-label={`Call ${COMPANY_DETAILS.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>Phone</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
