# Gold Group Current Website Audit

> Historical record: this audit describes the legacy HTML template before the approved 2026-07-20 React Router migration. The legacy application has since been removed; the production source is now `frontend-v2/`.

## 0. Previous Codex Cloud Task Investigation

### Access result
**The old Codex cloud task changes are not accessible from this local task.**

I checked what this task can see in the local Codex environment and could not access any thread/diff matching the old cloud task title like:
- `Update hero section text in index.html`
- `blueprint.md`
- related Gold Group hero update threads

I also confirmed:
- `blueprint.md` does **not** exist in the current repo
- `blueprint.md` is **not** present on the current `audit/current-state` branch
- `blueprint.md` is **not** present in `origin/main`

### What this means
From this local task, I cannot safely inspect:
- the exact old diff to `index.html`
- the exact contents of the proposed `blueprint.md`
- whether the old task still has an Apply button or pending review state
- whether that old task was based on a stale pre-cleanup project state

### Safe recommendation
Do **not** apply that old task blindly.

Because it is inaccessible here and likely based on an older project snapshot, the safer default is:

**Recommended action:**  
**Close old task without applying**  
or, if you want to preserve its wording first:  
**Keep old task open temporarily and copy its diff**

### If you want to preserve anything from it
Open the old task manually in the UI and, if available:
1. click `Review`
2. copy the exact diff for `index.html`
3. copy the full contents of `blueprint.md`
4. take a screenshot if diff copy is inconvenient

Then we can compare it safely against the current `audit/current-state` branch and decide whether only a small text fragment is worth reusing later.

### Final closure recommendation
**Close old task without applying.**  
If you suspect the hero text itself is still useful, first manually copy the diff, then close it.  
Do not leave it hanging as a second ambiguous project state.

---

## 1. Summary

The current Gold Group website is a **static multi-page HTML/CSS/JS site** derived from a Bootstrap/HTMLCodex-style template and lightly customized for the company.

It is currently suitable as a marketing/presentation website, but it is **not yet a business-system foundation**. There is no backend, no database, no admin layer, no structured product data model, and no real content management workflow. The current `our-products.html` page is the closest thing to structured content, but even that is mostly hardcoded and partially supported by a fragile text-parsing script.

The branch `audit/current-state` now matches the deployed source state, which is the right basis for auditing. The major next architectural decision is whether this site should remain a static frontend while a separate backend/CMS is added, or whether the project should later migrate into a full app framework such as Laravel.

---

## 2. Project Structure

### Working directory
`C:\Users\Alrefai\OneDrive\Desktop\gold_group\gold-website`

### Current branch
`audit/current-state`

### Useful structure overview
```text
gold-website/
  .github/workflows/pages.yml
  .idx/dev.nix
  .idx/mcp.json
  .vscode/settings.json
  .nojekyll
  CNAME
  README.md
  GEMINI.md

  index.html
  about.html
  contact.html
  our-products.html

  css/
    bootstrap.min.css
    style.css

  js/
    main.js
    spec-loader.js

  lib/
    animate/
    counterup/
    easing/
    owlcarousel/
    parallax/
    waypoints/
    wow/

  img/
    hero, service, team, icon, cover, feature, product images

  downloads/
    catalog.pdf

  docs/
    source text / OCR / extracted product notes

  scripts/
    extract_catalog.py

  scss/
    bootstrap source SCSS

  tools/
    PowerShell utility scripts for specs/encoding/product-page edits
```

### Purpose of important folders/files
- `index.html`, `about.html`, `contact.html`, `our-products.html`
  - live website pages
- `css/bootstrap.min.css`
  - compiled Bootstrap stylesheet
- `css/style.css`
  - site-specific styling and template overrides
- `js/main.js`
  - common frontend behavior for spinner, scroll effects, language toggle, counters
- `js/spec-loader.js`
  - product-page-only script that fetches text from `docs/main_product.txt` and tries to populate specs/modals
- `lib/`
  - vendor frontend libraries used directly from local files
- `img/`
  - live image assets for pages and products
