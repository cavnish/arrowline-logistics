// server/services/emailService.js
// Premium Arrowline-branded email notifications via Resend.
// Templates are responsive, mobile-first HTML built on table-based layout
// for maximum client compatibility. All user data is escaped before render.

import { Resend } from "resend";

// Brand palette (mirrors the frontend design system)
const BRAND = {
  deepNavy: "#062B3A",
  darkNavy: "#03212D",
  navy: "#1E3A8A",
  orange: "#FF6B1A",
  brightOrange: "#FF7A00",
  lightOrange: "#FFB366",
  cream: "#FEF9F0",
  slate: "#475569",
  slateLight: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
};

// Official Cloudinary logo mark used across the site (also the favicon & org schema)
const LOGO_URL =
  "https://res.cloudinary.com/uorctww6/image/upload/v1789377037/arrowline/general/favicon.png";

const OFFICE_ADDRESS =
  "Office 204, Portview Commercial Complex, Near Adani House, Mundra Port Road, Mundra, Kutch, Gujarat - 370421, India";

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
    // Attach the Resend status code (when present) for faster diagnosis
    // without ever leaking the API key or internal payloads.
    const code = error.statusCode ? ` (HTTP ${error.statusCode})` : "";
    throw new Error(`${error.message || "Resend rejected the email"}${code}`);
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

// Preserve line breaks as <br/> in message bodies (safe, already escaped)
function escapeMultiline(str) {
  return escape(str).replace(/\r?\n/g, "<br/>");
}

function brandHeaderHtml(title) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.darkNavy}; border-radius:16px 16px 0 0; overflow:hidden;">
      <tr>
        <td style="padding:28px 28px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;">
                <a href="https://arrowlinelogistics.in" style="text-decoration:none;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle; padding-right:12px;">
                        <img src="${LOGO_URL}" alt="Arrowline Logistics" width="44" height="44" style="display:block; width:44px; height:44px; border-radius:8px;" />
                      </td>
                      <td style="vertical-align:middle;">
                        <span style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:900; color:${BRAND.white}; letter-spacing:0.5px;">ARROWLINE</span>
                        <svg width="26" height="20" viewBox="0 0 40 32" style="display:inline-block; vertical-align:middle; margin:0 2px;"><path d="M 2 4 L 26 4 L 38 16 L 26 28 L 2 28 L 14 16 Z" fill="${BRAND.brightOrange}"/></svg>
                        <div style="font-family:Arial, Helvetica, sans-serif; font-size:9px; font-weight:700; color:${BRAND.lightOrange}; letter-spacing:3px; margin-top:2px;">&#8212;&nbsp;&nbsp;LOGISTICS&nbsp;&nbsp;&#8212;</div>
                      </td>
                    </tr>
                  </table>
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:14px;">
                <div style="font-family:Arial, Helvetica, sans-serif; font-size:24px; font-weight:800; color:${BRAND.white}; line-height:1.25;">${title}</div>
              </td>
            </tr>
          </table>
          <div style="height:4px; background:linear-gradient(90deg, ${BRAND.orange}, ${BRAND.brightOrange}); border-radius:2px; margin-top:16px;"></div>
        </td>
      </tr>
    </table>`;
}

function brandFooterHtml() {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.deepNavy}; border-radius:0 0 16px 16px;">
      <tr>
        <td style="padding:24px 28px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:12px;">
                <span style="font-family:Arial, Helvetica, sans-serif; font-size:10px; font-weight:700; color:${BRAND.orange}; letter-spacing:2px;">STAY CONNECTED</span>
              </td>
            </tr>
            <tr>
              <td>
                <span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#DCE6EC;">
                  <a href="tel:+919922204446" style="color:${BRAND.lightOrange}; text-decoration:none;">+91 99222 04446</a>&nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;<a href="tel:+919766262612" style="color:${BRAND.lightOrange}; text-decoration:none;">+91 97662 62612</a>
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding-top:6px;">
                <span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#DCE6EC;">
                  <a href="mailto:mundra@arrowlinelogistics.in" style="color:${BRAND.lightOrange}; text-decoration:none;">mundra@arrowlinelogistics.in</a>
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding-top:12px;">
                <span style="font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#8FB0C0; line-height:1.6;">${escape(OFFICE_ADDRESS)}</span>
              </td>
            </tr>
          </table>
          <div style="border-top:1px solid rgba(255,255,255,0.12); margin-top:18px; padding-top:12px;">
            <span style="font-family:Arial, Helvetica, sans-serif; font-size:10px; color:#6F93A6;">&copy; ${new Date().getFullYear()} Arrowline Logistics Pvt Ltd &middot; Cargo in Motion. Trust on Track.</span>
          </div>
        </td>
      </tr>
    </table>`;
}

