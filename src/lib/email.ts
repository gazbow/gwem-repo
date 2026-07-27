import { Resend } from "resend";
import type { GuideResult } from "@/lib/types";
import { site } from "@/data/config";

// Email delivery via Resend (Build Spec sections 2 & 9). No-ops safely when
// RESEND_API_KEY is unset so local dev and previews still complete the flow.

const FROM = process.env.EMAIL_FROM ?? "Landart Garden Guide <guide@landart.com.au>";

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function resultEmailHtml(name: string, result: GuideResult): string {
  const plants = result.plants
    .map(
      (p) =>
        `<li style="margin-bottom:6px"><strong>${p.name}</strong> <span style="color:#8a8680">— ${p.note}</span></li>`,
    )
    .join("");
  const features = result.features
    .map((f) => `<li style="margin-bottom:6px"><strong>${f.name}</strong></li>`)
    .join("");
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#363636;max-width:560px;margin:0 auto">
    <div style="background:#363636;color:#fff;padding:24px">
      <div style="letter-spacing:3px;font-weight:bold;font-size:18px">LANDART</div>
      <div style="color:#c5a47e;letter-spacing:2px;text-transform:uppercase;font-size:11px;margin-top:8px">Your Garden Concept</div>
    </div>
    <div style="padding:24px;background:#ece9e3">
      <p>Hi ${name || "there"},</p>
      <p>Thanks for using the Landart Garden Guide. Your tailored concept direction —
      <strong>${result.style.name}</strong> — is attached as a PDF.</p>
      <p style="color:#8a8680">${result.style.summary}</p>
      <p style="color:#c5a47e;letter-spacing:2px;text-transform:uppercase;font-size:11px">A few of your plants</p>
      <ul>${plants}</ul>
      <p style="color:#c5a47e;letter-spacing:2px;text-transform:uppercase;font-size:11px">Features to consider</p>
      <ul>${features}</ul>
      <p style="margin-top:24px">
        <a href="${site.landartUrl}" style="background:#c5a47e;color:#363636;text-decoration:none;padding:12px 20px;text-transform:uppercase;letter-spacing:2px;font-size:12px;display:inline-block">Book a consult</a>
      </p>
      <p style="color:#8a8680;font-size:12px;margin-top:24px">Landart — garden design across Sydney's Eastern Suburbs and Northern Beaches.</p>
    </div>
  </div>`;
}

export interface SendResultArgs {
  to: string;
  name: string;
  result: GuideResult;
  pdf: Buffer;
}

/** Send the visitor their branded PDF. Returns false (rather than throwing) if email is not configured or fails. */
export async function sendResultEmail(args: SendResultArgs): Promise<boolean> {
  const resend = client();
  if (!resend) return false;
  try {
    await resend.emails.send({
      from: FROM,
      to: args.to,
      subject: `Your Landart garden concept — ${args.result.style.name}`,
      html: resultEmailHtml(args.name, args.result),
      attachments: [
        {
          filename: "landart-garden-concept.pdf",
          content: args.pdf,
        },
      ],
    });
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

/** Optional internal new-lead alert to Landart (Build Spec section 9, step 6). */
export async function sendInternalNotification(summary: {
  name: string;
  email: string;
  suburb?: string;
  style: string;
}): Promise<void> {
  const resend = client();
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!resend || !to) return;
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `New garden guide lead: ${summary.name}`,
      html: `<p>New lead from the Garden Guide.</p>
        <ul>
          <li><strong>Name:</strong> ${summary.name}</li>
          <li><strong>Email:</strong> ${summary.email}</li>
          <li><strong>Suburb:</strong> ${summary.suburb ?? "—"}</li>
          <li><strong>Style:</strong> ${summary.style}</li>
        </ul>`,
    });
  } catch (err) {
    console.error("[email] internal notification failed:", err);
  }
}
