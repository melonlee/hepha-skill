# Hepha website

A standalone static landing page for Hepha. Plain HTML, CSS and a small vanilla JS file: no build step, no external CDNs, fonts or trackers. All URLs are relative, so the folder works at a domain root or under any base path (for example `https://<user>.github.io/hepha-skill/`).

```text
website/
├── index.html          # English (primary)
├── zh/index.html       # 简体中文
└── assets/
    ├── site.css · site.js
    ├── favicon.svg · apple-touch-icon.png · hepha-logo-dark.svg · hepha-mark-dark.svg
    ├── hepha-social-preview.png      # Open Graph / Twitter image (1280×640)
    └── review-*.webp                 # review UI screenshots, re-encoded from docs/assets/screenshots
```

This folder is not part of the npm package (`files` in `package.json` only lists `skills/`, `rules/` and `CHANGELOG.md`).

## Local preview

Serve the folder over HTTP. Opening `index.html` as a file mostly works too, but the language switch links to folders (`zh/`, `../`), which only resolve to `index.html` on a web server.

```bash
cd website
python3 -m http.server 8080        # or: npx serve .
# open http://localhost:8080 and http://localhost:8080/zh/
```

## Deploy

Every host below just needs to publish the `website/` directory as-is. No build command.

| Host | Settings |
|---|---|
| **Vercel** | New Project → import the repo → *Root Directory* `website`, *Framework Preset* `Other`, leave the build command empty. CLI: `cd website && npx vercel --prod` |
| **Netlify** | Add new site → import the repo → leave *Base directory* and *Build command* empty, set *Publish directory* to `website`. CLI: `npx netlify deploy --dir website --prod` |
| **Cloudflare Pages** | Create → Pages → connect the repo → *Framework preset* `None`, *Build command* empty, *Build output directory* `website`. CLI: `npx wrangler pages deploy website` |
| **GitHub Pages** | Pages can only serve `/` or `/docs` from a branch, so publish `website/` with a workflow: use `actions/upload-pages-artifact` with `path: website`, then `actions/deploy-pages`, and set *Settings → Pages → Source* to *GitHub Actions*. The site then lives at `https://<user>.github.io/hepha-skill/`, which works because all paths are relative. |

### Custom domain

Up to the owner. Add the domain in the host's dashboard and point DNS at it as that host instructs (for GitHub Pages, also set it under *Settings → Pages*).

Once the final URL is known, make the social metadata absolute in both `index.html` and `zh/index.html`, because most link-preview crawlers ignore relative URLs:

- `og:image` and `twitter:image` → `https://<domain>/assets/hepha-social-preview.png`
- add `<meta property="og:url" content="https://<domain>/">` (and `/zh/` on the Chinese page)
- add `<link rel="canonical" href="…">` and make the `hreflang` alternates absolute

## Editing

- Content must stay factual: every claim on the page is taken from the repository's READMEs, `CHANGELOG.md`, `examples/` and the CLI source. Update both languages together.
- Colours follow the brand tokens in `docs/assets/brand/src/brand.css`.
- The hero animation and tabs are progressive enhancements in `assets/site.js`. Without JavaScript, or with `prefers-reduced-motion: reduce`, the page shows the final, static state.
- To refresh the screenshots, replace the PNGs in `docs/assets/screenshots/` and re-encode them to WebP at 1600 px wide into `assets/`.
