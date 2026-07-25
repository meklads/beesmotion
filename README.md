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

## Domain DNS

Point `beesmotion.com` to GitHub Pages:

- `A` records: GitHub Pages IPs (see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site))
- Or `CNAME` `www` → `<username>.github.io` if using project pages

Verify HTTPS in GitHub Pages settings after DNS propagates.

## Contact

WhatsApp: +966 50 278 6513
