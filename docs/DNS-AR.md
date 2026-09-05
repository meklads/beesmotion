# تفعيل beesmotion.com (مؤقت عبر GitHub Pages)

النسخة الأحدث منشورة على GitHub Pages.  
نشر **Cloudflare Pages** متعطّل حالياً من هذه الشبكة (`api.cloudflare.com` لا يستجيب)، لذلك الدومين يُوجَّه مؤقتاً إلى GitHub.

## 1) في Cloudflare Dashboard (دقيقتان)

1. افتح: [Cloudflare](https://dash.cloudflare.com) → **beesmotion.com** → **DNS** → **Records**.
2. عدّل السجلات التالية (أو أضفها إن لم تكن موجودة):

| Type  | Name | Target / Content       | Proxy |
| ----- | ---- | ---------------------- | ----- |
| CNAME | `@`  | `meklads.github.io`    | Proxied (برتقالي) |
| CNAME | `www`| `meklads.github.io`    | Proxied (برتقالي) |

3. احذف أو غيّر أي CNAME قديم يشير إلى `beesmotion.pages.dev`.
4. (SSL) **SSL/TLS** → **Full** (ليس Flexible).
5. انتظر 2–5 دقائق، ثم افتح: https://beesmotion.com/ مع Hard Refresh.

### اختياري: `ai`

| Type  | Name | Target              | Proxy |
| ----- | ---- | ------------------- | ----- |
| CNAME | `ai` | `meklads.github.io` | Proxied |

## 2) التحقق

- يجب أن يظهر في المصدر: `styles.css?v=20260905footer`
- رابط GitHub المباشر: https://meklads.github.io/beesmotion/

## 3) من الطرفية (إن وصل الـ API)

```bash
cd website
export CLOUDFLARE_API_TOKEN="YOUR_TOKEN"   # Zone → DNS → Edit
bash scripts/setup-github-pages-dns.sh
```

## العودة لاحقاً إلى Cloudflare Pages

عندما يعمل `npm run deploy` مرة أخرى:

| Type  | Name | Target                 | Proxy |
| ----- | ---- | ---------------------- | ----- |
| CNAME | `@`  | `beesmotion.pages.dev` | Proxied |
| CNAME | `www`| `beesmotion.pages.dev` | Proxied |

أو: `bash scripts/setup-cloudflare-dns.sh`
