# ryandsouza.org

Personal hub for two products:

1. **The Podcast** (`/podcast`) — long conversations. Links to YouTube + Spotify.
2. **The Blueprint** (`/blueprint`) — street interviews in Bengaluru. Links to Instagram reels.

Next.js 15 (app router, fully static), Tailwind v4. House style: ink `#0e0e0c`,
cream `#f3ede1`, terracotta `#d97757`, Instrument Serif + Geist — the same
system as the podcast thumbnails.

## Content

- `app/content.json` — **generated, do not hand-edit.** Produced by
  `~/Downloads/content_pipeline/sync_site_content.py`, which joins the content
  ledger with the Instagram publisher state and resolves reel permalinks.
  Re-run it after new street shorts publish, then commit this repo to deploy.
- `app/podcast.json` — hand-edited episode list, newest first.
- `app/links.ts` — all outbound platform links.

## Develop

```bash
npm install
npm run dev
```

Deployed on Vercel (project `nim` → www.ryandsouza.org).
