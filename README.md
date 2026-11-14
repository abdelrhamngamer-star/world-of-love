# A World of Love — عالم صغير من الحب
Next.js 15 (App Router) + TypeScript + Tailwind 4 + Framer Motion.

## Run
    npm install && npm run dev      # http://localhost:3000
    npm run build

## Deploy (Vercel)
Import the repo, add env var `NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app`, deploy.
Verify: `curl -s https://your-domain.vercel.app | grep -i 'og:'` and open `/og-cover.png`.

## Edit content (no component edits)
- `content/site-config.ts` — title, description, URL, music path, OG image path
- `content/content.ts` — intro, four roles, reasons (append to the array), letter, surprises, ending
- `app/globals.css` — theme colors (`@theme`)

## Music / recordings
Put an mp3 at `public/audio/ambient.mp3` (or change `site.audio`). Missing file = the music button is disabled, nothing breaks.
Letter recording: set `letter.audio` to e.g. `/audio/letter.mp3`; empty = player hidden.

## Social preview (WhatsApp)
Replace `public/og-cover.png` (1200×630) or rerun `python3 scripts/make-assets.py`. Metadata lives in `app/layout.tsx`.
If WhatsApp shows an old preview: add a query string to the link (`?v=2`) or re-share after a few hours — WhatsApp caches aggressively.

## Privacy
`noindex, nofollow` only asks search engines not to list the page. It is NOT password protection: anyone with the link can open it. Crawling is left allowed so WhatsApp can read the preview.

## Kiss button
Floating 💋 button (bottom-right): each tap sends kisses across the screen with a kiss sound (synthesized in the browser, no file needed).
To use your own sound, set `kissSound: "/audio/kiss.mp3"` in `content/site-config.ts`.
