/**
 * Contact-link utility helpers.
 *
 * Provides standardized builders for `mailto:`, `tel:`, and WhatsApp
 * (`https://wa.me/`) links used across the site. Every link includes
 * pre-filled context so the recipient app (mail client, phone dialer,
 * WhatsApp) opens with a professional Arrowline-branded template ready
 * to send.
 */

import { COMPANY_DETAILS } from "../data/logisticsData";

/* =============================================================
   Types
   ============================================================= */

export type EmailContext =
  | "general"
  | "quote"
  | "support"
  | "customs"
  | "project"
  | "coastal"
  | "rail"
  | "road"
  | "air"
  | "career";

/* =============================================================
   Phone number sanitiser — strips everything except digits and
   optional leading `+`. Used by tel: and wa.me.
   ============================================================= */
export function sanitizePhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

/** Digits-only for wa.me (no leading + or spaces). */
export function whatsappDigits(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/* =============================================================
   MAILTO builder
   ============================================================= */

interface EmailLinkOptions {
  to?: string;                // defaults to primary email
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  body?: string;
  context?: EmailContext;     // pre-selects subject/body template
}

/**
 * Pre-written email templates for common intents.
 * Each returns { subject, body } — body uses \r\n for cross-client
 * compatibility (Outlook, Apple Mail, Gmail all handle this).
 */
function getEmailTemplate(context: EmailContext): {
  subject: string;
  body: string;
} {
  const signOff =
    `\r\n\r\n---\r\n` +
    `Please share:\r\n` +
    `  • Cargo type & weight/dimensions\r\n` +
    `  • Pickup location & destination\r\n` +
    `  • Preferred pickup date\r\n` +
    `  • Any special handling requirements\r\n\r\n` +
    `Thank you,\r\n`;

  const templates: Record<EmailContext, { subject: string; body: string }> = {
    general: {
      subject: "Inquiry — Arrowline Logistics",
      body:
        `Hello Arrowline Team,\r\n\r\n` +
        `I would like to know more about your logistics services.\r\n` +
        signOff,
    },
    quote: {
      subject: "Shipping Quote Request — Arrowline Logistics",
      body:
        `Hello Arrowline Team,\r\n\r\n` +
        `I would like to request a shipping quote for the following:\r\n\r\n` +
        `  • Cargo type: \r\n` +
        `  • Weight / Dimensions: \r\n` +
        `  • Pickup location: \r\n` +
        `  • Destination: \r\n` +
        `  • Preferred pickup date: \r\n` +
        `  • Additional notes: \r\n\r\n` +
        `Please share your tariff and estimated transit time.\r\n\r\n` +
        `Thank you,\r\n`,
    },
    support: {
      subject: "Support Request — Arrowline Logistics",
      body:
        `Hello Arrowline Support Team,\r\n\r\n` +
        `I need assistance with an active shipment.\r\n\r\n` +
        `  • Reference / Booking No.: \r\n` +
        `  • Issue: \r\n\r\n` +
        `Thank you,\r\n`,
    },
    customs: {
      subject: "Customs Clearance Inquiry — Arrowline Logistics",
      body:
        `Hello Arrowline CHA Team,\r\n\r\n` +
        `I need customs clearance assistance for a shipment at Mundra Port.\r\n\r\n` +
        `  • BL / AWB No.: \r\n` +
        `  • Vessel / Flight: \r\n` +
        `  • Type of goods: \r\n` +
        `  • ETA: \r\n\r\n` +
        `Please advise on documentation and process.\r\n\r\n` +
        `Thank you,\r\n`,
    },
    project: {
      subject: "Project Cargo / ODC Inquiry — Arrowline Logistics",
      body:
        `Hello Arrowline Project Cargo Team,\r\n\r\n` +
        `I need to move over-dimensional / heavy-lift cargo.\r\n\r\n` +
        `  • Cargo description: \r\n` +
        `  • Dimensions (L x W x H): \r\n` +
        `  • Weight (tons): \r\n` +
        `  • Origin: \r\n` +
        `  • Destination: \r\n` +
        `  • Target dispatch date: \r\n\r\n` +
        `Please advise on route survey feasibility.\r\n\r\n` +
        `Thank you,\r\n`,
    },
    coastal: {
      subject: "Coastal Shipping Inquiry — Arrowline Logistics",
      body:
        `Hello Arrowline Coastal Shipping Team,\r\n\r\n` +
        `I would like to explore a coastal shipping solution.\r\n\r\n` +
        `  • Origin port: \r\n` +
        `  • Destination port: \r\n` +
        `  • Cargo type & volume: \r\n` +
        `  • Frequency: \r\n\r\n` +
        `Please share your service loop schedule and tariff.\r\n\r\n` +
        `Thank you,\r\n`,
    },
    rail: {
      subject: "Rail Freight Inquiry — Arrowline Logistics",
      body:
        `Hello Arrowline Rail Multimodal Team,\r\n\r\n` +
        `I would like to book rail freight capacity.\r\n\r\n` +
        `  • Origin ICD: \r\n` +
        `  • Destination ICD: \r\n` +
        `  • No. of containers (20ft / 40ft): \r\n` +
        `  • Commodity: \r\n` +
        `  • Target loading date: \r\n\r\n` +
        `Thank you,\r\n`,
    },
    road: {
      subject: "FTL Road Transport Inquiry — Arrowline Logistics",
      body:
        `Hello Arrowline Road Ops Team,\r\n\r\n` +
        `I need FTL road transport service.\r\n\r\n` +
        `  • Pickup location: \r\n` +
        `  • Drop location: \r\n` +
        `  • Container / Truck size: \r\n` +
        `  • Cargo type & weight: \r\n` +
        `  • Preferred pickup date: \r\n\r\n` +
        `Thank you,\r\n`,
    },
    air: {
      subject: "Air Cargo Inquiry — Arrowline Logistics",
      body:
        `Hello Arrowline Air Cargo Team,\r\n\r\n` +
        `I have an urgent air freight requirement.\r\n\r\n` +
        `  • Origin airport: \r\n` +
        `  • Destination airport: \r\n` +
        `  • Weight & volume: \r\n` +
        `  • Nature of goods: \r\n` +
        `  • Required delivery date: \r\n\r\n` +
        `Thank you,\r\n`,
    },
    career: {
      subject: "Career Inquiry — Arrowline Logistics",
      body:
        `Hello Arrowline HR Team,\r\n\r\n` +
        `I am interested in joining Arrowline Logistics.\r\n\r\n` +
        `  • Role of interest: \r\n` +
        `  • Years of experience: \r\n` +
        `  • Current location: \r\n\r\n` +
        `My CV is attached. Looking forward to hearing from you.\r\n\r\n` +
        `Thank you,\r\n`,
    },
  };

  return templates[context] || templates.general;
}

/**
 * Build a fully-formatted mailto: URL with pre-filled subject and body.
 */
export function buildMailto(options: EmailLinkOptions = {}): string {
  const to = options.to || COMPANY_DETAILS.primaryEmail;

  // Resolve subject/body from context template unless explicitly overridden
  const template = options.context ? getEmailTemplate(options.context) : null;
  const subject = options.subject ?? template?.subject ?? "";
  const body = options.body ?? template?.body ?? "";

  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  if (options.cc) {
    const cc = Array.isArray(options.cc) ? options.cc.join(",") : options.cc;
    params.push(`cc=${encodeURIComponent(cc)}`);
  }
  if (options.bcc) {
    const bcc = Array.isArray(options.bcc) ? options.bcc.join(",") : options.bcc;
    params.push(`bcc=${encodeURIComponent(bcc)}`);
  }

  return `mailto:${to}${params.length ? "?" + params.join("&") : ""}`;
}

/* =============================================================
   TEL builder
   ============================================================= */
export function buildTel(phone?: string): string {
  const p = phone || COMPANY_DETAILS.phone;
  return `tel:${sanitizePhone(p)}`;
}

/* =============================================================
   WHATSAPP builder
   ============================================================= */

interface WhatsAppOptions {
  phone?: string;
  message?: string;
  context?: EmailContext;
}

function getWhatsAppMessage(context: EmailContext): string {
  const map: Record<EmailContext, string> = {
    general:
      "Hello Arrowline Logistics 👋, I would like to know more about your services.",
    quote:
      "Hello Arrowline 👋, I'd like to request a shipping quote.\n\n• Cargo type:\n• Pickup:\n• Destination:\n• Preferred date:",
    support:
      "Hello Arrowline Support, I need help with an active shipment.\n\n• Reference No.:\n• Issue:",
    customs:
      "Hello Arrowline CHA team, I need customs clearance assistance at Mundra Port.\n\n• BL/AWB:\n• ETA:\n• Cargo:",
    project:
      "Hello Arrowline 🚛, I have an ODC / project cargo requirement.\n\n• Cargo:\n• Dimensions:\n• Weight:\n• Route:",
    coastal:
      "Hello Arrowline 🚢, I'd like to explore coastal shipping.\n\n• Origin port:\n• Destination port:\n• Cargo & volume:",
    rail:
      "Hello Arrowline 🚂, I need rail freight capacity.\n\n• Origin ICD:\n• Destination ICD:\n• Containers:",
    road:
      "Hello Arrowline 🛣️, I need FTL road transport.\n\n• Pickup:\n• Drop:\n• Truck size:\n• Cargo type:",
    air:
      "Hello Arrowline ✈️, I have an urgent air freight requirement.\n\n• Origin airport:\n• Destination:\n• Weight:\n• Deadline:",
    career:
      "Hello Arrowline HR team, I'd like to explore career opportunities.\n\n• Role:\n• Experience:\n• Location:",
  };
  return map[context] || map.general;
}

export function buildWhatsApp(options: WhatsAppOptions = {}): string {
  const phone = options.phone || COMPANY_DETAILS.whatsapp || COMPANY_DETAILS.phone;
  const message =
    options.message ??
    (options.context ? getWhatsAppMessage(options.context) : getWhatsAppMessage("general"));

  return `https://wa.me/${whatsappDigits(phone)}?text=${encodeURIComponent(message)}`;
}
