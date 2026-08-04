# Round 7 — SK22 / SK30 Product Presentation Revision

## Public-facing rule

The website speaks as GOLD Group. Product pages must describe the product, its
specifications, use and selection context directly. Do not expose the internal
content-production process or use public copy such as “from the support guide”,
“source note”, “verified file”, “scan”, or “deeper data for selected models”.

Internal engineering documentation may continue to record the source used to
validate a specification. That provenance is for maintainers, not for the public
product narrative.

## Discovery and navigation

- Present SK22 and SK30 as models in a real `GOLD SK R410A` catalog card.
- Put model-page links inside that card instead of a separate explanatory block.
- Make `Our Products / منتجاتنا` an expandable desktop menu and mobile
  accordion with direct links to all products, SK22 and SK30.
- Keep model routes bilingual and pre-rendered.

## New visual assets

The scans are reference material only. The production assets below are newly
created, clean visual interpretations with no photographed page, page number,
scan border, supplier identity or embedded marketing claim.

| Purpose | Production PNG |
|---|---|
| SK22 single-fan product render | `frontend-v2/public/media/products/sk-series/gold-sk22-product-render-v2.png` |
| SK30 dual-fan product render | `frontend-v2/public/media/products/sk-series/gold-sk30-product-render-v2.png` |
| SK22/SK30 dimension comparison | `frontend-v2/public/media/products/sk-series/gold-sk22-sk30-dimensions-v2.png` |
| Hydronic-system concept | `frontend-v2/public/media/products/sk-series/gold-sk22-sk30-hydronic-system-v2.png` |

Each PNG has responsive WebP and AVIF variants at 480, 768 and 1200 pixels.

### Image-generation method

- Device geometry was grounded in the scanned SK22/SK30 cover and dimension
  drawing; the established GOLD product-render lighting and material treatment
  was used as the visual reference.
- The hydronic visual recreates the system relationship as a clean editorial
  diagram: heat pump, hydraulic components, underfloor branch and fan-coil
  branch. Exact engineering selection remains project-specific.
- The dimension visual carries the readable enclosure values shown in the
  current product material: SK22 `1140 × 470 × 970 mm` and SK30
  `1140 × 470 × 1270 mm`.
- Product renders deliberately contain no generated logos, stickers, component
  brands or unsupported text. Brand and facts remain accessible HTML.

## Content boundaries

- Keep the current SK22/SK30 technical values already extracted and reviewed.
- Do not add outlet-water temperature, warranty, savings percentages, stock,
  prices, supplier identity or ambiguous values.
- A normal selection statement is acceptable: actual configuration and final
  selection depend on project conditions and are confirmed by the technical
  team. It must not read like a developer/source disclaimer.

## Acceptance criteria

- No raw scanned page is visible on public pages.
- No public copy explains where the site team obtained the content.
- SK22 and SK30 are reachable from the product card and from the header on
  desktop and mobile.
- Arabic RTL and English LTR are both correct.
- The dropdown/accordion supports keyboard navigation, Escape and focus.
- Images use AVIF/WebP where supported and retain PNG fallbacks.
- Build, pre-rendered routes, metadata, structured data and sitemap remain valid.
