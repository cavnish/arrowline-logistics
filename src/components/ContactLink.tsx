import { ReactNode } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import {
  buildMailto,
  buildTel,
  buildWhatsApp,
  EmailContext,
} from "../utils/contactLinks";
import { cn } from "../utils/cn";

/* ============================================================
   <EmailLink> — opens user's mail client with pre-filled draft
   ============================================================ */
interface EmailLinkProps {
  to?: string;
  context?: EmailContext;
  subject?: string;
  body?: string;
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  iconClassName?: string;
  ariaLabel?: string;
}

export function EmailLink({
  to,
  context,
  subject,
  body,
  className,
  children,
  showIcon = false,
  iconClassName,
  ariaLabel,
}: EmailLinkProps) {
  const href = buildMailto({ to, context, subject, body });
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 hover:text-[#FF7A00] transition-colors",
        className
      )}
      aria-label={ariaLabel || `Send email to ${to || "Arrowline Logistics"}`}
    >
      {showIcon && <Mail className={cn("w-3.5 h-3.5", iconClassName)} />}
      <span>{children || to}</span>
    </a>
  );
}

/* ============================================================
   <PhoneLink> — opens phone dialer with number
   ============================================================ */
interface PhoneLinkProps {
  phone?: string;
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  iconClassName?: string;
  ariaLabel?: string;
}

export function PhoneLink({
  phone,
  className,
  children,
  showIcon = false,
  iconClassName,
  ariaLabel,
}: PhoneLinkProps) {
  const href = buildTel(phone);
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 hover:text-[#FF7A00] transition-colors",
        className
      )}
      aria-label={ariaLabel || `Call ${phone || "Arrowline Logistics"}`}
    >
      {showIcon && <Phone className={cn("w-3.5 h-3.5", iconClassName)} />}
      <span>{children || phone}</span>
    </a>
  );
}

/* ============================================================
   <WhatsAppLink> — opens WhatsApp (app or web) with pre-filled msg
   ============================================================ */
interface WhatsAppLinkProps {
  phone?: string;
  context?: EmailContext;
  message?: string;
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  iconClassName?: string;
  ariaLabel?: string;
}

export function WhatsAppLink({
  phone,
  context,
  message,
  className,
  children,
  showIcon = false,
  iconClassName,
  ariaLabel,
}: WhatsAppLinkProps) {
  const href = buildWhatsApp({ phone, context, message });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 hover:text-[#25D366] transition-colors",
        className
      )}
      aria-label={ariaLabel || "Chat on WhatsApp"}
    >
      {showIcon && <MessageCircle className={cn("w-3.5 h-3.5", iconClassName)} />}
      <span>{children || "WhatsApp"}</span>
    </a>
  );
}

/* ============================================================
   <ContactChoiceMenu> — small pill row with all 3 channels
   ============================================================ */
interface ContactChoiceMenuProps {
  email?: string;
  phone?: string;
  whatsapp?: string;
  context?: EmailContext;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Compact horizontal row showing Email / Call / WhatsApp
 * buttons — one-tap access to every contact channel.
 */
export function ContactChoiceMenu({
  email,
  phone,
  whatsapp,
  context = "general",
  className,
  size = "md",
}: ContactChoiceMenuProps) {
  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-1.5 text-[10px]"
      : "px-3.5 py-2 text-xs";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <a
        href={buildMailto({ to: email, context })}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-[#FEF9F0] border border-slate-200 hover:border-[#FF7A00]/40 text-[#1E3A8A] font-bold transition-all shadow-sm hover:shadow-md",
          sizeClasses
        )}
        aria-label="Send email"
      >
        <Mail className={cn(iconSize, "text-[#FF7A00]")} />
        <span>Email</span>
      </a>
      <a
        href={buildTel(phone)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#1E3A8A]/40 text-[#1E3A8A] font-bold transition-all shadow-sm hover:shadow-md",
          sizeClasses
        )}
        aria-label="Call"
      >
        <Phone className={cn(iconSize, "text-[#1E3A8A]")} />
        <span>Call</span>
      </a>
      <a
        href={buildWhatsApp({ phone: whatsapp ?? phone, context })}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] border border-[#25D366] text-white font-bold transition-all shadow-sm hover:shadow-md",
          sizeClasses
        )}
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg
          className={iconSize}
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 01-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 01-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.885 2.722.885.703 0 2.02-.42 2.35-1.09.216-.42.216-.783.144-.87-.058-.144-.286-.215-.63-.386zM24.14 7.9C21.94 5.7 19.03 4.5 15.97 4.5c-6.33 0-11.47 5.15-11.47 11.48 0 2.02.53 4 1.53 5.75L4.5 27.5l5.92-1.55c1.68.92 3.58 1.4 5.53 1.4h.01c6.33 0 11.5-5.15 11.5-11.48 0-3.07-1.2-5.96-3.36-8.15zm-8.18 17.66h-.01c-1.75 0-3.46-.47-4.96-1.36l-.36-.21-3.68.97.98-3.6-.23-.37a9.53 9.53 0 01-1.46-5.08c0-5.26 4.28-9.54 9.54-9.54 2.55 0 4.94.99 6.74 2.8 1.8 1.81 2.79 4.2 2.79 6.75-.01 5.27-4.29 9.55-9.55 9.55z" />
        </svg>
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
