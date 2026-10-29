# Bees Motion Website

Official marketing site for **Bees Motion** — digital marketing and creative production within Tasami Group, with proven depth in healthcare and real estate.

## Stack

Static HTML, CSS, and JavaScript. Bilingual Arabic / English with client-side i18n.

## Local preview

```bash
cd website
python3 -m http.server 8080
# or: npm start
```

Open http://localhost:8080

## Analytics (GA4)

1. Open `assets/js/site-config.js`
2. Set `ga4MeasurementId` to your Measurement ID (`G-XXXXXXXX`)
3. Push to `main`

Optional booking calendar: set `bookingUrl` in `site-config.js` (Calendly etc.). Until set, `[data-booking-cta]` links go to `/book/`, and the book form opens WhatsApp via `whatsapp`.

Events already wired when GA4 is set:
- page views
- `generate_lead` / `cta_form_whatsapp` (homepage form)
- `cta_book_whatsapp` (discovery book form)
- `click_whatsapp` / `click_whatsapp_float`
- `data-track` CTA clicks

## Hosting

**Production** is **Cloudflare Pages** (project `beesmotion`: `_redirects`, `functions/_middleware.js`, `_headers`).

Custom domain CNAMEs for `@`, `www`, and `ai` point at `beesmotion.pages.dev` (proxied). See [docs/DNS-AR.md](docs/DNS-AR.md).

```bash
npm install
npm run deploy
# optional link check: npm run check:links
```

GitHub Pages may still rebuild from `main` as a backup copy; live visitors follow Cloudflare Pages via DNS.

Optional booking calendar: set `bookingUrl` in `site-config.js` (Calendly etc.). Until set, `[data-booking-cta]` links go to `/book/`, and the book form opens WhatsApp via `whatsapp`.

### Coolify

`nixpacks.toml` + `npm start` (`serve`) work for Coolify previews. They do **not** update beesmotion.com unless DNS points at that host.

## DNS notes

See [docs/DNS-AR.md](docs/DNS-AR.md) for live CNAME targets, GitHub Pages fallback, and how to switch to Cloudflare Pages with `scripts/switch-dns-to-pages.sh`.

## Contact

WhatsApp: +966 50 278 6513

## Temporary preview gate

`functions/_middleware.js` locks the whole site behind an access code while `GATE_ENABLED = true`.
To open the site: set `GATE_ENABLED = false` and deploy (or set Pages variable `GATE_OFF=1` and redeploy).

## Real estate assessment form (`/propmotion/#assessment`)

The form posts to `functions/api/lead.js`. Configure delivery in Cloudflare Pages → Settings → Variables and Secrets (Production), then redeploy:

- Email via Resend: `RESEND_API_KEY` (secret), `LEAD_FROM_EMAIL` (verified sender), `LEAD_TO_EMAIL` (comma-separated)
- and/or webhook: `LEAD_WEBHOOK_URL` (Google Apps Script, Zapier, Make, CRM)

Until one is configured the endpoint returns 503 and the page offers WhatsApp instead. Content lives in `assets/js/translations-re.js` (EN/AR) and `assets/css/re-journey.css`.
