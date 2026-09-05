# Bees Motion Website

Official marketing site for **Bees Motion** — marketing and creative content for healthcare and real estate within Tasami Group.

## Stack

Static HTML, CSS, and JavaScript. Bilingual Arabic / English with client-side i18n.

## Local preview

```bash
cd website
python3 -m http.server 8080
# or: npm start
```

Open http://localhost:8080

## Hosting (current live)

**Production DNS** for [beesmotion.com](https://beesmotion.com/) currently points to **GitHub Pages** (`meklads.github.io`).

- Repo: [meklads/beesmotion](https://github.com/meklads/beesmotion)
- Push to `main` → GitHub Pages rebuild (usually 1–2 minutes)
- Custom domain file: `CNAME` → `beesmotion.com`

Cloudflare still proxies DNS (orange cloud). SSL should stay **Full**.

### Cloudflare Pages (optional / future)

The repo also supports Cloudflare Pages (`_redirects`, `functions/_middleware.js`, `npm run deploy`). Use that path when `api.cloudflare.com` is reachable and you want Pages Functions + `_redirects` behavior (service stub 301s, `ai.` host rewrite).

```bash
npm install
npx wrangler pages deploy . --project-name=beesmotion
```

Until then, treat **GitHub Pages as source of truth** for what visitors see.

### Coolify

`nixpacks.toml` + `npm start` (`serve`) work for Coolify previews. They do **not** update beesmotion.com unless DNS points at that host.

## DNS notes

See [docs/DNS-AR.md](docs/DNS-AR.md) for the live GitHub Pages CNAME targets and how to switch back to Cloudflare Pages later.

## Contact

WhatsApp: +966 50 278 6513
