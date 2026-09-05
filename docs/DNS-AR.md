# DNS — beesmotion.com (الوضع الحالي)

## الحي الآن: GitHub Pages

النطاق يشير إلى GitHub Pages عبر Cloudflare DNS (Proxied):

| Type  | Name | Content              | Proxy |
| ----- | ---- | -------------------- | ----- |
| CNAME | `@`  | `meklads.github.io`  | Proxied |
| CNAME | `www`| `meklads.github.io`  | Proxied |

- SSL/TLS في Cloudflare: **Full**
- بعد كل `git push` إلى `main` انتظر دقيقة ثم Hard Refresh

التحقق: في مصدر الصفحة ابحث عن `?v=20260905p0` (أو أحدث cache bust).

## العودة لاحقاً إلى Cloudflare Pages

عندما يعمل `npm run deploy` بنجاح:

| Type  | Name | Content                 | Proxy |
| ----- | ---- | ----------------------- | ----- |
| CNAME | `@`  | `beesmotion.pages.dev`  | Proxied |
| CNAME | `www`| `beesmotion.pages.dev`  | Proxied |

أو: `bash scripts/setup-cloudflare-dns.sh` (يحتاج `CLOUDFLARE_API_TOKEN` بصلاحية DNS Edit).

ملاحظة: `_redirects` و `functions/` يعملان على Cloudflare Pages فقط. على GitHub Pages صفحات `services/*` مضبوطة `noindex`.