- `downloads/catalog.pdf`
  - downloadable product catalog PDF used by the products page
- `docs/`
  - content source files, OCR outputs, extracted catalog text, working docs
- `scripts/extract_catalog.py`
  - catalog extraction/OCR helper, not part of live site runtime
- `tools/*.ps1`
  - local maintenance/repair scripts, mostly for `our-products.html` and encoding/spec handling
- `scss/`
  - Bootstrap source files; no active SCSS build pipeline is present
- `.github/workflows/pages.yml`
  - GitHub Pages deployment workflow
- `CNAME`
  - custom domain for GitHub Pages deployment

### Live website files vs non-live/support files
**Live runtime files**
- HTML pages
- `css/`
- `js/`
- `lib/`
- `img/`
- `downloads/catalog.pdf`
- `CNAME`

**Support / docs / generation / maintenance files**
- `docs/`
- `scripts/`
- `tools/`
- `scss/`
- `GEMINI.md`
- `.idx/`
- `.vscode/`

---

## 3. Current Technology Stack

### Stack type
This is **plain static HTML/CSS/JavaScript**.

It is **not**:
- React
- Next.js
- Vite app
- Laravel app
- WordPress
- Node backend app

### Frontend framework/style basis
- Bootstrap-based template
- HTMLCodex template heritage is still visible
- local custom CSS in `css/style.css`

### CSS
- `css/bootstrap.min.css`
- `css/style.css`
- optional SCSS source is present under `scss/`, but there is **no active SCSS build workflow**

### JavaScript
- `js/main.js`
- `js/spec-loader.js`
- local vendor libraries:
  - `wow.min.js`
  - `easing.min.js`
  - `waypoints.min.js`
  - `owl.carousel.min.js`
  - `counterup.min.js`
  - `parallax.min.js`

### Backend
- None

### Database
- None

### Build step
- No real build step
- Site can be served directly as static files
- `.idx/dev.nix` uses `python3 -m http.server` for preview

### Package manager/config
I found **no**:
- `package.json`
- `composer.json`
- `requirements.txt`
- `vite.config.*`
- `next.config.*`
- `artisan`
- backend entrypoint

So this is essentially a static repo with helper scripts only.

---

## 4. Current Deployed Page Set

### Live pages
- `index.html`
- `about.html`
- `contact.html`
- `our-products.html`

No other live HTML pages currently remain on this branch.

### `index.html`
**Purpose**
- homepage / company overview

**Main sections**
- topbar
- navbar
- hero carousel
- about/company intro
- team/facts visual strip
- features / reasons to choose
- services cards
- quote/individuals-organizations section
- footer

**Key assets**
- `img/hero_1.jpg`
- `img/hero_2.jpg`
- `img/product_2.jpg`
- `img/product_3.jpg`
- `img/product_5.jpg`
- `img/product_6.jpg`
- `img/gold_stafe.jpg`
- `img/feature.jpg`
- `img/service-1.jpg` through `img/service-6.jpg`
- several icon PNGs

**Navigation**
- standard static navbar to the 4 live pages

**Content model**
- fully hardcoded in HTML

### `about.html`
**Purpose**
- about/company profile page

**Main sections**
- topbar
- navbar
- page header
- company intro text
- image section
- counters/facts strip
- hidden team section (`d-none`)
- footer

**Key assets**
- `img/gold_stafe.jpg`
- `img/team_work2.JPG`
- `img/carousel-1.jpg`
- `img/team-1.jpg` through `img/team-4.jpg`

**Navigation**
- same static navbar

**Content model**
- fully hardcoded in HTML

### `contact.html`
**Purpose**
- contact/location page

**Main sections**
- topbar
- navbar
- page header
- image panel
- embedded Google map iframe
- footer

**Key assets**
- `img/cover.jpg`

**Navigation**
- same static navbar

**Content model**
- hardcoded HTML + embedded Google Maps iframe

### `our-products.html`
**Purpose**
- product showcase / catalog landing page

