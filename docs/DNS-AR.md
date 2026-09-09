# DNS — beesmotion.com

## الإنتاج الحالي: Cloudflare Pages ✅

منذ التحويل الأخير، النطاق يشير إلى **Cloudflare Pages** (`beesmotion.pages.dev`):

| Type  | Name | Content                 | Proxy |
| ----- | ---- | ----------------------- | ----- |
| CNAME | `@`  | `beesmotion.pages.dev`  | Proxied |
| CNAME | `www`| `beesmotion.pages.dev`  | Proxied |
| CNAME | `ai` | `beesmotion.pages.dev`  | Proxied |

- SSL/TLS في Cloudflare: **Full**
- `_redirects` و`functions/_middleware.js` و`_headers` تعمل على هذا المضيف
- النشر: `npm run deploy` أو push إلى `main` (عند ضبط أسرار GitHub)

إعادة التحويل إن لزم:

```bash
export CLOUDFLARE_API_TOKEN="…"   # Zone DNS Edit على beesmotion.com
bash scripts/switch-dns-to-pages.sh
# أو: npm run dns:pages
```

OAuth الخاص بـ Wrangler غالباً **لا يكفي** لـ DNS (401) — استخدم API Token.

## الاحتياطي: GitHub Pages

كان المضيف السابق `meklads.github.io`. الإبقاء على الدفع لـ `main` مفيد كنسخة؛ الزوار يرون Pages ما دام DNS يشير إليه.

## ملاحظات

- مسارات `/services/*` لها stubs + `Disallow` في robots.
- `/vip/` و`/offers/` محجوبة عبر robots + `X-Robots-Tag`.
