import { Resend } from "resend";

let resendClient = null;

function getResend() {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set in .env");
  resendClient = new Resend(apiKey);
  return resendClient;
}

async function sendEmail(message) {
  const { data, error } = await getResend().emails.send(message);
  if (error) {
    throw new Error(error.message || "Resend rejected the email");
  }
  return data;
}

function escape(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildInternalHtml(lead) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #FEF9F0; }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { background: #1E3A8A; color: #ffffff; padding: 24px; }
    .accent { height: 4px; background: #FF7A00; }
    .body { padding: 32px 24px; color: #334155; line-height: 1.6; }
    .ref { display: inline-block; padding: 8px 16px; background: #FEF9F0; border: 2px solid #FF7A00; border-radius: 999px; font-weight: bold; color: #FF7A00; letter-spacing: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    td:first-child { font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 11px; width: 40%; letter-spacing: 1px; }
    td:last-child { color: #1E3A8A; font-weight: 600; }
    .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; }
    .cta { display: inline-block; padding: 12px 24px; background: #FF7A00; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; margin-top: 16px; }
    h1 { margin: 0; font-size: 22px; }
    h2 { color: #1E3A8A; font-size: 18px; margin-top: 24px; }
    .message-box { background: #FEF9F0; border-left: 4px solid #FF7A00; padding: 16px; margin-top: 16px; font-style: italic; color: #475569; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🚛 New Shipping Inquiry — ARROWLINE LOGISTICS</h1>
      <div style="opacity: 0.8; margin-top: 8px; font-size: 12px;">Received via website contact form</div>
    </div>
    <div class="accent"></div>

    <div class="body">
      <p>A new customer has submitted a shipping quote request. Please respond within 2 hours.</p>

      <div class="ref">REF: ${lead.reference_number}</div>

      <h2>Client Details</h2>
      <table>
        <tr><td>Name</td><td>${escape(lead.name)}</td></tr>
        <tr><td>Company</td><td>${escape(lead.company)}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${escape(lead.email)}" style="color: #FF7A00;">${escape(lead.email)}</a></td></tr>
        <tr><td>Phone</td><td><a href="tel:${escape(lead.phone)}" style="color: #FF7A00;">${escape(lead.phone)}</a></td></tr>
        <tr><td>Service</td><td>${escape(lead.service)}</td></tr>
        <tr><td>Submitted</td><td>${new Date(lead.created_at || Date.now()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
      </table>

      ${lead.message ? `<h2>Cargo Details & Message</h2><div class="message-box">${escape(lead.message)}</div>` : ""}

      <a href="mailto:${escape(lead.email)}?subject=Re: Your Arrowline Shipping Inquiry ${lead.reference_number}" class="cta">Reply to Client →</a>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Arrowline Logistics · Moving Possibilities. Delivering Trust.<br />
      Automated notification from the Arrowline lead capture system.
    </div>
  </div>
</body>
</html>`;
}

function buildClientHtml(lead) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #FEF9F0; }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { background: #1E3A8A; color: #ffffff; padding: 32px 24px; text-align: center; }
    .logo { font-size: 26px; font-weight: 900; letter-spacing: 2px; }
    .arrow { color: #FF7A00; font-size: 24px; }
    .accent { height: 4px; background: #FF7A00; }
    .body { padding: 32px 24px; color: #334155; line-height: 1.7; }
    .ref { display: inline-block; padding: 10px 20px; background: #FEF9F0; border: 2px solid #FF7A00; border-radius: 999px; font-weight: bold; color: #FF7A00; letter-spacing: 2px; margin: 16px 0; }
    .steps { background: #FEF9F0; border-radius: 12px; padding: 20px; margin-top: 24px; }
    .step { display: flex; margin-bottom: 12px; }
    .step-num { width: 28px; height: 28px; background: #FF7A00; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
    .contact-strip { background: #1E3A8A; color: white; padding: 20px 24px; margin-top: 32px; }
    .contact-strip a { color: #FFB366; text-decoration: none; }
    .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; }
    h1 { color: #1E3A8A; font-size: 22px; margin-top: 0; }
    h2 { color: #FF7A00; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">ARROWLINE <span class="arrow">▶</span></div>
      <div style="font-size: 10px; letter-spacing: 3px; opacity: 0.8; margin-top: 4px;">— LOGISTICS —</div>
      <div style="font-size: 12px; font-style: italic; opacity: 0.9; margin-top: 8px;">Moving Possibilities. Delivering Trust.</div>
    </div>
    <div class="accent"></div>

    <div class="body">
      <h1>Thank you, ${escape(lead.name)}! 🙏</h1>
      <p>We have received your shipping inquiry and our routing team at Mundra Port is already analyzing your requirements. Please save the reference number below for future correspondence:</p>

      <div style="text-align: center;">
        <div class="ref">REF: ${lead.reference_number}</div>
      </div>

      <h2>What Happens Next?</h2>
      <div class="steps">
        <div class="step">
          <span class="step-num">1</span>
          <div><strong style="color: #1E3A8A;">Analysis (0-1 hour):</strong> Our planners review your cargo dimensions, destinations, and modal preferences.</div>
        </div>
        <div class="step">
          <span class="step-num">2</span>
          <div><strong style="color: #1E3A8A;">Quotation (within 2 hours):</strong> You'll receive customized multimodal tariffs directly by email.</div>
        </div>
        <div class="step">
          <span class="step-num">3</span>
          <div><strong style="color: #1E3A8A;">Dispatch:</strong> Once approved, our Mundra Port team assigns fleet and confirms the timeline.</div>
        </div>
      </div>

      <p style="margin-top: 24px;">If you have any urgent questions, feel free to call our operations desk directly. We're available 24/7 for active transits.</p>
    </div>

    <div class="contact-strip">
      <div style="font-size: 10px; letter-spacing: 2px; color: #FFB366; font-weight: bold; margin-bottom: 8px;">STAY CONNECTED</div>
      <div style="font-size: 13px;">
        📞 <a href="tel:+919766262612">+91 9766262612</a> &nbsp;·&nbsp;
        ✉️ <a href="mailto:mundra@arrowlinelogistics.in">mundra@arrowlinelogistics.in</a>
      </div>
      <div style="font-size: 11px; opacity: 0.7; margin-top: 8px;">
        Office 204, Portview Complex, Adani House, Mundra, Kutch, Gujarat 370421
      </div>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Arrowline Logistics Pvt Ltd. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}

export async function sendLeadNotifications(lead) {
  const notifyList = (process.env.NOTIFY_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (notifyList.length === 0) {
    throw new Error("NOTIFY_EMAILS env var is empty — no team recipients configured.");
  }

  const from = process.env.FROM_EMAIL;
  if (!from) {
    throw new Error("FROM_EMAIL is not set in .env");
  }

  const failures = [];
  let ownerEmail;
  let customerEmail;

  try {
    ownerEmail = await sendEmail({
      from,
      to: notifyList,
      replyTo: lead.email,
      subject: `🚛 New Inquiry ${lead.reference_number} — ${lead.company}`,
      html: buildInternalHtml(lead),
    });
  } catch (error) {
    failures.push(`owner notification: ${error.message}`);
  }

  try {
    customerEmail = await sendEmail({
      from,
      to: lead.email,
      subject: `✅ We received your inquiry — Ref ${lead.reference_number}`,
      html: buildClientHtml(lead),
    });
  } catch (error) {
    failures.push(`customer confirmation: ${error.message}`);
  }

  if (failures.length) {
    throw new Error(failures.join("; "));
  }

  return { ownerEmail, customerEmail };
}
