// src/utils/generateLeadPDF.ts
// Client-side generation of the branded Arrowline quote slip.
// jsPDF is dynamically imported so it is only fetched when a user actually
// downloads a PDF — it never inflates the main entry chunk.
import { COMPANY_DETAILS } from "../data/logisticsData";
import type jsPDF from "jspdf";

export interface LeadData {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  referenceNumber?: string;
  date?: string;
}

// Brand palette (matches the site design system)
const NAVY: [number, number, number] = [30, 58, 138];        // #1E3A8A
const ORANGE: [number, number, number] = [255, 122, 0];      // #FF7A00
const CREAM: [number, number, number] = [254, 249, 240];     // #FEF9F0
const SLATE: [number, number, number] = [71, 85, 105];       // #475569
const LIGHT_LINE: [number, number, number] = [230, 230, 240];

/**
 * Draw the official Arrowline chevron — mirrors the exact SVG path from
 * ArrowlineLogo.tsx:  viewBox="0 0 40 32"
 *   M 2 4 L 26 4 L 38 16 L 26 28 L 2 28 L 14 16 Z
 * @param size Height of the arrow in mm.
 */
function drawChevron(doc: jsPDF, x: number, y: number, size: number) {
  const s = size / 24; // 24 is the vertical span of the path (4 -> 28)
  const lines: [number, number][] = [
    [24 * s, 0],       // (2,4) -> (26,4)
    [12 * s, 12 * s],  // (26,4) -> (38,16)
    [-12 * s, 12 * s], // (38,16) -> (26,28)
    [-24 * s, 0],      // (26,28) -> (2,28)
    [12 * s, -12 * s], // (2,28) -> (14,16)
    [-12 * s, -12 * s], // (14,16) -> (2,4) close
  ];
  const x0 = x + 2 * s; // path starts at x=2 in viewBox units
  const y0 = y + 4 * s; // path starts at y=4 in viewBox units
  doc.setFillColor(...ORANGE);
  doc.setLineWidth(0);
  doc.lines(lines, x0, y0, [1, 1], "F", true);
}

/**
 * Draw the Arrowline logo lockup (white for dark backgrounds):
 * ARROWLINE wordmark + orange chevron + "— LOGISTICS —" subline.
 */
function drawLogo(doc: jsPDF, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  const wordmark = "ARROWLINE";
  doc.text(wordmark, x, y);

  const textWidth = doc.getTextWidth(wordmark);
  const chevronX = x + textWidth + 1.8;
  const chevronH = 7;
  const chevronY = y - chevronH;
  drawChevron(doc, chevronX, chevronY, chevronH);

  // "— LOGISTICS —" subline
  const subY = y + 5;
  doc.setFontSize(7);
  doc.setTextColor(255, 200, 150);
  const sub = "LOGISTICS";
  const dashW = 3;
  const gap = 1.6;
  doc.setLineWidth(0.4);

  // Left dash
  doc.line(x + 0.2, subY - 0.7, x + 0.2 + dashW, subY - 0.7);
  doc.text(sub, x + dashW + gap, subY);
  // Right dash
  const rightDashX = x + dashW + gap + doc.getTextWidth(sub) + gap;
  doc.line(rightDashX, subY - 0.7, rightDashX + dashW, subY - 0.7);
}

/**
 * Build the professionally branded PDF slip for a client inquiry.
 * Returns the jsPDF document so callers can download or embed it.
 * jsPDF is lazy-loaded on first use.
 */
