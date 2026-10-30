# Codex Implementation Handoff

## Local UI Craft polish — 2026-10-22

Implemented on `improve/website-ui-craft-20261022`, based on `origin/main`
at `0f0dfa8`, in the existing `gold-website-water-cylinders` worktree.
The user authorized a local commit after verification, not a push or deployment.
The primary checkout's unfinished visitor-auth work and this worktree's existing
untracked visitor-integration plan were not changed or included.

### Direction and changes

Preserve Gold's industrial navy/gold identity while improving readable Arabic
and English typography, calmer spacing and predictable product navigation.
The updated QIDMU UI Craft guidance informed hierarchy, Arabic tracking, contact
consistency, static essential information and keyboard/reflow verification.

- Homepage display headings now use a maximum of 56 CSS pixels rather than the
  previous oversized scale; section and page headings have coordinated spacing.
- Footer WhatsApp is a normal, clearly identified contact link with a 44-pixel
  minimum hit area, matching neighboring contact methods instead of a large pill.
- The catalogue has three columns on desktop, two on tablet and one on phones.
  Summary, specifications and highlights are always visible. Each card has one
  localized More details link, with no hover-reveal dependency.
- Eight product families now have image-led placeholder detail pages in both
  languages, using their existing approved images and no invented specifications.
  Existing SK model pages and the complete cylinder page remain available.
  Search/filter context survives opening a family page and returning to products.
- The catalogue's family image sits beside its introduction rather than taking a
  separate large section. Search labels, clear-search action and result placement
  were refined. Light-background secondary actions use a legible outline variant.
- No technical product data, dependencies, API/authentication behavior or ERP/Lab
  files changed. Contact submission remains explicitly unavailable until its
  existing ERP bridge activation gates are satisfied.

Primary changes are in `frontend-v2/app/components/{CatalogProductCard,
CatalogProductProfile,PageHero,SiteFooter}.jsx`, `app/styles/{global,catalog}.css`,
`app/routes/{products,product-detail}.jsx`, and `app/lib/{catalog,content,seo}.js`.
Route generation, sitemap, catalogue tests and the cylinder regression route-count
check were updated together. The build now contains 41 static routes, not 25.

### Verification and evidence

- Node 24.19.0: all 50 tests passed with
  `node --test --test-concurrency=1 tests/*.test.mjs`.
- React Router type generation and production build passed.
- `node scripts/check-water-cylinders.mjs --built` passed: 41 prerendered pages,
  180 local image assets, bilingual schema and unchanged technical/privacy checks.
- All 41 local-preview routes returned HTTP 200 with meaningful headings and
  canonical links.
- Chrome inspected 100 route/locale/viewport combinations: Arabic and English
  across home, catalogue, buffer placeholder, SK22, cylinders, about, contact,
  heat pumps, underfloor heating and quality documents at 320, 390, 768, 1280 and
  1440 CSS-pixel widths. No page-level horizontal overflow, missing heading or
  completed-but-broken image was found in those checks.
- Manually checked live search, category filtering, no-results recovery, clearing
  filters, details/back context, equivalent-language navigation, mobile navigation,
  keyboard focus/activation and the catalogue's reduced-motion state.
- Accepted screenshots are local, untracked evidence in
  `output/ui-craft-20261022/`: `before-home-ar-1440.png`,
  `after-home-ar-1440.png`, `after-home-ar-390.png`,
  `after-catalog-intro-ar-1440.png`, `after-catalog-ar-1440x1050.png`,
  `after-footer-ar-1440.png` and `after-placeholder-en-390.png`.

Use the supported bundled Node 24 runtime; the system Node 22.20 is below the
installed framework's requirement. Run tests serially to avoid Vite test-server
port conflicts, and avoid simultaneous build/dev-server writes on Windows.

This is a scoped implementation and heuristic review, not user research or a
WCAG conformance claim. Native browser zoom at 200/400%, assistive technology,
fallback-font failure and real-device/onscreen-keyboard testing were not performed.
The 320-pixel reflow check is not a substitute for those tests. Placeholder product
pages still need approved product-specific content in a later scope. Publishing
remains a separate approval and release step.

## Website release preparation — 2026-09-28

The user approved publishing the cylinder pages and the current contact UI with
request submission explicitly unavailable until the ERP bridge is accepted.
See [WEBSITE_RELEASE_2026-09-28.md](WEBSITE_RELEASE_2026-09-28.md) for scope and
verification, and [ERP_INTAKE_HANDOFF.md](ERP_INTAKE_HANDOFF.md) for activation gates.
Unfinished visitor authentication and retired Gold Lab routes are not included.
Earlier local-only statements below describe the status on their recorded dates.

## Local cylinder addition — 2026-09-21

See [WATER_CYLINDERS_HANDOFF.md](WATER_CYLINDERS_HANDOFF.md) for the bilingual cylinder page, source decisions, generated-asset provenance, responsive QA, and local-only integration boundary. This addition is isolated from the unfinished visitor-auth work; it has not been pushed or deployed.

