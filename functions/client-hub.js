/**
 * /client-hub — password-only private page (no username).
 * Served entirely by this Pages Function, so the links never sit in a public static file.
 * The password is stored only as a salted SHA-256 hash. To change it:
 *   python3 -c "import hashlib;print(hashlib.sha256(b'bm-hub-v1:NEWPASSWORD').hexdigest())"
 * and replace HUB_HASH below. Changing it also signs everyone out.
 */
const HUB_HASH = "8416805405e0ead82d5b93c38572c2a16096e771e7bae3719794b7375585136d";
const COOKIE = "bm_hub";
const PATH = "/client-hub";

const LANDING_PAGES = [
  { ar: "باقات الريلز الشهرية", en: "Monthly reels packages", brand: "Bees Motion",
    url: "https://beesmotion.com/lp/reels-content-packs", alt: "https://beesmotion.com/lp/reels-content-packs-en" },
  { ar: "محرك محتوى العقار", en: "Property Content Engine", brand: "Bees Motion",
    url: "https://beesmotion.com/lp/property-content-engine", alt: "https://beesmotion.com/lp/property-content-engine-en" },
  { ar: "باقات صفحات الهبوط", en: "Landing page packages", brand: "Bees Motion",
    url: "https://beesmotion.com/lp/landing-page-packages", alt: "https://beesmotion.com/lp/landing-page-packages-en" },
  { ar: "الإظهار المعماري", en: "Architectural rendering", brand: "Graphics House",
    url: "https://3dgraphicshouse.com/lp/rendering.html" },
];

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
const sessionToken = () => sha256Hex("bm-hub-session-v1:" + HUB_HASH);

const HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

const BASE_CSS = `*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;background:#0a0a0b;color:#fff;font-family:Tajawal,"IBM Plex Sans Arabic",system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:inherit}
.en{font-family:"Plus Jakarta Sans","Helvetica Neue",Arial,sans-serif}
.k{display:inline-flex;align-items:center;gap:.7rem;font-family:"Plus Jakarta Sans",sans-serif;font-size:.78rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.k::before{content:"";width:1.6rem;height:1px;background:#b8955a}
:focus-visible{outline:2px solid #b8955a;outline-offset:3px}`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap" rel="stylesheet">`;

function head(title) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>${title}</title><link rel="icon" href="/assets/img/bees-motion-favicon.png" type="image/png">${FONTS}`;
}

function loginPage(hasError) {
  const err = hasError ? `<p class="err" role="alert">كلمة السر غير صحيحة · Incorrect password</p>` : "";
  return `${head("Client Hub | Bees Motion")}
