import { StandardEmailProvider, EmailPayload } from "./provider.ts";
import { LeadInput } from "../validations/lead.ts";

const emailProvider = new StandardEmailProvider();

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendLeadNotificationEmail(
  lead: LeadInput,
  leadId: string,
): Promise<boolean> {
  const notifyEmail = process.env.LEADS_NOTIFICATION_EMAIL?.trim() || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!notifyEmail) {
    console.warn(
      "[Email] No notification address configured; skipping lead notification email.",
    );
    return false;
  }

  const name = escapeHtml(lead.name);
  const phone = escapeHtml(lead.phone);
  const email = lead.email ? escapeHtml(lead.email) : "";
  const location = escapeHtml(lead.location);
  const projectType = escapeHtml(lead.projectType);
  const carpetAreaRange = escapeHtml(lead.carpetAreaRange || "Not specified");
  const budgetRange = escapeHtml(lead.budgetRange || "Not specified");
  const timeline = escapeHtml(lead.timeline || "Immediate");
  const message = lead.message ? escapeHtml(lead.message) : "";
  const emailSiteUrl = escapeHtml(siteUrl);
  const safeLeadId = escapeHtml(leadId);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0e0f14; color: #ede9e1; padding: 32px; border-radius: 8px;">
      <h2 style="color: #c5a880; font-family: Georgia, serif; margin-top: 0;">New Turnkey Consultation Inquiry</h2>
      <p style="color: #a8a49a; font-size: 14px;">A new prospective homeowner inquiry has been recorded through the JK Interior website.</p>
      
      <div style="background: #15161e; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 3px solid #c5a880;">
        <h4 style="margin: 0 0 12px 0; color: #fbf9f5; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Client Details</h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Phone / WhatsApp:</strong> <a href="tel:${phone}" style="color: #c5a880;">${phone}</a></p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> ${email ? `<a href="mailto:${email}" style="color: #c5a880;">${email}</a>` : "Not provided"}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Location:</strong> ${location}</p>
      </div>

      <div style="background: #15161e; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin: 0 0 12px 0; color: #fbf9f5; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Project Scope</h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Project Type:</strong> ${projectType}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Scale:</strong> ${carpetAreaRange}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Budget Band:</strong> ${budgetRange}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Timeline:</strong> ${timeline}</p>
        ${message ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #d0cbc0;"><strong>Design Notes:</strong> ${message}</p>` : ""}
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${emailSiteUrl}/#admin" style="display: inline-block; background: #c5a880; color: #0a0a0c; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
          View Lead in Admin CMS
        </a>
      </div>

      <p style="font-size: 11px; color: #6e6a60; text-align: center; margin-top: 30px;">
        JK Interior Mumbai · Lower Parel Sun Mill Atelier · Lead ID: ${safeLeadId}
      </p>
    </div>
  `;

  try {
    const res = await emailProvider.send({
      to: notifyEmail,
      subject: `New Lead: ${lead.name} — ${lead.projectType} (${lead.location})`,
      html,
      text: `New Lead from ${lead.name} (${lead.phone}) for ${lead.projectType} in ${lead.location}.`,
    });
    return res.success;
  } catch (err) {
    console.warn(
      "[Email] Lead notification failed, but lead remains securely saved:",
      err,
    );
    return false;
  }
}

export async function sendCustomerConfirmationEmail(
  lead: LeadInput,
): Promise<boolean> {
  if (!lead.email || lead.email.trim() === "") return true;

  const name = escapeHtml(lead.name);
  const projectType = escapeHtml(lead.projectType);
  const location = escapeHtml(lead.location);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0e0f14; color: #ede9e1; padding: 32px; border-radius: 8px;">
      <h2 style="color: #c5a880; font-family: Georgia, serif; margin-top: 0;">Thank You for Contacting JK Interior</h2>
      <p style="color: #cfc9be; font-size: 14px; line-height: 1.6;">
        Dear ${name},
      </p>
      <p style="color: #cfc9be; font-size: 14px; line-height: 1.6;">
        Thank you for sharing your project details with JK Interior. Our executive design desk, founded by Kishorilal Sharma, has received your inquiry for your <strong>${projectType}</strong> in <strong>${location}</strong>.
      </p>
      <p style="color: #cfc9be; font-size: 14px; line-height: 1.6;">
        One of our senior interior architects will contact you shortly to review your layout and discuss our in-house workshop joinery and turnkey process.
      </p>

      <div style="margin: 28px 0; padding: 16px; border-top: 1px solid #22232d; border-bottom: 1px solid #22232d;">
        <p style="margin: 0; font-size: 12px; color: #9f9b90;">
          <strong>JK Interior Atelier & Joinery Works</strong><br>
          Sun Mill Compound, Lower Parel West, Mumbai 400013<br>
          Direct Desk: +91 98201 23456
        </p>
      </div>

      <p style="font-size: 11px; color: #6e6a60; text-align: center;">
        Contemporary luxury interior design, architecture, and turnkey craftsmanship in Mumbai.
      </p>
    </div>
  `;

  try {
    const res = await emailProvider.send({
      to: lead.email,
      subject: "Thank You for Contacting JK Interior Mumbai",
      html,
      text: `Dear ${lead.name}, Thank you for sharing your project details with JK Interior. Our team has received your inquiry and will contact you.`,
    });
    return res.success;
  } catch (err) {
    console.warn(
      "[Email] Customer confirmation failed, but lead remains securely saved:",
      err,
    );
    return false;
  }
}
