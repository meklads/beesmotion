/**
 * Cloudflare Pages middleware:
 * - ai.beesmotion.com → /ai/ on apex
 * - security headers on all responses
 * - noindex for private paths
 */
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
