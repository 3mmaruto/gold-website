# Gold Group pre-deployment and SEO handoff

Date: 2026-07-20

## Purpose

This document is the single execution brief for replacing the legacy published website with the current bilingual React Router build. It separates verified facts from work that still needs implementation or user approval.

The current development branch is:

`redesign/static-frontend-upgrade`

Do not merge, publish, delete remote branches, rewrite history, or change Cloudflare settings without explicit user approval at the relevant checkpoint.

## Verified current state

- The new website builds successfully and pre-renders nine routes.
- Arabic uses RTL and English uses LTR.
- Localized metadata, canonical URLs, reciprocal language alternates, Open Graph, JSON-LD, `robots.txt`, and `sitemap.xml` exist.
- Product search and category filtering preserve URL state.
- The production preview returns HTTP 200 for all nine routes, `robots.txt`, `sitemap.xml`, and the catalog PDF.
- The local dependency security audit reports no known production vulnerabilities.
- The local machine uses Node 22.20.0. The repository and GitHub Actions target Node 22.22.0.
- The remote repository has only `main` and `redesign/static-frontend-upgrade`.
- The remote development branch contains only the early scaffold. The complete current website is still local and uncommitted.
- The live domain still serves the old static template.
- Cloudflare DNS correctly points the apex and `www` hostnames to GitHub Pages and proxies them.
- Plain HTTP currently remains accessible instead of redirecting to HTTPS.
- The live site does not currently serve a working `robots.txt` or `sitemap.xml`.

## Required cleanup before the first commit

The replacement site is the source of truth. Remove obsolete code and generated artifacts, while retaining documentation that still explains product facts or architectural decisions.

### Remove the legacy published application

After confirming that the new build contains every required public route and asset, remove the old root application and its obsolete build tooling, including:

- legacy root HTML pages such as `index.html`, `about.html`, `contact.html`, and `our-products.html`;
- legacy `css`, `js`, `lib`, `scss`, and `img` application directories;
- legacy root deployment artifacts that are superseded by `frontend-v2/public` and the current workflow;
- obsolete extraction and mojibake repair utilities under the legacy `tools` and `scripts` directories;
- old editor/debug artifacts such as `.idx`, `.vscode`, and `firebase-debug.log`, if they contain no reusable project configuration.

Do not delete a file merely because it is old. First confirm that it is not referenced by the new application, the current build workflow, or a retained source-of-truth document.

### Remove duplicate and unused media

- `downloads/catalog.pdf` and `frontend-v2/public/catalog/catalog.pdf` are byte-for-byte identical and each is about 45.65 MB. Keep the public copy used by the new site and remove the legacy duplicate.
- Do not rewrite Git history merely to remove historical large files unless the user explicitly approves that separate destructive operation.
- Remove the unused legacy JPG files currently carried inside `frontend-v2/public/media` after confirming zero references:
  - `company/company-cover.jpg`
  - `company/team-work.jpg`
  - `hero/heat-pump-hero-01.JPG`
  - `hero/heat-pump-hero-02.JPG`
  - `products/heat-pump-hero-03.JPG`
  - `products/water-tank-01.JPG`
- Preserve original approved PNG assets and their responsive WebP/AVIF derivatives.

### Consolidate project memory

- Update `docs/PROJECT_CONTEXT.md`; it still describes `frontend-v2` as an early scaffold.
- Update `docs/CODEX_HANDOFF.md` so it reflects the completed Round 3 catalog and the deployment plan.
- Keep technical source material that supports real product claims.
- Move superseded extraction outputs to a clearly named archive only if they may be useful later; otherwise remove them after review.
- Keep `AGENTS.md` as the operating instruction file.

## SEO implementation before deployment

The current technical foundation is good. The next meaningful gain is useful, crawlable content for the real services people search for, not keyword repetition.

### Add two bilingual solution topics

Add four pre-rendered pages:

- `/ar/heat-pumps/`
- `/en/heat-pumps/`
- `/ar/underfloor-heating/`
- `/en/underfloor-heating/`

Each Arabic/English pair must use shared components and localized content data.

#### Heat-pump topic

Cover, without exposing proprietary manufacturing knowledge:

- what an air-to-water heat pump provides;
- heating, cooling, and domestic hot-water applications;
- the role of R290 and R32 product series already documented in the catalog;
- project inputs used for correct selection: design load, required water temperature, climate conditions, hydraulic design, and control requirements;
- links to the product catalog and project enquiry page.

Primary natural-language topics include:

- مضخات حرارية
- مضخة حرارية هواء إلى ماء
- مضخات حرارية في سوريا
- heat pumps
- air-to-water heat pumps
- heat pumps in Syria

#### Underfloor-heating topic

Cover:

- how hydronic underfloor heating distributes heat;
- how it can integrate with a correctly selected heat pump and hydraulic components;
- the design inputs that matter: building heat load, pipe layout and spacing, floor construction, supply-water temperature, zoning, circulation, insulation, and controls;
- links to the products and contact pages.

Primary natural-language topics include:

- تدفئة أرضية
- نظام التدفئة
- تدفئة مائية
- underfloor heating
- hydronic heating system

