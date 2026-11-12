# Katie & Philip — wedding website

A static site built with [Astro](https://astro.build), hosted on GitHub Pages.

## Run it locally

You need [Node.js](https://nodejs.org) 22.23 or newer. One time:

```bash
npm install
```

Then, every time:

```bash
npm run dev
```

Open the address it prints (http://localhost:4321/mcpeek-wedding/ until the custom domain is set).

## Where to edit things

| To change… | Edit this file |
|---|---|
| Any words, dates, events, hotels, FAQs, links, email | `src/content/site.ts` |
| Colors and fonts | `src/styles/tokens.css` |
| Our Story photos | put files in `src/assets/photos/` and type the file name in `site.ts`, e.g. `photo: "how-we-met.jpg"` (resized automatically) |

Anything in `[square brackets]` is a placeholder.

**Fonts:** headings use Natique, which has no numbers. Numbers automatically
show in Libre Baskerville, but keep digits out of headings where you can.

## Project layout

```
src/content/site.ts     all site copy
src/styles/tokens.css   all colors and fonts
src/styles/global.css   shared layout and card styles
src/pages/              one file per page
src/components/         nav, footer, page title
src/layouts/            the shared page shell
src/assets/fonts/       self-hosted font files
src/assets/photos/      Our Story and gallery photos
public/                 files served as-is (favicon, seal image)
```

## Publishing

Every push to `main` builds and deploys automatically (`.github/workflows/deploy.yml`).
One-time setup in GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Custom domain (once you're ready)

1. Put the domain in `domain:` in `src/content/site.ts`, e.g. `"katieandphilip.com"`.
2. In GitHub: **Settings → Pages → Custom domain**, enter the domain, then tick **Enforce HTTPS** once it's available.
3. At your domain registrar, add DNS records:
   - Apex (`katieandphilip.com`): four `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www`: a `CNAME` record to `iheartvolume.github.io`

See [SECRETS.md](SECRETS.md) for how private data and keys are handled.
