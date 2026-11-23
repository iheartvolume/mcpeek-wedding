# CLAUDE.md: Katie & Philip wedding website

Context for a fresh session. Items marked **⚠ Unsure** are things this project never confirmed. Ask before acting on them.

## 1. What this is

- A custom wedding website for **Katie and Philip**. The repo is named `mcpeek-wedding`, and the monogram is "M".
- **Wedding:** Saturday, **October 30, 2027**. The ceremony is at **Trinity Lutheran Church, 3637 Golf Rd, Evanston, IL 60203**. The reception venue is **not decided yet** and is still a placeholder.
- **Audience:** about 150 guests, many of them older and on older phones. Pages are designed for phone width first.
- **Who edits it:**
  - Katie, the owner, is technical enough to edit the content file and the stylesheet. She is not a developer.
  - Philip ("Phil") is taking over, so see section 7.
- **Goals:** warm, cozy, and upscale ("candlelit dinner party, not craft fair"). It should match the save the dates, with a few memorable interactive touches.
- **Live site:** https://iheartvolume.github.io/mcpeek-wedding/. The custom domain, **mcpeek.wedding**, is not connected yet; see section 7.

## 2. Project structure

```
src/content/site.ts      ALL copy, dates, events, hotels, FAQs, links, photo lists (edit here)
src/content/types.ts     TypeScript shape of site.ts
src/styles/tokens.css    ALL colors and fonts as CSS variables (edit here)
src/styles/global.css    shared layout, the peach .card, buttons, reduced-motion rules
src/layouts/BaseLayout.astro   page shell; has a named slot "before" (top of <body>)
src/pages/*.astro        one file per page: index, our-story, schedule, travel,
                         registry, faqs, rsvp, 404
src/components/          Nav, Footer, PageTitle, Announcement, Intro (envelope),
                         LeafCanvas + LeafBed (leaves), CandleGlow, StoryPhoto
src/scripts/leaves.ts    leaf physics and pile engine (plain canvas)
src/scripts/leaf-sprites.ts   leaf shapes drawn in code; optional PNG sprites
src/lib/helpers.ts       href() (adds the base path), date formatting, isPlaceholder()
src/lib/dates.ts         dependency-free date helpers, safe to use in browser scripts
src/assets/fonts/        self-hosted WOFF2 fonts (Natique has been subset, see below)
src/assets/photos/       Our Story photos (optimized at build time)
public/images/seal.webp  wax seal image used in the intro
public/favicon.svg
scripts/convert-natique.py   rebuilds the Natique WOFF2 from the original TTF
.github/workflows/deploy.yml build and deploy to GitHub Pages on push to main
README.md, SECRETS.md    owner-facing instructions; where secrets will live
```

- **Pages and content:** each page imports `site` from `src/content/site.ts` and renders it. Components never hold their own copy, colors, or fonts.
- **Internal links:** always build them with `href("/path/")` from `src/lib/helpers.ts`, because the site is served under `/mcpeek-wedding/` until the domain is set.
- **The home page (`index.astro`)** puts these into the `before` slot of BaseLayout: `Intro`, then `LeafCanvas`. In the page body it has the `Announcement`, the hero card, and `LeafBed`.
- **Our Story photos:** set by file name in `site.ts`. `StoryPhoto` finds the file anywhere under `src/assets/photos/` by matching only the file name, so subfolders are fine. Astro generates resized WebP versions with srcset. A missing file shows a placeholder labeled `[Photo: name]` and prints a build warning.

## 3. Stack, running, deploying

- **Framework:** Astro 7.4.7 with TypeScript (strict), producing a fully static build. The only runtime dependency is `astro`; there are no UI or animation libraries.
- **Node:** version 22.23.4 or newer, which Astro 7 requires. CI uses Node 22.
- **Image optimization:** `sharp` handles it and comes in as a dependency of Astro.
- **Run locally:**
  - `npm install` once, then `npm run dev`.
  - Open `http://localhost:4321/mcpeek-wedding/`. Note the base path.
