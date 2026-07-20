# Round 3 — Content, product imagery and catalog design handoff

## Scope

This handoff is for the next Codex implementation pass on `redesign/static-frontend-upgrade`.
Keep all work inside `frontend-v2/`. Do not commit, push, merge or modify `main`.

The current visual direction is approved as the foundation. This pass polishes the public-facing language, adds real product imagery, and evolves `/products/` from category-only cards into a scalable catalog experience.

## Public language decisions

Use confident product language. Remove phrases such as:

- "وفق النشرة الحالية"
- "كما هو مذكور في نشرة المصنع"
- "current manufacturer sheet"
- "as listed by the manufacturer"

These sound like disclaimers and weaken the company’s technical authority. Keep test-condition context only where it is scientifically necessary, such as rated COP.

Do not expose internal manufacturing know-how or proprietary construction details. Public technical content may cover performance, refrigerant, capacity, operating temperature, controls, major branded components already present in the catalogs, and product-selection criteria.

The approved bilingual copy is now stored in:

- `docs/content/site-content.ar.json`
- `docs/content/site-content.en.json`

Important additions and replacements include:

- a confident high-temperature heat-pump technical introduction;
- a new `home.smartControl` content block;
- the products proposition: quality is achieved across every system component;
- service coverage across all Syrian governorates;
- address: `سوريا، دمشق، ماروتا سيتي` / `Marota City, Damascus, Syria`.

## Homepage placement decision

Add one editorial feature after the system-explanation section and before the detailed technical block:

- eyebrow: Smart control / تحكم ذكي
- title and body from `home.smartControl`
- image: `/media/technology/gold-lcd-controller-v1.png`

Use a two-column asymmetric layout on desktop and a stacked layout on mobile. The image should remain readable and must not be mirrored in RTL. Do not reproduce the controller UI as HTML or SVG; use the real image asset.

## Generated product assets

All generated files match the approved navy/graphite, warm-gold and cool-blue visual language. Keep the PNG originals and add responsive WebP/AVIF variants through the existing image-optimization pipeline.

| Purpose | Asset |
| --- | --- |
| 80 C R290 heat-pump series visual | `frontend-v2/public/media/products/generated/gold-heat-pump-r290-80c-series-v1.png` |
| 60 C R32 single-fan series visual | `frontend-v2/public/media/products/generated/gold-heat-pump-r32-60c-single-fan-v1.png` |
| 60 C R32 dual-fan series visual | `frontend-v2/public/media/products/generated/gold-heat-pump-r32-60c-dual-fan-v1.png` |
| Hot-water cylinders | `frontend-v2/public/media/products/generated/gold-hot-water-cylinders-v1.png` |
| Buffer tanks | `frontend-v2/public/media/products/generated/gold-buffer-tanks-v1.png` |
| Expansion tanks | `frontend-v2/public/media/products/generated/gold-expansion-tanks-v1.png` |
| Circulation pump — powered display selected | `frontend-v2/public/media/products/generated/gold-circulation-pump-v1.png` |
| LCD controller | `frontend-v2/public/media/technology/gold-lcd-controller-v1.png` |

The circulation-pump image with the illuminated display is intentionally selected. Its display reads visually as an operating controller, not a website specification label.

## Heat-pump identification and safe copy

The raw file name `heat pumb 80 degre.jpeg` is misleading. The photographed unit visibly carries R32, Mitsubishi and Danfoss labeling and has a dual-fan cabinet. Treat it as the 60 C R32 dual-fan series visual, most consistent with the 22 kW model. Do not present it as an 80 C R290 unit.

The single-fan `heat pumb 60 degre.jpeg` is consistent with the 60 C R32 series. Do not assign an exact 8, 12.5 or 16 kW model to the photo until its nameplate is confirmed.

The `h1`, `h2` and `h4` views support the generated 80 C R290 single-fan series visual. Present it at series level, not as a specific capacity.

### Verified series-level facts

#### R290 high-temperature series

- outlet water temperature: up to 80 C;
- refrigerant: R290, GWP 3;
- heating capacities: 8, 12, 16 and 22 kW;
- Panasonic full-inverter compressor;
- Danfoss plate heat exchanger and electronic expansion valve;
- LCD and Wi-Fi control;
- built-in inverter circulation pump and expansion tank.

#### R32 series

- outlet water temperature: up to 60 C;
- refrigerant: R32;
- heating capacities: 8, 12.5, 16 and 22 kW;
- Mitsubishi full-inverter compressor;
- Danfoss electronic expansion valve;
- LCD and Wi-Fi control;
- the 22 kW product uses the dual-fan cabinet shown in the source photo.

Keep COP values tied to their model and test conditions. Do not turn one rated value into a universal series promise.

## Products-page information architecture

Replace the current four text-only category cards with a real catalog grid while retaining a concise category overview.

Recommended order:

1. Heat pumps
2. Hot-water cylinders
3. Buffer tanks
4. Expansion tanks
5. Circulation pumps
6. Stainless-steel pipework and accessories

The first published heat-pump entries should be series-level cards:

- `R290 High-Temperature Full DC Inverter Series`
- `R32 Full DC Inverter Series`

Each product card should support:

- localized name and summary;
- category and slug;
- image with responsive sources;
- refrigerant;
- maximum outlet-water temperature;
- capacity range;
- three short highlights;
- selection CTA;
- optional future model list;
- SEO-safe alt text.

Store the data in a normalized bilingual JSON structure rather than hardcoding it inside React components. Design the schema so it can later be replaced by CMS/API data without rewriting the grid.

## Search, filters and pagination

Do not add classic numbered pagination merely because it may be needed later. The current catalog is still small.

Implement now:

- a localized search field;
- category filter chips or a compact select on mobile;
- URL state through `?q=` and `?category=`;
- an initial visible limit of 8 products;
- lazy-loaded responsive imagery;
- an empty-results state;
- keyboard- and screen-reader-accessible controls.

Prepare `?page=` in the data/query layer, but show numbered pagination only when the catalog exceeds 12 products or when CMS data makes it necessary. This keeps the first experience clean while preserving scale.

## Interaction and RTL requirements

- Shared components for Arabic and English.
- CSS logical properties and full `dir` support.
- Never mirror product photos, the logo or the LCD controller.
- Product details must work on hover, keyboard focus and tap.
- Avoid hiding essential specifications exclusively behind hover.
- Preserve the current motion language and `prefers-reduced-motion` behavior.
- Mobile cards must show the primary facts without requiring a precision gesture.

## Acceptance criteria for the next Codex pass

- No public-facing manufacturer-disclaimer language remains.
- Homepage includes the smart-control feature using the supplied controller asset.
- Products page contains real heat-pump and supporting-product imagery.
- The mislabeled dual-fan R32 photo is not described as an 80 C R290 unit.
- Search and category filters preserve their state in the URL.
- Catalog structure is data-driven and ready for later CMS pagination.
- New assets are optimized to WebP/AVIF without deleting PNG originals.
- Arabic and English metadata remain localized and reciprocal.
- Desktop, tablet and mobile layouts are visually checked in both directions.
- Production build, direct-route refresh, console and network checks all pass.
