/**
 * Bees Motion — real-estate assessment leads → Google Sheet + email alert.
 *
 * Receives the JSON that functions/api/lead.js posts to LEAD_WEBHOOK_URL,
 * appends one row to the "Leads" tab and emails the team.
 *
 * Setup (signed in as beesmotionhome@gmail.com) — see docs/LEADS-GOOGLE-SHEET-AR.md:
 *   1. Create a Google Sheet, then Extensions → Apps Script, paste this file.
 *   2. Project Settings → Script properties → add LEAD_TOKEN = <long random string>.
 *   3. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 *   4. In Cloudflare Pages set LEAD_WEBHOOK_URL = <web app URL>?token=<LEAD_TOKEN>, then redeploy.
 */
const SHEET_NAME = "Leads";
const NOTIFY_EMAIL = "beesmotionhome@gmail.com";
const FIELDS = [
  ["receivedAt", "Received"], ["name", "Name"], ["company", "Company"], ["phone", "Phone / WhatsApp"],
  ["email", "Email"], ["project", "Project"], ["projectType", "Project type"], ["location", "Location"],
  ["stage", "Current stage"], ["materials", "Approved materials"], ["timeframe", "Launch timeframe"],
  ["support", "Support needed"], ["notes", "Notes"], ["lang", "Language"], ["source", "Source"], ["consent", "Consent"],
];

function doPost(e) {
  const token = PropertiesService.getScriptProperties().getProperty("LEAD_TOKEN");
  if (!token || !e || !e.parameter || e.parameter.token !== token) return reply_({ ok: false, reason: "forbidden" });

  let lead;
  try {
    lead = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, reason: "invalid_body" });
  }
  if (!lead || !lead.name || !lead.phone) return reply_({ ok: false, reason: "invalid_lead" });
  lead.consent = lead.consent ? "yes" : "no";
  lead.receivedAt = lead.receivedAt || new Date().toISOString();

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(FIELDS.map(([, label]) => label));
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(FIELDS.map(([key]) => cell_(lead[key])));
  } finally {
    lock.releaseLock();
  }

  try {
    const lines = FIELDS.filter(([key]) => lead[key]).map(([key, label]) => label + ": " + lead[key]);
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: lead.email || NOTIFY_EMAIL,
      subject: "New real-estate assessment request — " + (lead.project || lead.company || lead.name),
      body: lines.join("\n") + "\n\nSheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    });
  } catch (err) {
    // The row is saved even if the email quota is reached.
  }
  return reply_({ ok: true });
}

/** Stops values such as "=..." or "+966..." from being read as spreadsheet formulas. */
function cell_(value) {
  const s = value == null ? "" : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