**Main sections**
- navbar
- language dropdown
- page hero with catalog download button
- featured product carousel
- technical table image
- specs section with collapse
- product cards grid
- product specification modals
- footer

**Key assets**
- `downloads/catalog.pdf`
- `img/main_product1.JPG` to `img/main_product6.JPG`
- `img/tech_table.png`
- `img/products/heat pump water heater.JPG`
- `img/products/water tank_1.JPG`
- `img/products/expansion tank.png`
- `img/products/water pump heating.JPG`
- `img/products/water pump domestic.JPG`

**Navigation**
- same static navbar plus page-local language switch

**Content model**
- mixed:
  - mostly hardcoded HTML
  - plus runtime text loading through `js/spec-loader.js`

---

## 5. Products Page Audit

### How products are currently displayed
`our-products.html` uses:
- a hero section with PDF download
- a Bootstrap carousel for featured product images
- a static technical table image
- hardcoded product cards
- hardcoded Bootstrap modals for product details
- a JS loader that can populate specs from text files

### Hardcoded vs data-driven
It is **mostly hardcoded**, not truly data-driven.

What is hardcoded:
- page structure
- product cards
- product modal markup
- image file paths
- headings
- most labels and texts

What is semi-dynamic:
- `js/spec-loader.js` fetches `docs/main_product.txt`
- it tries to decode malformed Arabic text
- it tries to populate:
  - main specs section
  - modal content for several products

### Current data mechanism
There is **no JSON product catalog**.

Instead, the current mechanism is:
- `docs/main_product.txt` as a semi-structured text source
- `js/spec-loader.js` parses that text using labels like:
  - `water tank`
  - `heat punp water heater`
  - `expantion tank`
  - `water pump speeding for heating`
  - `water pump speeding for water`

This is fragile and not a scalable data model.

### Where product images/specifications are stored
- images:
  - `img/main_product*.JPG`
  - `img/products/*`
- spec text source:
  - `docs/main_product.txt`
  - `docs/products/*`
  - `docs/p_tech_table.txt`
  - OCR/helper text files
- downloadable catalog:
  - `downloads/catalog.pdf`

### Can this become a CMS product catalog later?
Yes, **visually** the page can be reused as a frontend concept.  
No, **structurally** it is not ready as-is.

### What should be preserved
- the general product page layout concept
- featured product hero/carousel presentation
- product card pattern
- modal/spec presentation idea
- catalog download CTA
- available product asset library

### What should be refactored
- replace text parsing from `docs/main_product.txt` with structured data
- replace hardcoded cards/modals with generated templates
- separate content from layout
- normalize product names, slugs, specs, images, documents into a real schema
- remove encoding-repair logic from runtime delivery path

---

## 6. Content and Assets Audit

### Assets currently used
Used live assets include:
- homepage hero images
- services images
- selected product images
- icons
- team image
- cover/feature images
- `downloads/catalog.pdf`

### Large/heavy assets
Notable large files:
- `downloads/catalog.pdf` about 47.8 MB
- `img/team_work2.JPG` about 11.5 MB
- `img/main_product1.JPG` about 7.6 MB
- several other `main_product*.JPG` files over 1 MB

These are acceptable for archive assets, but not ideal for performance-sensitive production delivery.

### Unused or questionable assets
- `img/carousel-2.jpg` appears present but not referenced by the current live pages
- team images `team-1.jpg` to `team-4.jpg` are referenced only inside a hidden `d-none` team section on `about.html`
- testimonial-related CSS remains, but the testimonial section itself is gone

### Broken or missing asset references
Confirmed issue:
- all 4 live HTML pages reference:
  - `img/favicon.ico`
- that file is **missing**

### Favicon status
`img/favicon.ico`:
- referenced: yes
- exists: no

So the site likely produces a missing favicon request right now.

### Videos
- none found

---

## 7. CSS / JS and Library Audit

### `css/style.css`
Main responsibilities:
- theme colors
- hero sizing
- spinner
- button styling
- navbar behavior
- page header visuals
- service/team/footer styling
- glow text effect
- RTL/language helper classes

