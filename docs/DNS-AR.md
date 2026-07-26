# تفعيل beesmotion.com (خطوة واحدة في Cloudflare)

الموقع **جاهز** على: https://beesmotion.pages.dev  
النطاق **beesmotion.com** لا يعمل لأن **لا توجد سجلات DNS** في Cloudflare (النطاق موجود لكن فارغ).

## الحل (دقيقتان)

1. افتح: [Cloudflare Dashboard](https://dash.cloudflare.com) → اختر **beesmotion.com** → **DNS** → **Records**.
2. أضف **سجلين**:

| Type  | Name | Target / Content        | Proxy status |
| ----- | ---- | ----------------------- | ------------ |
| CNAME | `@`  | `beesmotion.pages.dev`  | Proxied (برتقالي) |
| CNAME | `www`| `beesmotion.pages.dev`  | Proxied (برتقالي) |

3. انتظر 2–5 دقائق، ثم افتح: https://beesmotion.com/

### من Pages (بديل)

**Workers & Pages** → **beesmotion** → **Custom domains** → بجانب `beesmotion.com` اضغط **Set up DNS** أو **Activate** إن ظهر — Cloudflare يضيف السجلات تلقائياً.

---

## رابط مؤقت

حتى يُفعَّل النطاق: https://meklads.github.io/beesmotion/

---

## من الطرفية (اختياري)

أنشئ [API Token](https://dash.cloudflare.com/profile/api-tokens) بصلاحية **Zone → DNS → Edit** لـ `beesmotion.com`، ثم:

```bash
cd website
export CLOUDFLARE_API_TOKEN="YOUR_TOKEN"
bash scripts/setup-cloudflare-dns.sh
```