## Objective and current state

Maintain the completed Gold Group website in `frontend-v2/`. The original scaffold was replaced by a statically pre-rendered bilingual React Router application, a normalized product catalog, responsive media, and localized SEO. The legacy root template has been removed under the approved deployment plan.

## Start here

1. Confirm the current branch and working tree.
2. Read `AGENTS.md` and every required context file it lists.
3. Inspect the current `frontend-v2/` application and preserve its shared routing, content, catalog, accessibility, and SEO architecture.
4. Preserve the supplied approved assets and content sources.

## Architecture

- Keep React and adopt React Router framework mode with static pre-rendering.
- Preserve the React Router framework-mode implementation; never reintroduce hash URLs.
- Produce pre-rendered static HTML for:
  - `/`
  - `/ar/`, `/ar/about/`, `/ar/products/`, `/ar/contact/`
  - `/ar/products/r290-sk16/`, `/ar/products/r290-sk22/`
  - `/ar/products/sk22/`, `/ar/products/sk30/`
  - `/ar/heat-pumps/`, `/ar/underfloor-heating/`
  - `/ar/manufacturer-documents/`
  - `/en/`, `/en/about/`, `/en/products/`, `/en/contact/`
  - `/en/products/r290-sk16/`, `/en/products/r290-sk22/`
  - `/en/products/sk22/`, `/en/products/sk30/`
  - `/en/heat-pumps/`, `/en/underfloor-heating/`
  - `/en/manufacturer-documents/`
- Use no runtime server (`ssr: false`) and configure the GitHub Pages build output correctly.
- Share components across locales. Do not duplicate page component trees.
- Use valid UTF-8 content from `docs/content/site-content.en.json` and `docs/content/site-content.ar.json` as the initial content source.

## Design implementation

- Preserve the approved hero composition around `public/media/hero/gold-heat-pump-hero-v1.png`.
- Use the new logo from `public/media/brand/gold-logo-new-4.png`.
- Use the products banner from `public/media/products/gold-products-family-v1.png`.
- Use the palette, typography, section plan, motion rules, and responsive behavior in `docs/WEBSITE_V2_BRIEF.md`.
- Keep people imagery, old template visual traces, placeholder text, and developer-facing scaffold copy out of the application.
- Build a polished industrial interface with restrained scroll reveals and pointer depth. Do not add a heavy 3D engine without an actual optimized model.
- Add optimized WebP/AVIF variants and responsive `srcset` where appropriate, while preserving the original PNG sources.

## Pages

- Home: flagship heat-pump story, verified proof points, system explanation, selected technical snapshot, products teaser, about credibility, contact CTA.
- About: company story since 2008, system-level approach, values, project support.
- Products: normalized bilingual catalogue with always-visible summaries, specifications and highlights, and one detail-page link per card. Image-led family placeholders preserve approved imagery until full content is supplied; existing complete SK and cylinder pages remain accessible.
- Contact: verified contact information and an honest frontend-only contact flow. Do not show a false success message without a real endpoint.
- Quality documents: a public text-only request page. Do not expose supplier identities, document identifiers, certificate previews, downloadable source files, or procurement relationships. Direct document requests to the official company email.

## Internationalization

- Set `lang` and `dir` at the document root for every route.
- Use CSS logical properties and locale-aware alignment.
- Keep the physical hero image and logo unmirrored.
- Map the language switch to the corresponding page in the other locale.
- Test Arabic navigation, cards, forms, icons, punctuation, wrapping, and mobile layouts.

## SEO

- Implement all requirements in `docs/SEO_I18N_ARCHITECTURE.md`.
- Add localized title, description, canonical, reciprocal `hreflang`, `x-default`, Open Graph, and useful social image data per route.
- Add `Organization`, `WebSite`, and `BreadcrumbList` JSON-LD where applicable.
- Generate `sitemap.xml` and `robots.txt` for `https://gold-group-hvac.com`.
- Do not promise that Arabic and English results will appear adjacent; make both independently indexable.

## Verification

- Run install/build checks using the repository's chosen package manager.
- Confirm every pre-rendered HTML file exists in the production build output.
- Serve the production output and test direct navigation plus refresh for every route.
- Inspect the site at mobile, tablet, laptop, and wide desktop sizes in Arabic and English.
- Check keyboard access, focus states, reduced motion, console errors, broken network requests, image layout shift, and Arabic glyph rendering.
- Summarize changed files, tests, known limitations, and any decisions that still need user approval.

## Constraints

- Do not touch, merge, commit, push, or deploy `main` unless a later task explicitly authorizes that exact action.
- Do not copy raw material from `../gold/` into the repo except approved web-ready assets.
- Do not fabricate specifications, awards, client counts, prices, ratings, warranties, or certifications.