- **Build:** `npm run build`, which runs `astro check` and then `astro build` into `dist/`. It should report 0 errors and 0 warnings.
- **Preview the build:** `npx astro preview`.
- **Deploy:** every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. Nothing else is needed.
- **Base path:** `astro.config.ts` reads `domain` from `site.ts`. When it is empty, the base is `/mcpeek-wedding` on `iheartvolume.github.io`. When it is set, the base becomes `/` on that domain.
- **Locked Phase 2 backend (approved, nothing built yet):**
  - **Supabase:** Postgres with row level security plus Edge Functions. Guest data must never be readable without a valid invite code.
  - **Resend** for emails.
  - **A scheduled GitHub Action** to ping Supabase so the free project doesn't pause after a week of inactivity. The owner approved this approach.
  - **Cost:** $0/month.
- **GitHub Pages setup (already done):**
  - The repo was made **public**, because Pages on a private repo needs a paid plan.
  - Pages source is set to "GitHub Actions".
  - `main` is the default branch.
  - The `github-pages` environment has a deployment-branch rule allowing `main`. The first deploys failed until this rule was added, because the rule originally named only the old default branch.
  - If a deploy ever fails with "not allowed to deploy to github-pages", check **Settings → Environments → github-pages** and make sure `main` is listed under deployment branches. Any leftover rule naming an old branch does no harm.

## 4. Decisions and why (including what was ruled out)

**Process**
- Work follows the original brief's build order:
  - Step 0: stack proposal (done)
  - Step 1: foundation (done)
  - Step 2: home page signature moments (done)
  - Step 3: one page at a time, chosen by the owner
  - Step 4: database schema and seed data
  - Phase 2: invite codes and RSVP. Do not start until the owner asks; it is planned for roughly spring to summer 2027.
- The owner said "Phase 2" once when they meant **Step 2**. Confirm which one is meant if it comes up again.

**Fonts**
- **Natique free** has **placeholder bars instead of digits 0–9 and about 60 accented letters**.
  - `scripts/convert-natique.py` strips those glyphs and subsets the font.
  - The `@font-face` `unicode-range` also excludes digits, so any number falls back to Libre Baskerville automatically.
- **Libre Baskerville** is self-hosted from the Fontsource files and is under the OFL license.
- Fonts live in `src/assets/fonts/`, not `public/`, so Vite fingerprints them and the base path resolves correctly.
- **Natique license:** the font file's metadata says "FOR PERSONAL USE ONLY". The owner confirmed the license allows web use. Because the repo is public, anyone could download the WOFF2 from it.
- The original TTF stays out of git: `fonts-source/` is gitignored.

**Opening animation (`Intro.astro`)**
- **What it does now:**
  - A navy paper envelope; the wax seal cracks **horizontally**.
  - The top flap folds up and the bottom flap folds down, revealing the home page.
  - It plays once per browser session, tracked in sessionStorage with a try/catch around it.
  - Skip and Escape both work.
  - It is skipped entirely with reduced motion.
  - An inline script decides before first paint whether to play, and a 5-second failsafe shows the page if the script never loads.
- **Ruled out:**
  - The first version, a transparent overlay with a vertical seal crack and the names fading in. The owner asked for the horizontal split and the envelope.
  - Rotating the flaps past 90° (tried 172°, 180°, and 100°). The 3D perspective made them leave the frame too fast, and back faces showed as light bands in Chromium.
- **Current settings:** the flaps stop at **90°** (edge-on) and have no back faces. Perspective is 3200px on phones and 4500px from 40rem up.
- **Layout choice:** the flaps meet at the seal in the middle of the screen, like a gatefold, rather than folding in literal thirds. The owner's request mentioned thirds, but the owner has **confirmed the current version is final**. Don't revisit the tri-fold idea unless asked.

**Falling leaves (`leaves.ts`, `LeafBed.astro`)**
- **What they do now:**
  - Leaves fall **continuously** on the home page.
  - They build **one full-width pile** that starts empty and grows as leaves land.
  - Pressing a clump or a single leaf kicks it up, and kicked leaves **stay where they land**.
- **Ruled out:**
  - The first version: three pre-seeded piles, a limited "season" of falling leaves, and kicked leaves that flew back into place. The owner said the piles looked like separate hollow domes.
- **How the pile works:**
  - A height map with 4px columns; each landing leaf rolls into a nearby dip and adds a soft bump.
  - Settled leaves are drawn once into cached canvas layers, so only moving leaves are redrawn each frame.
  - Older buried leaves are "baked" into pixels so the number of kickable leaves stays capped, which avoids holes.
- **Placement:** the canvas is a fixed layer **behind** the page content, at z-index 0 in the body's `before` slot, so leaves never cover text.
  - An early bug had the canvas inside `<main>`, which painted it over the cards.
