# Gold Group Website - Agent Instructions

## Scope and safety

- This repository is `3mmaruto/gold-website`.
- The active development branch is `redesign/static-frontend-upgrade` until the user explicitly changes it.
- `main` is the deployed production branch. Do not merge into, force-update, push to, or delete `main` without explicit user approval.
- The new application root is `frontend-v2/`.
- The legacy root HTML/CSS/JS site was removed during the approved production migration. Use Git history only if an old URL or claim must be audited; do not restore its template or people imagery.
- The sibling directory `../gold/` contains raw company material. Treat it as read-only unless the user explicitly requests a deliverable there.
- Never commit raw quotations, customer files, internal spreadsheets, CAD files, or large source PDFs from `../gold/`.

## Required context

Read these files before changing v2:

- `docs/PROJECT_CONTEXT.md`
- `docs/WEBSITE_V2_BRIEF.md`
- `docs/SEO_I18N_ARCHITECTURE.md`
- `docs/CODEX_HANDOFF.md`
- `docs/content/site-content.en.json`
- `docs/content/site-content.ar.json`

## Product and brand sources

Use sources in this order:

1. Verified product sheets and catalog pages in `../gold/`.
2. The approved content files under `docs/content/`.
3. Existing legacy site content only when it does not conflict with the first two sources.

Do not invent performance figures, warranties, certifications, partner claims, or component brands. When a specification applies only to the 80 C R290 line, label it accordingly.

## Visual direction

- The heat pump system is the homepage hero and the primary company story.
- Use the new `GOLD` crown logo from `frontend-v2/public/media/brand/gold-logo-new-4.png`.
- Core palette: deep navy/graphite, metallic gold, controlled signal red, cool blue, ivory, and galvanized-steel neutrals.
- Do not use people photography.
- Do not reuse the old brown template, old hero carousel, old team images, HTMLCodex leftovers, or generic stock HVAC scenes.
- Use restrained premium motion. Honor `prefers-reduced-motion` and keep the experience performant on mobile.

## Bilingual and SEO requirements

- Arabic and English must have separate crawlable, pre-rendered URLs.
- Use `/ar/` and `/en/` route families. Do not use hash routing and do not swap language only in client state.
- Add reciprocal `hreflang` links, locale-aware canonicals, localized metadata, Open Graph data, structured data, and sitemap entries.
- Set the document `lang` and `dir` for every route. Arabic is `lang="ar" dir="rtl"`; English is `lang="en" dir="ltr"`.
- Use CSS logical properties. Components must work in both directions without duplicated page implementations.
- The language switch must map to the equivalent page in the other locale.

## Asset locations

- Homepage hero: `frontend-v2/public/media/hero/gold-heat-pump-hero-v1.png`
- Products family banner: `frontend-v2/public/media/products/gold-products-family-v1.png`
- Approved logo: `frontend-v2/public/media/brand/gold-logo-new-4.png`
- Keep original generated PNG files. Add optimized responsive formats non-destructively.

## Definition of done

- Build succeeds with no console errors or broken assets.
- Every page works at mobile, tablet, laptop, and wide desktop sizes in Arabic and English.
- Keyboard navigation, visible focus, semantic headings, useful alt text, and sufficient contrast are present.
- Arabic does not show mojibake, clipped glyphs, or broken alignment.
- Each locale URL has unique localized title and description, correct canonical and `hreflang`, and renders meaningful HTML without requiring client JavaScript.
- Verify the final result visually in the browser and test direct navigation to every pre-rendered route.
- Commit, push, merge, and deploy only when the user explicitly authorizes them. Never force-push or rewrite shared history.
