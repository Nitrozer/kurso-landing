# Kurso — the landing site

[Français](README.md) · **English**

A single page for the [Kurso](https://github.com/Nitrozer/kurso-swift) beta.
React 19, TypeScript, Vite. The page is **pre-rendered at build time**: the
visitor gets HTML that is already painted, and React only brings the two forms
to life.

## Lighthouse

| Profile | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | **100** | **100** | **100** | **100** |
| Mobile | **97** | **100** | **100** | **100** |

FCP 0.4 s · LCP 0.5 s · TBT 0 ms · CLS 0 (desktop).

What it took to get there:

- **Static pre-render** — `react-dom/server` at build time, hydration after.
- **No `supabase-js`** — one insert is one `fetch` against the REST API. The
  library cost ~120 KB for a single request.
- **Inline CSS** — 2 KB compressed; the round trip was blocking ~700 ms.
- **Self-hosted fonts** in woff2 subset to the Latin range, `font-display: swap`,
  and only the two above the fold are preloaded.
- **AVIF and WebP images** with a PNG fallback, `width`/`height` always declared
  (CLS at 0), the hero image preloaded, everything else `loading="lazy"`.
  The hero's Gribou drops from 426 KB to 6 KB.

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
dist/index.html                  the home page, pre-rendered
dist/confidentialite/index.html  the GDPR page, without a line of JavaScript
```

No server needed.

## Still to do

- The `/confidentialite` page exists, but two statements are missing: the
  identity of the **data controller**, and where the database is hosted — the
  Supabase project sits in the **West EU (Paris)** region.
- Sending the launch message: Supabase stores, it does not send.