- **Kicking:** the leaf bed is a single full-width `<button>` (it has a label for screen readers, and Enter or Space kicks a random spot).
- **Reduced motion:** a finished static pile is drawn, with no falling and the button disabled.
- **Scope:** leaves appear on the home page only, to keep the other pages light.
- **Not persisted:** the pile resets on every home page load. Nobody asked for persistence.

**Other home page features**
- **Candle glow cursor:** a soft gold radial light that follows a desktop mouse only. It is off for touch devices and reduced motion.
- **Announcement banner:** driven by `site.announcement`, and hidden when that is empty.
- **Countdown:** the number of days is set at build time and refreshed in the browser using Chicago time.

**Our Story**
- **Layout:** a single-column timeline with a gold rail on the left.
  - **Ruled out:** a two-column timeline alternating sides, which was too cramped for long copy with many photos.
- **Gallery:** the separate "Moments" gallery was **dropped**, because all photos now sit inside the story sections.
- **No tap-to-enlarge lightbox:** the owner said no.
- **No cropping:**
  - Multi-photo rows use a 2-column grid. CSS `columns` was **ruled out** because it broke the left-to-right reading order.
  - Single photos are capped at 26rem wide and the header photo at 28rem, because tall portrait photos were overwhelming on desktop.
- **Ending:** the timeline ends with a finale card for the wedding day. Its date comes from `site.weddingDate`, and the owner requested it.
- **Scroll fade-in:** uses IntersectionObserver, with an inline pre-paint class and a failsafe. Everything is visible with reduced motion or without JavaScript.

**General**
- No analytics or tracking.
- Respect `prefers-reduced-motion` everywhere.
- There is **no Wedding Party page and no separate Gallery page**, by design in the brief.

## 5. Conventions

**Working rules (from the brief, still in force)**
- Build only the current step, then stop and summarize what changed, anything the owner needs to do, and anything noticed but not built.
- Don't add features, pages, or dependencies that aren't in the brief. List ideas instead of building them.
- Ask only when genuinely blocked. Otherwise pick a sensible default and say so in one line.
- **Placeholders must look like placeholders:** put them in `[square brackets]`. `isPlaceholder()` treats `""` or anything starting with `[` as a placeholder.
- **Never hardcode** colors or fonts in components; use `tokens.css`. Never hardcode copy; use `site.ts`.
  - Known exceptions: `public/favicon.svg` has hardcoded hex colors because it's a standalone asset. The seal is an image.
- **Repo safety:** the repo is public. Never commit real guest names, addresses, emails, invite codes, or keys. Only fictional seed households may live in the repo; see `SECRETS.md`.
- **Publishing:** the owner says "publish", and then `main` is fast-forwarded from the working branch, which triggers the deploy. Don't push to `main` without that go-ahead, and confirm the deploy run succeeded.

**Design**
- **Palette** (from `tokens.css`):
  - terracotta `#bf704d` (frames)
  - peach `#ffbea1` (cards)
  - maroon `#5c1313` (page background)
  - text on peach `#622e2a`
  - cream `#f4e7d3` (text on maroon)
  - gold `#c9a45c` (used sparingly)
  - deep maroon `#3d0b0b`
  - navy `#283358` and deep navy `#161d38` (envelope)
  - leaf colors `--leaf-1` through `--leaf-5`
- **Owner review:** the brief flagged cream and gold for owner review. The owner picked the navy direction (more saturated than `#343A4E`).
- **Layout:**
  - Long text always sits on a peach `.card` with a thin terracotta frame and an inner hairline, never directly on maroon.
  - The maroon background has a fixed vignette.
  - The paper grain is a low-opacity inline SVG noise.
- **Type:**
  - Natique script is for **headings and words only**.
  - Every numeral, date, and time is set in Libre Baskerville. Keep digits out of script titles.
  - Small-caps labels use the `.label` class.
- **Motion:** gentle fades and easing only, with no bouncing or flashing. Tap targets are at least 48px. Focus outlines are visible (gold on maroon, dark on peach).
- **Contrast:** checked to pass WCAG AA for text on peach (6.8:1), cream on maroon (11:1), and gold on maroon (5.7:1).

