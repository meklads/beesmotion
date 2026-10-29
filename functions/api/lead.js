/**
 * POST /api/lead — receives the real-estate project assessment form.
 *
 * Delivery is configured with Cloudflare Pages environment variables
 * (Settings → Variables and Secrets). Nothing is hard-coded here.
 *
 *   Email via Resend:   RESEND_API_KEY, LEAD_FROM_EMAIL, LEAD_TO_EMAIL (comma-separated)
 *   Webhook (optional): LEAD_WEBHOOK_URL  (Google Apps Script, Zapier, Make, CRM inbound hook…)
 *
 * If neither is configured the endpoint answers 503 {reason:"not_configured"}
 * and the page falls back to WhatsApp. It never reports success it did not achieve.
 */
const LIMITS = {
  name: 120, company: 160, phone: 40, email: 160, project: 160,
  location: 120, choice: 60, notes: 1500,
};

const CHOICES = {
  projectType: ["residential", "commercial", "mixed-use", "other"],
  stage: ["preparing", "launching-now", "improving"],
  materials: ["ready", "partial", "not-yet"],
  timeframe: ["under-1-month", "1-3-months", "3-plus-months", "existing-campaign"],
  support: ["pre-launch", "launch", "growth-launch", "not-sure"],
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function validate(raw) {
  if (!raw || typeof raw !== "object") return { error: "invalid_body" };
  if (clean(raw.website, 200)) return { honeypot: true }; // bots fill hidden fields

  const lead = {
    name: clean(raw.name, LIMITS.name),
    company: clean(raw.company, LIMITS.company),
    phone: clean(raw.phone, LIMITS.phone),
    email: clean(raw.email, LIMITS.email),
    project: clean(raw.project, LIMITS.project),
    location: clean(raw.location, LIMITS.location),
    notes: clean(raw.notes, LIMITS.notes),
    lang: raw.lang === "ar" ? "ar" : "en",
    source: clean(raw.source, 80) || "propmotion-assessment",
  };
  for (const [key, allowed] of Object.entries(CHOICES)) {
    const v = clean(raw[key], LIMITS.choice);
    lead[key] = allowed.includes(v) ? v : "";
  }

  const digits = lead.phone.replace(/\D/g, "");
  if (!lead.name) return { error: "name_required" };
  if (digits.length < 7 || digits.length > 15) return { error: "phone_invalid" };
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { error: "email_invalid" };
  if (!lead.stage) return { error: "stage_required" };
  if (raw.consent !== true) return { error: "consent_required" };
  lead.consent = true;
  return { lead };
}

const LABELS = [
  ["name", "Name"], ["company", "Company"], ["phone", "Phone / WhatsApp"], ["email", "Email"],
  ["project", "Project name"], ["projectType", "Project type"], ["location", "Location"],
  ["stage", "Current stage"], ["materials", "Approved materials"], ["timeframe", "Launch timeframe"],
  ["support", "Support needed"], ["notes", "Notes"], ["lang", "Language"], ["source", "Source"],
];

function compose(lead, receivedAt) {
  const rows = LABELS.filter(([k]) => lead[k]).map(([k, label]) => [label, lead[k]]);
  const text = rows.map(([l, v]) => `${l}: ${v}`).join("\n") +
    `\nConsent: given\nReceived: ${receivedAt}`;
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">` +
    rows.map(([l, v]) => `<tr><td style="color:#666"><b>${esc(l)}</b></td><td>${esc(v)}</td></tr>`).join("") +
    `<tr><td style="color:#666"><b>Consent</b></td><td>given</td></tr>` +
    `<tr><td style="color:#666"><b>Received</b></td><td>${esc(receivedAt)}</td></tr></table>`;
  return { text, html };
}

async function sendResend(env, lead, receivedAt) {
  if (!env.RESEND_API_KEY || !env.LEAD_FROM_EMAIL || !env.LEAD_TO_EMAIL) return null;
  const { text, html } = compose(lead, receivedAt);
  const subject = `New real-estate assessment request — ${lead.project || lead.company || lead.name}`;
  const body = {
    from: env.LEAD_FROM_EMAIL,
    to: env.LEAD_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
    subject, text, html,
  };
  if (lead.email) body.reply_to = lead.email;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok;
}

async function sendWebhook(env, lead, receivedAt) {
  if (!env.LEAD_WEBHOOK_URL) return null;
  const res = await fetch(env.LEAD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, receivedAt }),
  });
  return res.ok;
}

export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== url.host) return json({ ok: false, reason: "forbidden" }, 403);

  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > 20000) return json({ ok: false, reason: "too_large" }, 413);

  let raw;
  try { raw = await request.json(); } catch (_) { return json({ ok: false, reason: "invalid_body" }, 400); }

  const result = validate(raw);
  if (result.honeypot) return json({ ok: true }); // drop silently
  if (result.error) return json({ ok: false, reason: result.error }, 400);

  const configured = !!(env.LEAD_WEBHOOK_URL || (env.RESEND_API_KEY && env.LEAD_FROM_EMAIL && env.LEAD_TO_EMAIL));
  if (!configured) return json({ ok: false, reason: "not_configured" }, 503);

  const receivedAt = new Date().toISOString();
  const outcomes = [];
  for (const send of [sendResend, sendWebhook]) {
    try {
      const r = await send(env, result.lead, receivedAt);
      if (r !== null) outcomes.push(r);
    } catch (_) {
      outcomes.push(false);
    }
  }
  if (outcomes.some(Boolean)) return json({ ok: true });
  return json({ ok: false, reason: "delivery_failed" }, 502);
}

export const onRequest = () => json({ ok: false, reason: "method_not_allowed" }, 405);
