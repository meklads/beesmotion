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

**Intended production** is **Cloudflare Pages** (project `beesmotion`, `_redirects`, `functions/_middleware.js`).

**Current live DNS** for [beesmotion.com](https://beesmotion.com/) may still point at **GitHub Pages** (`meklads.github.io`) as a **fallback until DNS is switched**.

- Repo: [meklads/beesmotion](https://github.com/meklads/beesmotion)
- Push to `main` → rebuild on the active host
- Custom domain file: `CNAME` → `beesmotion.com`

Cloudflare still proxies DNS (orange cloud). SSL should stay **Full**.

### Switch DNS to Cloudflare Pages

When ready to make Pages the live origin:

```bash
bash scripts/switch-dns-to-pages.sh
```

Requires `CLOUDFLARE_API_TOKEN` (Zone DNS Edit) or Wrangler OAuth. Points `@`, `www`, and `ai` CNAMEs at `beesmotion.pages.dev`.

Deploy Pages:

```bash
npm install
npx wrangler pages deploy . --project-name=beesmotion
```

Until DNS is switched, treat the **active DNS target** (often GitHub Pages) as what visitors see; keep Pages deploys in sync for cutover.

### Coolify

`nixpacks.toml` + `npm start` (`serve`) work for Coolify previews. They do **not** update beesmotion.com unless DNS points at that host.

## DNS notes

See [docs/DNS-AR.md](docs/DNS-AR.md) for live CNAME targets, GitHub Pages fallback, and how to switch to Cloudflare Pages with `scripts/switch-dns-to-pages.sh`.

## Contact

WhatsApp: +966 50 278 6513
