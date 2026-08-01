# Manufacturer Documentation Website Round

## Outcome

Extend the existing bilingual Gold Group website with a factual, visually integrated manufacturer-document library that strengthens traceability and technical trust without implying that Gold Group itself owns the patents or holds blanket product certification.

## Public information architecture

- Add `/ar/manufacturer-documents/` and `/en/manufacturer-documents/` as pre-rendered pages.
- Use the visible page name `الجودة ووثائق المصنّع` / `Quality & Manufacturer Documents`.
- Keep the primary header unchanged to avoid crowding.
- Add a compact trust teaser to the About page after the existing approach band and before the final CTA.
- Add one localized footer link to the library page.
- Do not embed a PDF viewer. Use responsive first-page previews and a clear PDF action.

## Public document set

Use only the four items marked `Publish` in `docs/CERTIFICATE_SOURCE_REGISTER.md`.

- Feature the 2025 condensing heat-exchanger utility-model patent first.
- Include the air-source central hot-water heating utility-model patent as a manufacturer-supplied first-page scan.
- Include the HCD-LK12-W heating heat-pump industrial-design patent as a manufacturer-supplied first-page scan.
- Include the heat-pump outdoor-unit industrial-design patent as a manufacturer-supplied first-page scan.

Do not copy or expose held, expired, archived or unrelated PDFs in `public/`.

## Required wording guardrails

- Say `manufacturer documents`, `patent document`, `utility-model patent` or `industrial-design patent` as applicable.
- Never say `Gold Group is certified`, `all GOLD products are certified`, or imply that a patent proves safety, performance or conformity.
- State that each document applies only to the named holder, number and scope shown in the source.
- State that the original-language PDF is the authoritative source.
- Describe dates as application dates or grant-publication dates, not as current validity dates.
- Chinese source language must be visible on each card.
- The condensing heat-exchanger file may be described as a complete one-page source. The other three cards must visibly state that the supplied PDF contains the first certificate page only.

## Visual direction

Build on the existing navy, graphite, ivory and gold design system.

- Use real document previews, not badges, shields, stock photography or generated certificate art.
- Dedicated page: existing `PageHero`; a three-point provenance strip; a four-card document grid; a dark scope note; existing CTA treatment.
- About teaser: three compact preview cards and a single CTA to the full page.
- Document card: portrait preview with a calm paper treatment; document type; concise title; exact identifier and grant-publication date; PDF action.
- Desktop/laptop: four-card collection in a balanced two-column grid, with the newest document visually leading through ordering and copy, not by breaking the layout.
- Mobile: one column, preview capped so metadata and PDF action remain visible without excessive scrolling.
- Preserve logical CSS properties, RTL/LTR behavior, focus styles and reduced-motion support.

## SEO and structured data

- Add localized metadata, canonical URL, reciprocal `hreflang` and Open Graph data.
- Add both routes to `sitemap.xml` and the React Router pre-render list.
- Use conservative `CollectionPage` plus `ItemList` / `CreativeWork` JSON-LD based only on visible data.
- Do not attach manufacturer patents to the Gold Group `Organization` schema.
- Update architecture/handoff documentation from 13 to 15 pre-rendered paths.

## Assets

- Copy approved PDFs to `frontend-v2/public/documents/manufacturer-documents/` using the public slugs in the source register.
- Render page-one PNG previews to `frontend-v2/public/media/manufacturer-documents/`.
- Generate 480, 768 and 1200 pixel WebP/AVIF variants while retaining PNG originals.
- Give every preview localized, factual alt text.

## Acceptance criteria

- All 15 pre-rendered HTML routes exist and direct navigation/refresh work.
- All four public PDFs return HTTP 200 with `application/pdf`.
- Arabic and English pages render meaningful HTML before JavaScript.
- Page metadata, canonical, reciprocal hreflang, breadcrumbs and conservative JSON-LD are correct.
- No header crowding or regression to existing pages.
- Arabic and English verified at 390px mobile and 1440px laptop; 768px and 1920px regression checks also pass.
- No horizontal overflow, clipped actions, broken images, console errors or failed network requests.
- Keyboard focus and PDF actions work.
- `git diff --check`, image optimization, type generation and production build pass.
- No commit, push, PR or deployment until local validation passes; once it passes, commit intentionally, push the feature branch, open a PR, merge normally, wait for the GitHub Pages workflow and repeat live checks.
- Do not modify Cloudflare.
