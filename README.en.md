# Kurso — marketing site

[Français](README.md) · **English**

Single page for the [Kurso](https://github.com/Nitrozer/kurso-swift) beta.

The site **is** the mockup. `maquette/site-v3.dc.html` comes from the design editor;
`tools/build-page.mjs` turns it into a servable page without ever rewriting a
single inline style — that is what guarantees the rendering is the one that was
designed, not an interpretation of it. Re-run after each new version:

```bash
npm run page
```

The converter only touches what the design editor used to provide and the site
must provide some other way: `style-hover` states, event listeners, the two
conditional blocks, asset paths. The motion script (`src/logic.js`, 60 KB) is
taken **as is**.

No framework: static HTML, a 23 KB gzipped module, and three.js loaded
separately, only for the 3D mascot.

## Lighthouse

| Profile | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | **98** | **96** | **100** | **100** |
| Mobile | **75** | **96** | **100** | **100** |

FCP 0.4 s · LCP 1.1 s · TBT 40 ms · CLS 0 (desktop).

How it got there:

- **Nothing to hydrate** — the page ships as complete HTML, the script only
  animates it. Dropping React saved 70 KB gzipped.
- **Compressed 3D model** (meshopt) — 3.98 MB → 1.09 MB. The opening screen
  waits for it: this single change took the score from 47 to 98 and LCP from
  5.0 s to 1.1 s. Texture compression washed the materials out, so only the
  geometry is touched.
- **three.js in its own chunk**, loaded only when the scene starts.
- **No `supabase-js`** — one insert is a single `fetch` against the REST API.
  The library cost ~120 KB for one request.
- **Inline CSS**, self-hosted woff2, `font-display: swap`, and only the two
  above-the-fold faces are preloaded.
- **Gribou's fallback image is not downloaded** while WebGL works: a `src` on a
  `display:none` image is fetched anyway — 140 KB wasted on every visit.

### Two known points

- **Contrast**: ten labels in `#6C7590` and `#3B5BFF` sit at 4.2–4.35:1, below
  the 4.5:1 expected for small text. Those are the mockup's own colours;
  changing them means departing from it. Your call.
- **Mobile LCP**: the opening waits for the 3D model, with an 8 s cap written
  into the mockup. On a throttled connection that cap is what gets measured.
  Lowering it, or falling back to the image on slow links, is a design
  decision, not a fix.

## Getting started

```bash
npm install
cp .env.example .env    # then fill in the Supabase project
npm run dev
```

## Database

```bash
supabase db push        # applies supabase/migrations/0001_waitlist.sql
```

The migration is **already applied** on the `kurso` project. The table is empty.

The `waitlist` table is **insert-only** under RLS: the site's anon key can drop
an address in, never read the list back. That is deliberate — the key ships in
the browser, it is public by design.

> **Never put the `service_role` key in this project.** It ignores RLS.

A consequence of that choice: no `resolution=ignore-duplicates` header on the
client. It would generate an `ON CONFLICT`, which requires being able to read the
table back — which `anon` is not allowed to do. An address already on the list
therefore comes back as a `409`, treated as a success.

## What the build produces

`npm run build` writes `dist/`, servable as is (Vercel, Netlify, Pages):

```
dist/index.html                  the home page, complete HTML
dist/confidentialite/index.html  the GDPR page, without a line of JavaScript
```

No server needed.

## Still to do

- The `/confidentialite` page exists, but two statements are missing: the
  identity of the **data controller**, and where the database is hosted — the
  Supabase project sits in the **West EU (Paris)** region.
- Sending the launch message: Supabase stores, it does not send.
