# Hot-water cylinders — local implementation handoff

Date: 2026-09-21. Status: local implementation and scoped visual QA complete; **not published**.

## Scope and integration boundary

- New routes: `/ar/products/hot-water-cylinders/` and `/en/products/hot-water-cylinders/`.
- Shared product navigation feeds the header and collapsible footer. The cylinder catalog card now has a direct detail-page link and five concise specifications alongside selection criteria.
- Dedicated AR/EN content, scoped responsive styles, product/breadcrumb structured data, canonical/hreflang metadata, sitemap entries and static prerendering.
- Implemented on `feat/water-cylinders`, based on local `main` at `0059f79930af67788fc02316233703d3bc8b74c2`, in the separate `outputs/worktrees/gold-website-water-cylinders` workspace.
- The original `gold-website` checkout and its uncommitted visitor-identity/contact work on `feat/shared-visitor-local` were not changed or staged. This worktree does not include that unfinished feature. Integrate and test those changes together deliberately in a later authorized release.
- No ERP/Lab code, dependency versions, hosting, account settings or production services changed. No push, merge, deploy, tag or release was authorized for this addition.

## Content decisions and source scope

Privately supplied company references were read and visually checked: `WATER TANK خـزان الميـاه _20260911.pdf` (three pages), `Safety Valve _20260908.pdf` (one drawing), and `اسطوانة مياه.jpeg`. Raw PDFs and source-document page images are not public build assets and are not committed.

Only SK-120LT and SK-200LT receive detailed specifications:

| Field | 120 L | 200 L |
| --- | --- | --- |
| Inner tank working pressure | 7 bar | 10 bar |
| Jacket working pressure | 5 bar | 5 bar |
| Diameter × height | 560 × 970 mm | 560 × 1470 mm |
| Net weight | 41 kg | 71 kg |
| Electric backup | 1500 W | 1500 W |
| Supply / protection | 220–240 V, 50 Hz / IPX4 | 220–240 V, 50 Hz / IPX4 |
| Tank body thickness | 2 mm | 2.5 mm |
| Enamel thickness | 0.15–0.5 mm | 0.15–0.5 mm |
| Insulation thickness | 40 mm | 60 mm; 50 mm around jacket |

The general paragraph and model table differ on pressure and insulation. The user explicitly approved using each model's table, including 7/10 bar. The model table takes precedence over generic marketing values. The third PDF page describes buffer tanks and was not applied to these cylinders. Magnesium-anode dimensions were omitted because units/order were insufficiently explicit. The 75°C thermostat and 90°C additional thermal protection are presented as control/protection values, not recommended operating-water temperatures. No unverified warranty, certification or supplier-identity claims were added.

All six available capacities are listed: 120, 200, 300, 500, 800 and 1000 L. The page explicitly limits the detailed specifications to 120/200 L; it does not extrapolate them to larger sizes.

## Image provenance and technical treatment

- `gold-cylinder-photo.jpg`: the user-supplied GOLD product photograph, retained without generative alterations. AVIF/WebP renditions are delivery optimizations.
- `cylinder-cutaway-v3.png`: produced using the built-in ImageGen image-edit workflow from the supplied engineering drawing, then visually reviewed against it by the main agent and an independent source-audit agent.
- Existing `generated/gold-hot-water-cylinders-v1` family illustration is reused and labelled as an illustration in alternative text.
- The cutaway is explanatory artwork, not dimensioned CAD or an installation instruction. Technical labels and connection sizes remain accessible, translated HTML. No supplier marks, document headers or document page numbers were copied into the generated image.
- New photographs/illustration have responsive 480/768/1200 AVIF and WebP renditions. A full-size cutaway link supports closer examination on small screens.

Generation brief and revisions (built-in tool; no CLI image model settings):

