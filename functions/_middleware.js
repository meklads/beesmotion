/**
 * Cloudflare Pages middleware:
 * - TEMPORARY preview password gate (see GATE_* below)
 * - ai.beesmotion.com → /ai/ on apex
 * - security headers on all responses
 * - noindex for private paths
 */

// ── TEMPORARY PREVIEW GATE ────────────────────────────────────────────────
// To open the site to everyone: set GATE_ENABLED = false and redeploy,
// or add the Cloudflare Pages Production variable GATE_OFF=1 and redeploy
// (Pages applies variable changes to new deployments only).
// The access code is stored only as a SHA-256 hash. This is a soft gate for
// keeping casual visitors out during review, not strong security.
const GATE_ENABLED = false;
const GATE_HASH = "20f3765880a5c269b747e1e906054a4b4a3a991259f1e16b5dde4742cec2319a";
const GATE_COOKIE = "bm_gate";
const GATE_PATH = "/__gate";

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return "";
}

function safeNext(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/__gate")
    ? value
    : "/";
}

function gatePage(nextPath, hasError) {
  const err = hasError
    ? '<p class="err" role="alert">رمز الدخول غير صحيح · Incorrect access code</p>'
    : "";
  const esc = nextPath.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Bees Motion</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0c0d10;color:#fff;font-family:Tajawal,"IBM Plex Sans Arabic",system-ui,sans-serif;padding:1.5rem}
.card{width:100%;max-width:26rem;padding:2rem 1.75rem;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:#16181d;text-align:center}
h1{margin:0 0 .35rem;font-size:1.5rem}p{margin:.25rem 0 1.25rem;color:rgba(255,255,255,.72);line-height:1.6}
input{width:100%;padding:.9rem 1rem;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:#0c0d10;color:#fff;font-size:1.25rem;text-align:center;letter-spacing:.35em}
input:focus{outline:2px solid #f5c84d;outline-offset:2px}
button{margin-top:1rem;width:100%;padding:.9rem 1rem;border:0;border-radius:999px;background:#e5a823;color:#0c0d10;font-weight:700;font-size:1rem;cursor:pointer}
.err{color:#ffb4a8;margin:.75rem 0 0}
</style></head><body>
<main class="card">
<h1>الموقع قيد المراجعة</h1>
<p>Site under review<br />أدخل رمز الدخول للمتابعة · Enter the access code to continue</p>
<form method="post" action="${GATE_PATH}">
<input type="hidden" name="next" value="${esc}" />
<label for="code" style="position:absolute;left:-9999px">Access code</label>
<input id="code" name="code" type="password" inputmode="numeric" autocomplete="off" required autofocus />
<button type="submit">دخول · Enter</button>
${err}
</form></main></body></html>`;
}

async function handleGate(context, url) {
  const { request, env } = context;
  if (!GATE_ENABLED || (env && env.GATE_OFF === "1")) return null;

  const token = await sha256Hex("bm-gate-v1:" + GATE_HASH);
  const noStore = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "Content-Type": "text/html; charset=utf-8",
  };

  if (url.pathname === GATE_PATH && request.method === "POST") {
    let code = "";
    let next = "/";
    try {
      const form = await request.formData();
      code = String(form.get("code") || "").trim();
      next = safeNext(String(form.get("next") || "/"));
    } catch (_) {}
    if ((await sha256Hex(code)) === GATE_HASH) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: next,
          "Cache-Control": "no-store",
          "Set-Cookie": `${GATE_COOKIE}=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }
    return new Response(gatePage(next, true), { status: 401, headers: noStore });
  }

  if (readCookie(request, GATE_COOKIE) === token) return null;

  if (url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ ok: false, reason: "locked" }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  return new Response(gatePage(safeNext(url.pathname + url.search), false), {
    status: 401,
    headers: noStore,
  });
}
// ──────────────────────────────────────────────────────────────────────────
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};

function withSecurity(response, extra = {}) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  for (const [k, v] of Object.entries(extra)) {
    headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();
  const path = url.pathname;

  if (host === "ai.beesmotion.com" || host.startsWith("ai.")) {
    if (url.pathname === "/" || url.pathname === "") {
      return Response.redirect(new URL("/ai/", "https://beesmotion.com"), 302);
    }
    if (
      !url.pathname.startsWith("/ai") &&
      !url.pathname.startsWith("/assets") &&
      !url.pathname.startsWith("/real-estate")
    ) {
      return Response.redirect(
        new URL("/ai/" + url.pathname.replace(/^\//, ""), "https://beesmotion.com"),
        302
      );
    }
  }

  const gated = await handleGate(context, url);
  if (gated) return gated;

  const response = await context.next();

  const privatePath =
    path.startsWith("/vip") ||
    path.startsWith("/offers") ||
    path.startsWith("/book-appointment") ||
    path === "/thank-you.html";

  return withSecurity(
    response,
    privatePath ? { "X-Robots-Tag": "noindex, nofollow" } : {}
  );
}
