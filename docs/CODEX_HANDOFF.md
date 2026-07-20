# Codex Implementation Handoff

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
  - `/ar/heat-pumps/`, `/ar/underfloor-heating/`
  - `/en/`, `/en/about/`, `/en/products/`, `/en/contact/`
  - `/en/heat-pumps/`, `/en/underfloor-heating/`
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
- Products: hot-water cylinders, buffer tanks, expansion tanks, circulation pumps. Hover/focus/tap reveal must show purpose and selection criteria from the content JSON.
- Contact: verified contact information and an honest frontend-only contact flow. Do not show a false success message without a real endpoint.

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