export async function buildLeadPdf(lead: LeadData): Promise<jsPDF> {
  const { default: JsPDF } = await import("jspdf");
  const refNo =
    lead.referenceNumber ||
    `ALQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const date =
    lead.date ||
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const doc = new JsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentW = pageW - margin * 2;
  const footerTop = 254;
  let y = 0;

  const ensureSpace = (needed: number) => {
    if (y + needed > footerTop) {
      doc.addPage();
      y = 20;
    }
  };

  const headingTop = () => {
    if (y === 20) {
      // Continuing on a fresh page — re-draw the band for continuity
      doc.setFillColor(...NAVY);
      doc.rect(0, y - 20, pageW, 14, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("ARROWLINE LOGISTICS — SHIPPING QUOTE INQUIRY", margin, y - 9);
    }
  };

  // ==================================================================
  // TOP BRAND BAND (navy) with logo
  // ==================================================================
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 34, "F");

  doc.setFillColor(...ORANGE);
  doc.rect(0, 34, pageW, 2.5, "F");

  drawLogo(doc, margin, 17);

  // Right side: "SHIPPING QUOTE INQUIRY" label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("SHIPPING QUOTE INQUIRY", pageW - 15, 15, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 200, 150);
  doc.text(`Ref No: ${refNo}`, pageW - 15, 22, { align: "right" });
  doc.text(`Date: ${date}`, pageW - 15, 27, { align: "right" });

  // ==================================================================
  // SUB-HEADER STRIP (cream) — status line
  // ==================================================================
  doc.setFillColor(...CREAM);
  doc.rect(0, 36.5, pageW, 11, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...ORANGE);
  doc.text("STATUS:", margin, 44);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...NAVY);
  doc.text("RECEIVED — QUEUED FOR ESTIMATION", margin + 22, 44);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...ORANGE);
  doc.text("PRIORITY:", pageW - 62, 44);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...NAVY);
  doc.text("HIGH — Response within 2 hours", pageW - 42, 44);

  // ==================================================================
  // GREETING
  // ==================================================================
  y = 58;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.text(`Dear ${lead.name},`, margin, y);

  y += 7.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SLATE);
  const introText =
    "Thank you for reaching out to Arrowline Logistics. Your inquiry has been received and logged in our " +
    "Mundra Port dispatch queue. Our routing planners are preparing an optimized multimodal quotation tailored " +
    "to your requirements. A summary of your submission follows.";
  const introLines = doc.splitTextToSize(introText, contentW);
  ensureSpace(introLines.length * 4.6 + 6);
  doc.text(introLines, margin, y);
  y += introLines.length * 4.6 + 8;

  // ==================================================================
  // DETAILS TABLE (with wrap-safe rows)
  // ==================================================================
  const labelX = margin;
  const valueX = margin + 55;
  const valueW = contentW - 55;
  const cellPad = 5;

  const drawRow = (label: string, value: string, alt: boolean) => {
    const valueLines = doc.splitTextToSize(value || "—", valueW);
    const rowH = Math.max(9, valueLines.length * 4.2 + 4.5);

    ensureSpace(rowH + 1);
    headingTop();

    const rowY = y;
    const rowFill: [number, number, number] = alt ? [255, 255, 255] : CREAM;
    doc.setFillColor(...rowFill);
    doc.rect(margin, rowY, contentW, rowH, "F");
    doc.setDrawColor(...LIGHT_LINE);
    doc.setLineWidth(0.1);
    doc.line(margin, rowY + rowH - 0.1, pageW - margin, rowY + rowH - 0.1);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    doc.text(label.toUpperCase(), labelX, rowY + cellPad + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(valueLines, valueX, rowY + cellPad + 4);

    y = rowY + rowH;
  };

  // Table header band
  ensureSpace(9);
  doc.setFillColor(...NAVY);
  doc.rect(margin, y, contentW, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("INQUIRY SPECIFICATIONS", margin + 5, y + 5.5);
  y += 8;

  drawRow("Contact Name", lead.name, false);
  drawRow("Company", lead.company, true);
  drawRow("Email", lead.email, false);
  drawRow("Phone", lead.phone, true);
  drawRow("Service of Interest", lead.service, false);

  // Message block (multi-line, wrap-safe)
  const msgLines = doc.splitTextToSize(
    lead.message || "No additional message provided.",
    valueW
  );
  const msgRowH = Math.max(12, msgLines.length * 4.2 + 6);
  ensureSpace(msgRowH + 1);
  headingTop();
  const msgY = y;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, msgY, contentW, msgRowH, "F");
  doc.setDrawColor(...LIGHT_LINE);
  doc.line(margin, msgY + msgRowH - 0.1, pageW - margin, msgY + msgRowH - 0.1);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE);
  doc.text("MESSAGE / CARGO DETAILS", labelX, msgY + cellPad + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY);
  doc.text(msgLines, valueX, msgY + cellPad + 4);
  y = msgY + msgRowH + 4;

  // ==================================================================
  // NEXT STEPS BOX
  // ==================================================================
  const steps = [
    "1. Our routing team analyzes your cargo dimensions, destinations & modal preferences.",
    "2. You will receive customized multimodal tariffs by email within 2 hours.",
    "3. Once approved, our Mundra Port dispatch team assigns fleet and confirms the timeline.",
  ];
  const stepsH = 30;
  ensureSpace(stepsH + 4);
  headingTop();

  doc.setFillColor(...CREAM);
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, stepsH, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ORANGE);
  doc.text("WHAT HAPPENS NEXT?", margin + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE);
  steps.forEach((step, i) => {
    doc.text(step, margin + 5, y + 14 + i * 4.6);
  });
  y += stepsH + 6;

  // ==================================================================
  // CONTACT FOOTER STRIP (navy)
  // ==================================================================
  const footerY = 260;
  doc.setFillColor(...NAVY);
  doc.rect(0, footerY, pageW, 37, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...ORANGE);
  doc.text("STAY CONNECTED WITH OUR OPERATIONS DESK", margin, footerY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  const contactY = footerY + 16;
  const col2X = 80;
  const col3X = 145;

  doc.setFont("helvetica", "bold");
  doc.text("PHONE", margin, contactY);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_DETAILS.phone, margin, contactY + 5);
  doc.setTextColor(200, 210, 230);
  doc.setFontSize(7);
  doc.text("Available 24/7", margin, contactY + 10);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("EMAIL", col2X, contactY);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_DETAILS.primaryEmail, col2X, contactY + 5);
  doc.setTextColor(200, 210, 230);
  doc.setFontSize(7);
  doc.text(COMPANY_DETAILS.secondaryEmail, col2X, contactY + 10);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("MUNDRA BASE", col3X, contactY);
  doc.setFont("helvetica", "normal");
  const addrLines = doc.splitTextToSize(
    COMPANY_DETAILS.headOffice,
    pageW - col3X - 15
  );
  doc.text(addrLines, col3X, contactY + 5);

  // Very bottom legal line
  doc.setFillColor(...ORANGE);
  doc.rect(0, 293, pageW, 4, "F");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(
    `© ${new Date().getFullYear()} ARROWLINE LOGISTICS  ·  Reference: ${refNo}  ·  Cargo in Motion. Trust on Track.`,
    pageW / 2,
    296,
    { align: "center" }
  );

  return doc;
}

/**
 * Generates a professional, brand-consistent PDF slip for a client inquiry
 * and downloads it.
 */
export async function generateLeadPDF(lead: LeadData) {
  const doc = await buildLeadPdf(lead);
  const refNo = lead.referenceNumber || "";
  const safeCompany = lead.company.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") || "Inquiry";
  const fileName = `Arrowline_Quote_${safeCompany}_${refNo || Date.now()}.pdf`;
  doc.save(fileName);
}