**Copy tone**
- Warm, first-person "we", low-key, with gentle humor (from Katie's Our Story copy).
- Use curly quotes and apostrophes (“ ” ’) in `site.ts`.

**Naming**
- Our Story photos are named `NN-section-description.jpg` in page order. Extra photos use letter suffixes, for example `01a-…` and `05a-…`.
- Schedule event `id`s, such as `ceremony`, must stay stable, because Phase 2 will use them.

**Commits:** short imperative subject lines with a body that explains the change.

## 6. Unfinished, open questions, known issues

- **Step 3, pages still to polish:** Schedule (including "happening now" in Chicago time), Travel (map embed and listings), FAQs, Registry, and the RSVP placeholder. Do one page at a time, as the owner directs.
- **Step 4 not started:**
  - The data model (households, guests, events, invitations, rsvps) in Supabase.
  - Two fictional seed households: one with a plus-one, one with a child.
  - The demo welcome stub: a URL demo code that shows "Welcome, [household]" and only that household's events.
- **Phase 2 not started:** invite codes, RSVP per person per event, meals and dietary needs, song requests, address confirmation, an admin dashboard with CSV export, emails and reminders, and .ics calendar files. The Supabase keep-alive Action is not built yet either.
- **Content still placeholder in `site.ts`:**
  - Reception venue and address, and the contact email
  - All event times, venues, dress codes, and notes
  - Rehearsal dinner and brunch dates
  - Hotels, Getting There notes, and Eat & Explore listings
  - `mapEmbedUrl` and `registry.url`
  - Most FAQ answers (the weather answer is real) and the RSVP message
- **Waiting on the owner:** optional watercolor leaf sprite PNGs. The owner said they will come back to these; they would go in `leaves.spriteImages`.
- **Domain:** not connected yet; see section 7.
- **Testing gap:** everything was checked only in headless Chromium at 390px and 1280px wide. **It has not been verified on real iOS or Android devices or in Safari.** The 3D envelope fold is the riskiest part.
- **CI notices (harmless for now):** `actions/deploy-pages@v4` targets the deprecated Node 20, and `ubuntu-latest` is migrating to Ubuntu 26.
- **Photos from chat:** photos sent in chat arrive renamed (for example `3.jpg`), so match them by content. Images attached in a message sent **while a turn is running** were not saved to disk, so ask for them to be resent.

## 7. Handoff notes for Phil

- **Repo:** https://github.com/iheartvolume/mcpeek-wedding is public, on **Katie's GitHub account** (`iheartvolume`).
  - For Phil to push or change settings, Katie adds his GitHub account under **Settings → Collaborators**.
- **Making changes:** edit `src/content/site.ts` for words and `src/styles/tokens.css` for colors and fonts. Push or merge to `main` and the site rebuilds in about a minute; check the **Actions** tab.
- **Replacing Our Story photos:** upload a file with the **same name** into `src/assets/photos/` (on GitHub: **Add file → Upload files**). That keeps the exact file name and full quality.
- **Domain status:**
  - The domain is **mcpeek.wedding**. Katie owns it, but it is **not set up yet**: no DNS records, nothing under Settings → Pages, and `domain` in `site.ts` is still `""`.
  - Early on, Katie mentioned verifying a domain in GitHub. Verifying alone doesn't connect it.
  - **Don't fill in `domain` until DNS is pointed at GitHub.** Setting it switches every link to the bare domain, which would break the github.io address in the meantime.
  - **Registrar:** Katie believes it's **Cloudflare**. Confirm when logging in.
- **To connect the domain (in this order):**
  1. In Cloudflare (**DNS → Records**), add four `A` records on `mcpeek.wedding`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Add a `CNAME` for `www.mcpeek.wedding` pointing to `iheartvolume.github.io`. Set every record's proxy status to **DNS only** (grey cloud). Cloudflare's proxy (orange cloud) can stop GitHub from issuing the HTTPS certificate.
  2. In GitHub, enter `mcpeek.wedding` under **Settings → Pages → Custom domain**. Tick **Enforce HTTPS** once it's offered, which can take up to a day.
  3. Put `mcpeek.wedding` in `domain:` in `src/content/site.ts` and push to `main`. This switches the base path from `/mcpeek-wedding` to `/`.
  - Because the site deploys through Actions, no `CNAME` file is needed in the repo.
- **Secrets:** none exist yet. Phase 2 keys go in GitHub or Supabase secrets, never in the repo; see `SECRETS.md`.
