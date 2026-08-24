import jsPDF from "jspdf";
import { COMPANY_DETAILS } from "../data/logisticsData";

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

/**
 * Generates a professional, brand-consistent PDF slip for a client inquiry
 * and downloads it. Uses jsPDF to draw the Arrowline logo, colored bands,
 * details table, terms and signature area.
 */
export function generateLeadPDF(lead: LeadData) {
  const refNo = lead.referenceNumber || `ALQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const date = lead.date || new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Colors matching brand
  const navy: [number, number, number] = [30, 58, 138];      // #1E3A8A
  const orange: [number, number, number] = [255, 122, 0];    // #FF7A00
  const cream: [number, number, number] = [254, 249, 240];   // #FEF9F0
  const slate: [number, number, number] = [71, 85, 105];     // #475569

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // ==================================================================
  // TOP BRAND BAND (navy) with logo
  // ==================================================================
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageW, 32, "F");

  // Orange accent strip below navy band
  doc.setFillColor(...orange);
  doc.rect(0, 32, pageW, 2, "F");

  // ---- Logo: "ARROWLINE" wordmark + orange arrow chevron ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("ARROWLINE", 15, 17);

  // Orange arrow icon (pentagon shape mimicking logo)
  const arrowX = 63;
  const arrowY = 10;
  doc.setFillColor(...orange);
  doc.triangle(arrowX, arrowY, arrowX + 8, arrowY + 4, arrowX, arrowY + 8, "F");
  doc.rect(arrowX - 6, arrowY + 2, 6, 4, "F");

  // "LOGISTICS" subline with dashes
  doc.setFontSize(7);
  doc.setTextColor(255, 200, 150);
  doc.text("— LOGISTICS —", 15, 23);

  // Tagline
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(200, 210, 230);
  doc.text("Moving Possibilities. Delivering Trust.", 15, 28);

  // Right side: "SHIPPING QUOTE INQUIRY" label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("SHIPPING QUOTE INQUIRY", pageW - 15, 15, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 200, 150);
  doc.text(`Ref No: ${refNo}`, pageW - 15, 21, { align: "right" });
  doc.text(`Date: ${date}`, pageW - 15, 26, { align: "right" });

  // ==================================================================
  // SUB-HEADER strip (cream) — status line
  // ==================================================================
  doc.setFillColor(...cream);
  doc.rect(0, 34, pageW, 12, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...orange);
  doc.text("STATUS:", 15, 42);
  doc.setTextColor(...navy);
  doc.setFont("helvetica", "normal");
  doc.text("APPROVED & QUEUED FOR ESTIMATION", 30, 42);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...orange);
  doc.text("PRIORITY:", pageW - 60, 42);
  doc.setTextColor(...navy);
  doc.setFont("helvetica", "normal");
  doc.text("HIGH — Response within 2 hours", pageW - 40, 42);

  // ==================================================================
  // GREETING
  // ==================================================================
  let y = 58;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...navy);
  doc.text(`Dear ${lead.name},`, 15, y);

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...slate);
  const introText =
    "Thank you for reaching out to Arrowline Logistics. Your logistics inquiry has been successfully " +
    "received and logged in our Mundra Port dispatch queue. Our routing planners are compiling optimized " +
    "multimodal tariffs tailored to your requirements. Please find below a summary of the details you submitted.";
  const introLines = doc.splitTextToSize(introText, pageW - 30);
  doc.text(introLines, 15, y);
  y += introLines.length * 4.5 + 6;

  // ==================================================================
  // DETAILS TABLE
  // ==================================================================
  // Table header band
  doc.setFillColor(...navy);
  doc.rect(15, y, pageW - 30, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("INQUIRY SPECIFICATIONS", 20, y + 5.5);
  y += 8;

  // Table rows helper
  const drawRow = (label: string, value: string, alt: boolean) => {
    const rowH = 9;
    const rowColor: [number, number, number] = alt ? [255, 255, 255] : cream;
    doc.setFillColor(...rowColor);
    doc.rect(15, y, pageW - 30, rowH, "F");
    doc.setDrawColor(220, 220, 230);
    doc.setLineWidth(0.1);
    doc.line(15, y + rowH, pageW - 15, y + rowH);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...slate);
    doc.text(label.toUpperCase(), 20, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...navy);
    // Truncate long values to avoid overflow
    const displayVal = doc.splitTextToSize(value || "—", pageW - 90)[0];
    doc.text(displayVal, 75, y + 6);
    y += rowH;
  };

  drawRow("Contact Name", lead.name, false);
  drawRow("Company", lead.company, true);
  drawRow("Email", lead.email, false);
  drawRow("Phone", lead.phone, true);
  drawRow("Service Interested", lead.service, false);

  // Message block (multi-line)
  const msgLines = doc.splitTextToSize(lead.message || "No additional message provided.", pageW - 90);
  const msgRowH = Math.max(9, msgLines.length * 4.5 + 4);
  doc.setFillColor(255, 255, 255);
  doc.rect(15, y, pageW - 30, msgRowH, "F");
  doc.setDrawColor(220, 220, 230);
  doc.line(15, y + msgRowH, pageW - 15, y + msgRowH);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...slate);
  doc.text("MESSAGE / CARGO", 20, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...navy);
  doc.text(msgLines, 75, y + 6);
  y += msgRowH + 3;

  // ==================================================================
  // NEXT STEPS BOX
  // ==================================================================
  y += 4;
  doc.setFillColor(...cream);
  doc.setDrawColor(...orange);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, y, pageW - 30, 30, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...orange);
  doc.text("WHAT HAPPENS NEXT?", 20, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...slate);
  const steps = [
    "1. Our routing team analyzes your cargo dimensions, destinations & modal preferences.",
    "2. You will receive customized multimodal tariffs by email within 2 hours.",
    "3. Once approved, our Mundra Port dispatch team will assign fleet and confirm the timeline.",
  ];
  steps.forEach((step, i) => {
    doc.text(step, 20, y + 14 + i * 4.5);
  });
  y += 34;

  // ==================================================================
  // CONTACT FOOTER STRIP (navy)
  // ==================================================================
  const footerY = 260;
  doc.setFillColor(...navy);
  doc.rect(0, footerY, pageW, 37, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...orange);
  doc.text("STAY CONNECTED WITH OUR OPERATIONS DESK", 15, footerY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  // 3-column contact info
  const col1X = 15;
  const col2X = 80;
  const col3X = 145;
  const contactY = footerY + 15;

  doc.setFont("helvetica", "bold");
  doc.text("PHONE", col1X, contactY);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_DETAILS.phone, col1X, contactY + 5);
  doc.setTextColor(200, 210, 230);
  doc.setFontSize(7);
  doc.text("Available 24/7", col1X, contactY + 10);

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
    "Office 204, Portview Complex, Near Adani House, Mundra, Kutch, Gujarat 370421",
    pageW - col3X - 15
  );
  doc.text(addrLines, col3X, contactY + 5);

  // Very bottom: legal line + reference
  doc.setFillColor(...orange);
  doc.rect(0, 293, pageW, 4, "F");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(
    `© ${new Date().getFullYear()} ARROWLINE LOGISTICS  ·  Reference: ${refNo}  ·  Moving Possibilities. Delivering Trust.`,
    pageW / 2,
    296,
    { align: "center" }
  );

  // Save
  const fileName = `Arrowline_Quote_${lead.company.replace(/\s+/g, "_") || "Inquiry"}_${refNo}.pdf`;
  doc.save(fileName);
}