function layoutHtml(bodyHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Arrowline Logistics</title>
<style>
  @media only screen and (max-width: 480px) {
    .container { width: 100% !important; }
    .stack-col { display: block !important; width: 100% !important; }
    .content-pad { padding: 24px 18px !important; }
  }
  body, table, td { mso-line-height-rule: exactly; }
</style>
</head>
<body style="margin:0; padding:24px 12px; background:#E9EEF2;">
  <div class="container" style="max-width:600px; margin:0 auto; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; background:${BRAND.white}; border-radius:16px; box-shadow:0 8px 24px rgba(6,43,58,0.10);">
      <tr>
        <td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:16px 12px 4px; text-align:center;">
          <span style="font-family:Arial, Helvetica, sans-serif; font-size:10px; color:#8FA3AE;">You received this because of an inquiry on arrowlinelogistics.in</span>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function buildInternalHtml(lead) {
  const submittedAt = new Date(lead.created_at || Date.now()).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const detailsRows = [
    ["Contact Name", escape(lead.name)],
    ["Company", escape(lead.company)],
    ["Phone", `<a href="tel:${escape(lead.phone)}" style="color:${BRAND.navy}; font-weight:600; text-decoration:none;">${escape(lead.phone)}</a>`],
    ["Service of Interest", escape(lead.service)],
    ["Submitted", escape(submittedAt)],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:11px 16px; border-bottom:1px solid ${BRAND.border}; font-family:Arial, Helvetica, sans-serif; font-size:10px; font-weight:700; color:${BRAND.slateLight}; text-transform:uppercase; letter-spacing:1px; width:38%; vertical-align:top;">${label}</td>
          <td style="padding:11px 16px; border-bottom:1px solid ${BRAND.border}; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:${BRAND.darkNavy}; vertical-align:top;">${value}</td>
        </tr>`
    )
    .join("");

  const messageBlock = lead.message
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
        <tr>
          <td style="font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:700; color:${BRAND.orange}; letter-spacing:2px; text-transform:uppercase; padding-bottom:8px;">Cargo Details &amp; Message</td>
        </tr>
        <tr>
          <td style="background:${BRAND.cream}; border-left:4px solid ${BRAND.brightOrange}; border-radius:8px; padding:14px 16px; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.6; color:${BRAND.slate};">
            ${escapeMultiline(lead.message)}
          </td>
        </tr>
      </table>`
    : "";

  const body = `
    ${brandHeaderHtml("New Shipping Inquiry")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="content-pad" style="padding:26px 28px;">
      <tr>
        <td>
          <p style="margin:0 0 16px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:${BRAND.slate}; line-height:1.6;">
            A new customer has submitted a shipping quote request. Please respond within <strong style="color:${BRAND.darkNavy};">2 hours</strong>.
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
            <tr>
              <td style="background:${BRAND.cream}; border:2px solid ${BRAND.brightOrange}; border-radius:999px; padding:8px 16px; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:800; color:${BRAND.brightOrange}; letter-spacing:2px;">
                REF: ${escape(lead.reference_number)}
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border}; border-radius:10px; overflow:hidden;">
            <tr>
              <td style="background:${BRAND.deepNavy}; padding:12px 16px; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:800; color:${BRAND.white}; letter-spacing:1px;">CLIENT DETAILS</td>
            </tr>
            ${detailsRows}
            <tr>
              <td style="padding:12px 16px; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:${BRAND.slate};">
                Reply directly:
                <a href="mailto:${escape(lead.email)}?subject=Re: Your Arrowline Shipping Inquiry ${escape(lead.reference_number)}" style="color:${BRAND.brightOrange}; font-weight:700; text-decoration:none;">${escape(lead.email)}</a>
              </td>
            </tr>
          </table>

          ${messageBlock}
        </td>
      </tr>
    </table>
    ${brandFooterHtml()}`;

  return layoutHtml(body);
}

function buildClientHtml(lead) {
  const steps = [
    {
      title: "Analysis",
      subtitle: "(0-1 hour)",
      text: "Our planners review your cargo dimensions, destinations, and modal preferences.",
    },
    {
      title: "Quotation",
      subtitle: "(within 2 hours)",
      text: "You will receive customized multimodal tariffs directly by email.",
    },
    {
      title: "Dispatch",
      subtitle: "(after approval)",
      text: "Our Mundra Port team assigns fleet and confirms the final timeline.",
    },
  ]
    .map(
      (step) => `
        <tr>
          <td style="padding:12px 14px; vertical-align:top; width:36px;">
            <span style="display:inline-block; width:28px; height:28px; background:${BRAND.brightOrange}; color:${BRAND.white}; border-radius:50%; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:800; text-align:center; line-height:28px;">&bull;</span>
          </td>
          <td style="padding:12px 8px; vertical-align:top;">
            <span style="font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:800; color:${BRAND.deepNavy};">${step.title} ${step.subtitle}</span>
            <div style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:${BRAND.slate}; line-height:1.5; margin-top:2px;">${step.text}</div>
          </td>
        </tr>`
    )
    .join("");

  const body = `
    ${brandHeaderHtml("We received your inquiry")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="content-pad" style="padding:26px 28px;">
      <tr>
        <td>
          <h1 style="margin:0 0 8px; font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:800; color:${BRAND.deepNavy};">Thank you, ${escape(lead.name)}!</h1>
          <p style="margin:0 0 18px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:${BRAND.slate}; line-height:1.6;">
            We have received your ${escape(lead.service || "shipping")} inquiry at our Mundra Port desk. Our routing team is analyzing your requirements. Keep the reference number below for all future correspondence:
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 22px;">
            <tr>
              <td style="background:${BRAND.cream}; border:2px solid ${BRAND.brightOrange}; border-radius:999px; padding:10px 20px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:800; color:${BRAND.brightOrange}; letter-spacing:2px; text-align:center;">
                REF: ${escape(lead.reference_number)}
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream}; border-radius:12px; border:1px solid ${BRAND.border};">
            <tr>
              <td style="padding:16px 18px 10px; font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:700; color:${BRAND.orange}; letter-spacing:2px; text-transform:uppercase;">What Happens Next</td>
            </tr>
            ${steps}
          </table>

          <p style="margin:22px 0 0; font-family:Arial, Helvetica, sans-serif; font-size:13px; color:${BRAND.slate}; line-height:1.6;">
            Urgent question? Our operations desk is available 24/7 for active transits:
            <a href="tel:+919922204446" style="color:${BRAND.brightOrange}; font-weight:700; text-decoration:none;">+91 99222 04446</a>.
          </p>
        </td>
      </tr>
    </table>
    ${brandFooterHtml()}`;

  return layoutHtml(body);
}

function buildInternalText(lead) {
  const submittedAt = new Date(lead.created_at || Date.now()).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return [
    `New Shipping Inquiry — Ref ${lead.reference_number}`,
    `Company: ${lead.company}`,
    `Contact: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Service: ${lead.service}`,
    `Submitted: ${submittedAt}`,
    lead.message ? `\nMessage:\n${lead.message}` : "",
    "",
    "Reply to " + lead.email,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildClientText(lead) {
  return [
    `Thank you, ${lead.name}!`,
    "",
    `We have received your ${lead.service || "shipping"} inquiry at our Mundra Port desk.`,
    `Reference Number: ${lead.reference_number}`,
    "",
    "What happens next:",
    "1. Analysis (0-1 hour) — our planners review your requirements.",
    "2. Quotation (within 2 hours) — customized tariffs by email.",
    "3. Dispatch — fleet assigned and timeline confirmed after approval.",
    "",
    "Urgent? Call +91 99222 04446 (24/7).",
  ].join("\n");
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
      subject: `New Inquiry ${lead.reference_number} — ${lead.company}`,
      html: buildInternalHtml(lead),
      text: buildInternalText(lead),
    });
  } catch (error) {
    failures.push(`owner notification: ${error.message}`);
  }

  try {
    customerEmail = await sendEmail({
      from,
      to: lead.email,
      subject: `We received your inquiry — Ref ${lead.reference_number}`,
      html: buildClientHtml(lead),
      text: buildClientText(lead),
    });
  } catch (error) {
    failures.push(`customer confirmation: ${error.message}`);
  }

  if (failures.length) {
    throw new Error(failures.join("; "));
  }

  return { ownerEmail, customerEmail };
}