1. Redraw the source's horizontal longitudinal section on clean ivory, using gold insulation, steel structure and blue water. Preserve the jacket arrangement, four left penetrations, three top ports and downward lower-right outlet. Do not invent a helical coil, extra supports, text, dimensions, logos or arrows. First result rejected for invented feet and inaccurate outlet/jacket presentation.
2. Use the source drawing and first result to make the inner storage chamber and separate surrounding jacket unambiguous; restore the source port arrangement, remove feet and retain plain port stubs. Second result required a hot-outlet correction.
3. Change only the upper-left red hot-water outlet so it passes sealed through the jacket and inner wall into the inner water chamber. Preserve all other geometry/style. This final result was accepted as an illustrative overview, not as a precise manufacturing drawing.

Source renders and rejected generations remain outside the repository, in private local output locations. They must not be added to public assets during later integration.

## Verification

Runtime used for final validation: bundled Node 24.19.0 (the system Node 22.20 is below the repository's declared minimum).

| Gate | Result |
| --- | --- |
| Production build with image optimization | PASS; 25 prerendered pages |
| `npm run typecheck` | PASS; this existing script performs React Router type generation, not a separate full TypeScript compiler run |
| `node scripts/check-water-cylinders.mjs --built` | PASS; AR/EN source and built content, 25 prerender routes, 166 unique local image assets, specification scope, metadata/schema, sitemap and privacy/regression checks |
| `git diff --check` | PASS |
| `npm audit --omit=dev` | 0 vulnerabilities reported at inspection |
| Independent integration/source review | PASS; no concrete implementation blockers |
| Chrome local production preview | PASS for the scoped flow below |

Full development-dependency audit still reports three pre-existing advisories (baseline-browser-mapping, browserslist and sharp; one moderate/two high). No lockfile/package changes were made here. Track their remediation as build-tool maintenance before a later release; the production-only audit result must not be described as a clean full dependency audit.

## Visual and interaction QA

Browser: connected desktop Chrome, local static production preview at loopback port 4175. Responsive viewport emulation, **not physical-phone testing**.

- Arabic RTL and English LTR inspected at 360, 390, 768, 1440 and 1920 CSS px; no document-level horizontal overflow in the tested layouts.
- All 25 prerendered routes were opened directly and refreshed in Chrome; each rendered its expected main heading and locale.
- Hero, technical comparison, expandable material details, cutaway/legend and larger-capacity strip inspected. Mobile tables remain readable without horizontal scrolling.
- Catalog search for `IPX4` returns the cylinder; desktop category filtering and catalog-to-detail navigation work. Compact specifications sit beside selection criteria when space permits and stack on phones.
- Product entry appears in the mobile and desktop product menus and the collapsible footer. Keyboard Enter/Tab navigation, details disclosure and visible focus were checked.
- Language switching preserves the equivalent product route. In-page anchors work. Contact CTA reaches the existing contact route with the cylinder query parameter; no message/form submission was performed.
- All three detail-page images loaded; no console warning/error was captured in the accepted flow.
- New primary interactions were checked at practical 44 px or greater touch heights. Reduced-motion preference was enabled during testing and respected by document scrolling.

Selected evidence is outside Git in `outputs/water-cylinders-qa/`:

- `ar-1440-top.png`, `en-1440-top.png`
- `ar-1440-connections.png`, `ar-1440-products-menu.png`, `ar-1440-catalog.png`
- `ar-390-top.png`, `en-390-top.png`, `ar-390-specifications.png`, `ar-390-connections.png`
- `ar-360-specifications.png`, `en-360-specifications.png`
- `ar-768-connections.png`, `en-768-capacities.png`
- `ar-1920-top.png`, `en-1920-top.png`

The visual pass retained the existing navy/gold brand system, used scoped component styling, kept numerical units directionally isolated, and avoided adding dense detail to the catalog overview. This is scoped visual/interaction QA, not a full WCAG certification or a production deployment check.

## Reopen locally / later release

From this worktree's `frontend-v2` directory, use a supported Node version, run `npm ci` if dependencies are absent, then `npm run build` and `npm run preview -- --host 127.0.0.1 --port 4175 --strictPort`. Open one of the new routes above at `http://127.0.0.1:4175`.

Stop the preview after review. The local commit is a recoverable implementation checkpoint only. A later combined visitor-auth/backend release needs its own integration checks, approval and deployment verification. Larger-cylinder specifications remain a separate content expansion when source data is available.