Do not promise savings percentages, guaranteed performance, 24/7 support, project counts, or certification claims unless the company supplies evidence.

### Integrate the new pages fully

- Add the routes to React Router and the static pre-render list.
- Add unique localized title and description metadata.
- Add canonical and reciprocal `hreflang` links including self references and `x-default` where appropriate.
- Add the four URLs to the XML sitemap with reciprocal localized alternates.
- Add breadcrumb JSON-LD.
- Add contextual links from the homepage, relevant product content, and footer.
- Ensure the pages are discoverable through normal links and do not exist only for search engines.
- Keep the language-selector root `/` as `x-default` unless the user later chooses a different entry behavior.

### Correct and extend existing structured data

- Use the real social-image dimensions, 1672 by 941.
- Include Marota City, Damascus, Syria in the organization address.
- Describe Syria as the service area and Arabic/English as supported contact languages.
- Validate the final JSON-LD after the production build.

## URL migration and Cloudflare work

The old URLs already receive visits and may be indexed. Preserve their signals with permanent, relevant redirects instead of returning 404 or redirecting everything to the home page.

Create and verify these Cloudflare redirect rules only after the new deployment is ready:

- `/about.html` to `/ar/about/`
- `/our-products.html` to `/ar/products/`
- `/contact.html` to `/ar/contact/`

Use HTTP 301 or 308. Preserve query strings unless there is a clear reason not to. Check for any additional indexed legacy URLs before finalizing the map.

After confirming the active edge certificate and checking for redirect loops:

- enable Cloudflare `Always Use HTTPS`;
- confirm `http://gold-group-hvac.com/...` redirects once to the equivalent HTTPS URL;
- confirm `www` resolves or redirects consistently to the apex canonical host;
- do not enable HSTS in the same step. Consider HSTS only after HTTPS has been stable and fully verified.

## Recommended logical commits

Create focused commits only after reviewing the final diff:

1. `chore: remove legacy site and obsolete generated files`
2. `feat: add bilingual React Router website and product catalog`
3. `feat: add bilingual heat pump and underfloor heating guides`
4. `seo: finalize metadata structured data sitemap and migration support`
5. `ci: build and deploy frontend v2 with GitHub Pages`
6. `docs: consolidate project context and deployment handoff`

The exact number may be adjusted to keep each commit coherent. Do not combine unrelated cleanup, content, and deployment changes into one opaque commit.

## Verification gate before pushing

- Confirm the branch is `redesign/static-frontend-upgrade`.
- Run dependency installation from the lockfile under Node 22.22.0 or newer.
- Run type generation/type checking and the production build.
- Confirm all 13 expected pre-rendered routes exist as standalone HTML.
- Confirm Arabic and English content is present in built HTML before JavaScript.
- Verify `lang`, `dir`, canonical, language alternates, metadata, Open Graph, and JSON-LD.
- Test direct navigation and refresh for every route.
- Test product query and category URL state.
- Test mobile, tablet, laptop, and wide-desktop layouts in both languages.
- Confirm no broken images, horizontal overflow, console errors, or failed network requests.
- Confirm `robots.txt`, `sitemap.xml`, the catalog, and responsive images return HTTP 200.
- Re-run a secret scan and production dependency audit.
- Review `git status`, tracked large files, and the complete diff before committing.

## Controlled remote and deployment sequence

Use explicit checkpoints:

1. Complete cleanup, SEO additions, build, and tests locally.
2. Create the logical commits on `redesign/static-frontend-upgrade`.
3. Push only the development branch and report the commit hashes.
4. Stop for user review before changing `main`.
5. After approval, merge through a reviewed pull request or an explicit, non-destructive local merge.
6. Let the `main` GitHub Pages workflow deploy `frontend-v2/build/client`.
7. Verify the live site first, then activate and test Cloudflare redirects and HTTPS enforcement.
8. Keep the old development branch until production is stable and the user approves deletion.

## Post-deployment search setup

Guide the user through these steps interactively rather than treating them as a black box:

1. Add a Google Search Console domain property for `gold-group-hvac.com`.
2. Verify ownership with the provided DNS TXT record in Cloudflare.
3. Submit `https://gold-group-hvac.com/sitemap.xml`.
4. Inspect the home page, both solution pages, and the products page with URL Inspection.
5. Request indexing only for the most important new URLs; do not repeatedly request the same URLs.
6. Monitor indexing, page experience, search queries, clicks, impressions, and legacy redirect behavior over the following weeks.
7. Add Bing Webmaster Tools afterward if desired, reusing DNS verification or importing from Search Console where available.

SEO is iterative. Successful deployment and sitemap submission help discovery but do not guarantee rankings. Evaluate results using real query and landing-page data before creating further pages.

## Actions completed during this audit

- Corrected the Open Graph image dimensions to match the real source image.
- Extended organization JSON-LD with Marota City, Damascus, Syria, service area, and contact languages.
- Added a root `.gitignore` for local temporary files and frontend-generated output.
- Performed read-only inspection of the local repository, GitHub, the live domain, and Cloudflare DNS.
- No files were deleted, no commit was created, no branch was pushed or merged, and no live setting was changed.
