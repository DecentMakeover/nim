# Design

Direction ratified 2026-08-19 against the reference the user chose:
https://thinkingmachines.ai/ — paper-white, essay-first, typographic, almost no
chrome. The earlier ink-dark thumbnail-styled version was rejected.

## Theme

Warm paper, ink text. The page reads like a well-set document, not a landing
page. No dark mode.

- Paper: `#f9f7f2`
- Ink: `#211f1a`
- Gray (secondary text, wordmark): `#807b71`
- Hairline: `rgba(33, 31, 26, 0.14)`
- Terracotta `#d97757` survives only as the link hover color and tiny accents.
  Grayscale otherwise.

## Typography

- Body: **Source Serif 4** (400 + italic), 17-19px, line-height ~1.75,
  measure ~65ch. The homepage is prose; paragraphs may open with an
  *italic lead-in.*
- Headings: **Geist** 500, modest sizes (~24-28px). Not display type.
- Wordmark: centered, letterspaced uppercase Geist in gray, two lines
  (RYAN / D'SOUZA) on the home hero; small inline version in the header.
- Links: ink text with a gray underline, terracotta on hover. Inline in
  prose, like a document, not buttons.

## Layout

- Single centered column, max-width ~42rem, generous vertical space.
- Top-right quiet sans nav. Small "NEW" pill under the hero wordmark for the
  latest episode.
- Content is lists of text rows separated by hairlines, not cards or tiles.
- /podcast may carry small hairline-bordered episode thumbnails; everything
  else is type.

## Long lists

/podcast and /blueprint keep their hero (guest tape, question deck), then a short
intro, then the complete list: text filters with counts, a search field and
"Show more". Filters are underlined text, not pills. The list is generated; see
`scripts/site_sync/README.md`.

## Motion

Only the wordmark sheen, the guest tape and the question deck, all off under
reduced motion. Otherwise color transitions on link hover only.
