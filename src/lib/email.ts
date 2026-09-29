import "server-only";
import type { Enquiry } from "@/lib/db/schema";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Sends a new-enquiry notification through Resend when RESEND_API_KEY and
 * ENQUIRY_NOTIFY_TO are set. The enquiry is already stored, so failures are
 * logged rather than surfaced to the visitor.
 */
export async function notifyNewEnquiry(e: Enquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_TO;
  if (!apiKey || !to) return;

  const rows: [string, string][] = [
    ["Name", e.name],
    ["Company", e.company || "—"],
    ["Email", e.email],
    ["Phone", e.phone || "—"],
    ["Service", e.service || "—"],
    ["Budget", e.budget || "—"],
  ];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_NOTIFY_FROM ?? "Idearigs Website <website@idearigs.lk>",
        to: to.split(",").map((s) => s.trim()),
        reply_to: e.email,
        subject: `New brief: ${e.name}${e.company ? ` — ${e.company}` : ""}`,
        text: [...rows.map(([k, v]) => `${k}: ${v}`), "", e.message].join("\n"),
        html: `<table>${rows
          .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5B5F5B">${k}</td><td>${escape(v)}</td></tr>`)
          .join("")}</table><p style="white-space:pre-wrap">${escape(e.message)}</p>`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[email] Resend responded", res.status, await res.text());
  } catch (err) {
    console.error("[email] enquiry notification failed", err);
  }
}
