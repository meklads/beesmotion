/**
 * Serve /ai/ at ai.beesmotion.com root (same Pages project).
 * Asset paths under /ai/ stay absolute from site root via relative ../assets.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();

  if (host === "ai.beesmotion.com" || host.startsWith("ai.")) {
    if (url.pathname === "/" || url.pathname === "") {
      return Response.redirect(new URL("/ai/", "https://beesmotion.com"), 302);
    }
    if (!url.pathname.startsWith("/ai") && !url.pathname.startsWith("/assets") && !url.pathname.startsWith("/real-estate")) {
      return Response.redirect(new URL("/ai/" + url.pathname.replace(/^\//, ""), "https://beesmotion.com"), 302);
    }
  }

  return context.next();
}
