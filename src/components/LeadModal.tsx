import { useEffect, useState } from "react";
import { Check, FileDown, Loader2 } from "lucide-react";
import { generateLeadPDF } from "../utils/generateLeadPDF";

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

const AUTO_CLOSE_MS = 5000;

export default function LeadModal({ isOpen, onClose, leadData }: LeadModalProps) {
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    if (!isOpen || !leadData) return;

    const timer = window.setTimeout(onClose, AUTO_CLOSE_MS);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, leadData, onClose]);

  if (!isOpen || !leadData) return null;

  const handleDownloadPdf = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      await generateLeadPDF({
        name: leadData.name,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        service: leadData.service,
        message: leadData.message,
        referenceNumber: leadData.referenceNumber,
      });
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#03212D]/40 backdrop-blur-[2px] animate-in fade-in duration-200"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-success-title"
        className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#FF6B1A] to-[#FFB366]" />

        <div className="p-6 sm:p-8 text-center space-y-5">
          <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-400/40">
            <Check className="w-7 h-7 text-emerald-500" strokeWidth={3} />
          </div>

          <div className="space-y-1.5">
            <h3 id="lead-success-title" className="text-xl lg:text-2xl font-black text-[#1E3A8A] tracking-tight">
              Thank You!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your enquiry has been submitted successfully. Our logistics team
              will review your requirement and get back to you shortly.
            </p>
          </div>

          {leadData.referenceNumber && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEF9F0] border border-[#FF6B1A]/30 rounded-full">
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                Reference No:
              </span>
              <span className="text-sm font-black text-[#FF6B1A] tracking-wider">
                {leadData.referenceNumber}
              </span>
            </div>
          )}

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfBusy}
              className="w-full py-3 bg-white border-2 border-[#FF7A00] text-[#FF7A00] hover:bg-[#FFF3E6] disabled:opacity-60 disabled:cursor-wait text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {pdfBusy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                {pdfBusy ? "Preparing PDF…" : "Download Inquiry PDF"}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="w-full py-3 bg-[#FF7A00] hover:bg-[#E56D00] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 hover:shadow-[0_4px_15px_rgba(255,122,0,0.3)]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}