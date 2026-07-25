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

## Hosting (Cloudflare Pages)

The live site is deployed to **Cloudflare Pages** (same Cloudflare account as Graphics House):

- Preview: [beesmotion.pages.dev](https://beesmotion.pages.dev/)
- Production: [beesmotion.com](https://beesmotion.com/) (after DNS below)

Pushes to `main` deploy via `.github/workflows/deploy-cloudflare-pages.yml` once these GitHub repo secrets exist:

- `CLOUDFLARE_API_TOKEN` — API token with **Account → Cloudflare Pages → Edit**
- `CLOUDFLARE_ACCOUNT_ID` — `a617b0adb762f271f09e8e2e5b97f529`

Manual deploy from this folder:

```bash
npm install
npx wrangler pages deploy . --project-name=beesmotion
```

## Domain DNS (required once)

The zone `beesmotion.com` is on Cloudflare but had **no DNS records**. Custom domain on Pages is attached; you must add:

| Type   | Name | Content               | Proxy   |
| ------ | ---- | --------------------- | ------- |
| CNAME  | `@`  | `beesmotion.pages.dev` | Proxied |
| CNAME  | `www` | `beesmotion.pages.dev` | Proxied |

In the dashboard: **Cloudflare → beesmotion.com → DNS → Add record**.

Or run locally (after `npx wrangler login` with DNS permission, or use an API token with **Zone → DNS → Edit**):

```bash
./scripts/setup-cloudflare-dns.sh
```

GitHub Pages is no longer used for this domain (removed `CNAME` file to avoid deploy timeouts). Use Cloudflare Pages only.

## Contact

WhatsApp: +966 50 278 6513