<style>${BASE_CSS}
body{display:grid;place-items:center;padding:1.5rem;background:radial-gradient(circle at 50% 30%,rgba(184,149,90,.14),transparent 55%),#0a0a0b}
.card{width:100%;max-width:25rem;padding:2.4rem 2rem;border:1px solid rgba(255,255,255,.1);border-radius:24px;background:#1c1c1f;text-align:center}
.logo{height:42px;width:auto;margin:0 auto 1.8rem;display:block}
h1{font-size:1.7rem;font-weight:500;margin:.8rem 0 .3rem}
p{color:rgba(255,255,255,.62);font-size:.95rem}
input{width:100%;margin-top:1.6rem;padding:.95rem 1rem;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:#0a0a0b;color:#fff;font-size:1.3rem;text-align:center;letter-spacing:.4em}
input:focus{outline:none;border-color:#b8955a}
button{margin-top:1rem;width:100%;min-height:3.2rem;border:0;border-radius:999px;background:#b8955a;color:#0a0a0b;font:inherit;font-weight:700;font-size:1rem;cursor:pointer}
button:hover{background:#c9a96d}
.err{color:#ffb4a8;margin-top:1rem}
</style></head><body>
<main class="card">
<img class="logo" src="/assets/img/brands/bees-motion-logo-on-dark.png" alt="Bees Motion" width="89" height="42">
<span class="k">Client Hub</span>
<h1>بوابة العملاء</h1>
<p>أدخل كلمة السر للمتابعة · Enter the password to continue</p>
<form method="post" action="${PATH}">
<label for="pw" style="position:absolute;left:-9999px">Password</label>
<input id="pw" name="password" type="password" inputmode="numeric" autocomplete="current-password" required autofocus>
<button type="submit">دخول · Enter</button>
${err}
</form>
</main></body></html>`;
}

function hubPage() {
  const ext = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`;
  const items = LANDING_PAGES.map((p, i) => `
<li class="item">
 <span class="n en">${String(i + 1).padStart(2, "0")}</span>
 <div class="body">
  <span class="brand en">${p.brand}</span>
  <h3>${p.ar} <span class="en sub">${p.en}</span></h3>
  <a class="url en" href="${p.url}" target="_blank" rel="noopener" dir="ltr">${p.url.replace("https://", "")}</a>
 </div>
 <div class="acts">
  <a class="btn gold" href="${p.url}" target="_blank" rel="noopener">${p.alt ? "AR" : "فتح"} ${ext}</a>
  ${p.alt ? `<a class="btn" href="${p.alt}" target="_blank" rel="noopener">EN ${ext}</a>` : ""}
  <button class="btn copy" type="button" data-url="${p.url}">نسخ الرابط</button>
 </div>
</li>`).join("");
  return `${head("Client Hub | Bees Motion")}
<style>${BASE_CSS}
.wrap{max-width:62rem;margin:0 auto;padding:0 clamp(1.25rem,4vw,2.5rem)}
header{border-bottom:1px solid rgba(255,255,255,.08)}
header .wrap{height:76px;display:flex;align-items:center;justify-content:space-between}
header img{height:38px;width:auto}
.out{font-size:.9rem;color:rgba(255,255,255,.6);text-decoration:none;border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:.4rem 1rem}
.out:hover{color:#fff;border-color:#fff}
.intro{padding:clamp(3rem,7vw,5rem) 0 2rem}
h1{font-size:clamp(2.2rem,5vw,3.4rem);font-weight:500;line-height:1.25;margin:.9rem 0 .5rem}
.intro p{color:rgba(255,255,255,.62)}
h2{display:flex;align-items:baseline;gap:.8rem;font-family:"Plus Jakarta Sans",sans-serif;font-weight:300;font-size:clamp(1.6rem,3vw,2.1rem);letter-spacing:-.02em;margin:2rem 0 1.2rem}
h2 small{font-size:.9rem;color:#b8955a;font-weight:600;letter-spacing:0}
ul{list-style:none;display:grid;gap:1rem;padding-bottom:5rem}
.item{display:grid;grid-template-columns:auto 1fr auto;gap:1.2rem 1.5rem;align-items:center;background:#1c1c1f;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:1.4rem 1.6rem;transition:border-color .2s}
.item:hover{border-color:rgba(184,149,90,.5)}
.n{font-size:1.8rem;font-weight:300;color:#b8955a;line-height:1}
.brand{font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45)}
h3{font-size:1.15rem;font-weight:700;margin:.15rem 0 .2rem}
.sub{font-weight:400;font-size:.85rem;color:rgba(255,255,255,.5);margin-inline-start:.4rem}
.url{font-size:.85rem;color:rgba(255,255,255,.55);text-decoration:none;word-break:break-all}
.url:hover{color:#c9a96d}
.acts{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:flex-end}
.btn{display:inline-flex;align-items:center;gap:.35rem;min-height:2.5rem;padding:0 1rem;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:transparent;color:#fff;font:inherit;font-size:.88rem;font-weight:600;text-decoration:none;cursor:pointer;font-family:"Plus Jakarta Sans",Tajawal,sans-serif}
.btn:hover{border-color:#fff}
.btn.gold{background:#b8955a;border-color:#b8955a;color:#0a0a0b}.btn.gold:hover{background:#c9a96d}
.copy.ok{border-color:#b8955a;color:#c9a96d}
@media(max-width:44rem){.sub{display:block;margin:0}.item{grid-template-columns:auto 1fr}.acts{grid-column:1/-1;justify-content:flex-start}}
</style></head><body>
<header><div class="wrap"><a href="/"><img src="/assets/img/brands/bees-motion-logo-on-dark.png" alt="Bees Motion" width="81" height="38"></a>
<a class="out" href="${PATH}?logout=1">خروج · Sign out</a></div></header>
<main class="wrap">
<section class="intro"><span class="k">Client Hub</span><h1>بوابة العملاء</h1><p>روابط خاصة لمشاركتها مع العملاء. الصفحات غير مفهرسة في محركات البحث.</p></section>
<h2>Landing pages <small>${LANDING_PAGES.length}</small></h2>
<ul>${items}</ul>
</main>
<script>
document.querySelectorAll(".copy").forEach(function(b){b.addEventListener("click",function(){
 var u=b.dataset.url,t=b.textContent;
 function done(){b.textContent="تم النسخ";b.classList.add("ok");setTimeout(function(){b.textContent=t;b.classList.remove("ok")},1600)}
 if(navigator.clipboard){navigator.clipboard.writeText(u).then(done,function(){prompt("",u)})}else{prompt("",u)}
})});
</script>
</body></html>`;
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const token = await sessionToken();

  if (url.searchParams.get("logout") === "1") {
    return new Response(null, {
      status: 303,
      headers: { Location: PATH, "Cache-Control": "no-store",
        "Set-Cookie": `${COOKIE}=; Path=${PATH}; Max-Age=0; HttpOnly; Secure; SameSite=Lax` },
    });
  }

  if (request.method === "POST") {
    let pw = "";
    try { pw = String((await request.formData()).get("password") || "").trim(); } catch (_) {}
    if ((await sha256Hex("bm-hub-v1:" + pw)) === HUB_HASH) {
      return new Response(null, {
        status: 303,
        headers: { Location: PATH, "Cache-Control": "no-store",
          "Set-Cookie": `${COOKIE}=${token}; Path=${PATH}; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax` },
      });
    }
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return new Response(loginPage(true), { status: 401, headers: HEADERS });
  }

  if (readCookie(request, COOKIE) === token) {
    return new Response(hubPage(), { status: 200, headers: HEADERS });
  }
  return new Response(loginPage(false), { status: 401, headers: HEADERS });
}
