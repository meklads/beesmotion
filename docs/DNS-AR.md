# DNS — beesmotion.com

## المقصود للإنتاج: Cloudflare Pages

المضيف المقصود للإنتاج هو **Cloudflare Pages** (`beesmotion.pages.dev`) مع `_redirects` و`functions/_middleware.js`.

للتبديل من GitHub Pages إلى Pages:

```bash
bash scripts/switch-dns-to-pages.sh
```

يحتاج **`CLOUDFLARE_API_TOKEN` بصلاحية Zone DNS Edit** على نطاق beesmotion.com.  
OAuth الخاص بـ Wrangler غالباً **لا يكفي** (يرجع 401) — أنشئ API Token من Cloudflare Dashboard → My Profile → API Tokens.

يحدّث سجلات `@` و`www` و`ai` إلى `beesmotion.pages.dev` (Proxied).

| Type  | Name | Content                 | Proxy |
| ----- | ---- | ----------------------- | ----- |
| CNAME | `@`  | `beesmotion.pages.dev`  | Proxied |
| CNAME | `www`| `beesmotion.pages.dev`  | Proxied |
| CNAME | `ai` | `beesmotion.pages.dev`  | Proxied |

- SSL/TLS في Cloudflare: **Full**
- بعد التبديل انتظر ٢–٥ دقائق ثم Hard Refresh

## الوضع الاحتياطي الحالي: GitHub Pages

حتى يتم تبديل DNS، النطاق قد يبقى على **GitHub Pages** كاحتياطي:

| Type  | Name | Content              | Proxy |
| ----- | ---- | -------------------- | ----- |
| CNAME | `@`  | `meklads.github.io`  | Proxied |
| CNAME | `www`| `meklads.github.io`  | Proxied |

- بعد كل `git push` إلى `main` انتظر دقيقة ثم Hard Refresh على المضيف النشط

التحقق: في مصدر الصفحة ابحث عن أحدث `?v=` (cache bust).

## ملاحظات

- `_redirects` و`functions/` يعملان على Cloudflare Pages فقط.
- على GitHub Pages صفحات `services/*` مضبوطة `noindex`.
- البديل اليدوي السابق: `bash scripts/setup-cloudflare-dns.sh` إن وُجد.
