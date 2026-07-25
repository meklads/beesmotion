# Bees Motion Website

Official marketing site for **Bees Motion** — the digital marketing arm of [Graphics House](https://3dgraphicshouse.com/).

## Stack

Static HTML, CSS, and JavaScript. Bilingual Arabic / English with client-side i18n. Deployed via GitHub Pages.

## Local preview

```bash
cd website
python3 -m http.server 8080
```

Open http://localhost:8080

## GitHub Pages

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment**: deploy from branch `main`, folder `/` (root) or move `website/` contents to repo root.
3. Custom domain: `beesmotion.com` (CNAME file included).

## Domain DNS (Cloudflare)

The domain must resolve to GitHub Pages. As of the last check, `beesmotion.com` was on Cloudflare nameservers but had **no `A` / `AAAA` / `CNAME` records**, so the site could not load. GitHub still redirects `https://meklads.github.io/beesmotion/` → `http://beesmotion.com/`, which fails until DNS is fixed.

In **Cloudflare → DNS → Records** add:

| Type  | Name | Content            | Proxy |
| ----- | ---- | ------------------ | ----- |
| `A`   | `@`  | `185.199.108.153`  | DNS only (grey cloud) recommended until HTTPS cert is issued |
| `A`   | `@`  | `185.199.109.153`  | same  |
| `A`   | `@`  | `185.199.110.153`  | same  |
| `A`   | `@`  | `185.199.111.153`  | same  |
| `CNAME` | `www` | `meklads.github.io` | optional |

Then in **GitHub → repo → Settings → Pages → Custom domain**, enter `beesmotion.com`, wait for DNS check, and enable **Enforce HTTPS** when the certificate appears.

Note: `https://beesmotion.com/` and `https://beesmotion.com/#hero` are the **same page**; `#hero` only scrolls to a section and is not sent to the server. If `/` fails but `#hero` seems to work, it is usually cached content or an in-page link without a full reload—not a separate URL fix.

## Contact

WhatsApp: +966 50 278 6513