Observations:
- readable and manageable
- still contains leftover testimonial CSS
- mixes template legacy with custom business-specific tweaks
- no component/module separation

### `js/main.js`
Responsibilities:
- spinner hide
- WOW animation init
- sticky navbar on scroll
- back-to-top behavior
- counter-up initialization
- language switcher using `localStorage`
- toggles `lang-ar` / `lang-en`
- toggles `.rtl-body` direction

Observations:
- simple and understandable
- jQuery-based
- not modular
- language logic only really matters on `our-products.html`
- includes Arabic label text in script
- still global/script-style, not structured for scale

### `js/spec-loader.js`
Responsibilities:
- fetch `docs/main_product.txt`
- attempt encoding detection/repair with `TextDecoder`
- parse semi-structured specs text
- populate main specs section and product modals

Observations:
- the most fragile part of the frontend
- clearly compensates for broken text encoding and inconsistent source formatting
- uses label heuristics and typo-tolerant matching
- works more like a content rescue script than a proper app data layer
- should not be the long-term foundation of a CMS/catalog system

### Libraries used
- `wow.min.js`
- `easing.min.js`
- `waypoints.min.js`
- `owl.carousel.min.js`
- `counterup.min.js`
- `parallax.min.js`
- `animate.min.css`

### Are all libraries truly needed?
Some are used indirectly by markup/behavior:
- `wow` used through `wow` classes and JS init
- `parallax` used through `data-parallax`
- `counterup` used in `about.html`
- `easing` used by back-to-top animation

Potentially questionable:
- `owlcarousel` library is loaded on all pages, but current visible carousels use Bootstrap’s `carousel slide` markup, not Owl Carousel markup
- testimonial CSS remains although testimonial content is absent

### Broken references
- no broken library file paths found among the current minified library files
- broken asset path found only for `img/favicon.ico`

### Extensibility
The current JS is okay for a small static site, but **not clean enough to scale** into admin-driven business workflows without a major restructuring.

---

## 8. SEO / Metadata / Deployment Audit

### Titles
Current titles are weak/template-like:
- `index.html`: `Gold Group - AC Repair Website Template`
- `about.html`: same template-style title
- `contact.html`: same template-style title
- `our-products.html`: `Gold Group - Our Products`

### Meta descriptions
- present as empty tags
- not actually populated

### Meta keywords
- present as empty tags
- not useful as-is

### Canonical/social metadata
I found no:
- canonical tags
- Open Graph metadata
- Twitter card metadata

### Language and direction
Current language handling is inconsistent:
- HTML documents start with `<html lang="en">`
- content is mixed Arabic/English
- `our-products.html` has a language switcher and `.rtl-body`
- other pages use Arabic content directly without the same bilingual mechanism
- multiple Arabic strings are visibly mojibake/badly encoded in current source output

### Deployment/domain
- GitHub Pages workflow exists
- `.nojekyll` exists
- `CNAME` exists with:
  - `gold-group-hvac.com`

### Deployment model
The site is clearly set up for static GitHub Pages deployment from `main`.

### SEO readiness assessment
Current SEO readiness is **poor**:
- generic titles
- empty descriptions
- no social metadata
- no canonical tags
- inconsistent language declaration
- some template leftovers still visible in footer and page labels

---

## 9. Maintainability Assessment

### Duplicated HTML
Repeated across nearly all pages:
- topbar
- navbar
- footer
- JS include stack
- CSS include stack

This means any simple sitewide update requires multi-file manual edits.

### Hardcoded content
Large amounts of content are hardcoded:
- contact info
- company description
- services
- product descriptions
- product cards
- modal specs
- footer addresses
- labels and navigation text

### Fragile parts
Most fragile areas:
- `our-products.html`
- `js/spec-loader.js`
- encoding-sensitive Arabic text files
- tool-driven content repair workflow

### Signs of legacy/template leftovers
- `Your Site Name` still in footer
- `Designed By HTML Codex` still present
- `Terms / Privacy / Support` placeholders
- `Happy Clients / Projects Succeed / Awards Achieved / Team Members` placeholders
- hidden team section still present
- testimonial CSS remains after testimonial content removal

### Easy-to-reuse parts
- general visual design
- navbar/footer styling concept
- services card layout
- product card/modal presentation
- page hero/header styling

### Should be reorganized before expansion
- shared layout pieces
- product data
- text content
- image/media organization
- spec/document ingestion flow

---

## 10. CMS Expansion Readiness

### Can this become a dynamic catalog/admin site?
Yes, but only after separating:
- presentation
- content
- product data
- media assets
- downloadable documents

### What can be reused
- overall visual identity
- page layouts and sections as design references
- product presentation patterns
- current imagery and content assets

### What should become dynamic later
- homepage hero text
- company/about content
- contact information
- product list
- product images
- specs
- product documents/PDFs
- featured products
- bilingual content fields

### What should not stay as-is
- runtime parsing from `docs/main_product.txt`
- repeated static navbar/footer in separate HTML files
- hardcoded modal content
- raw static HTML for every future product
- manual text repair / mojibake workarounds in production scripts

### Best long-term direction
The cleanest path is likely:
- keep this repo as the **visual reference and content baseline**
- later either:
  - build a backend/CMS separately and keep a decoupled frontend, or
  - migrate into a full app structure such as Laravel when you are ready for admin/business features

For your stated goals, a simple static GitHub Pages site will not be enough.

---

## 11. Future System Readiness

### What the current codebase does not support
It currently has no support for:
- users/login
- roles/permissions
- admin panel
- database
- inventory tracking
- project/sales pipelines
- printable quotes/invoices
- payments tracking
- agents/dealers
- structured Excel import workflow
- audit/history of business data changes

### What future decisions are needed first
Before implementation, you need to decide:
- static frontend + separate backend, or full-stack app
- CMS-first or ERP-lite/business-system-first
- single language vs bilingual content model
- product data schema
- quote/invoice schema
- inventory model
- customer/project lifecycle model
- whether Excel import is one-time, periodic, or operational
- hosting/runtime beyond GitHub Pages

---

## 12. Risks If We Build Directly on the Current Code

Main risks:
- duplicated static markup across pages
- no backend foundation
- no data model
- no admin-editable content
- fragile product-spec workflow
- encoding problems in Arabic content
- oversized media assets
- GitHub Pages constraints for business logic
- hardcoded content scattered everywhere
- manual maintenance overhead grows quickly
- future product expansion would become messy fast if done page-by-page in static HTML

---

## 13. Recommended Next Steps

### A. Immediate cleanup/fixes before any expansion
- resolve the missing `img/favicon.ico`
- audit and fix Arabic encoding/mojibake issues
- replace placeholder/template leftovers
- confirm which assets and hidden sections should remain
- review oversized images and PDF delivery strategy
- document the live source-of-truth content cleanly

### B. Things to preserve
- the current visual identity and color theme
- the homepage/service/product layout ideas
- existing media assets that are still relevant
- the current custom domain and GitHub Pages knowledge
- the product page’s concept and information architecture

### C. Things to refactor
- shared layout into reusable template partials/components later
- product data into a structured source
- multilingual content into explicit fields
- product specs/documents into a real content model
- remove runtime text-decoding hacks from the delivery path

### D. Decisions needed before choosing Laravel/Firebase/other tools
You should decide:
- whether this becomes a real business app or remains a static marketing frontend
- whether admin users need rich CRUD over products/content
- whether inventory/sales/invoices are phase 2 or core phase 1
- whether Excel import is essential operationally
- whether you want monolith simplicity like Laravel or a split static/frontend + API/CMS approach

### E. Best next branch/workflow strategy
Recommended workflow:
1. keep `main` aligned with deployed production state
2. continue audit and planning work from `audit/current-state`
3. create focused branches for:
   - content cleanup
   - encoding fixes
   - asset/SEO cleanup
   - architecture spike / CMS migration planning
4. do not revive old cloud-task patches blindly
5. if old hero text is needed, re-apply only the exact useful wording manually after review
