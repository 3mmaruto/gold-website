# Gold Group Corporate Website v1.0.0

- Release date: 2026-08-09
- Production URL: https://gold-group-hvac.com/
- Deployment source: `main`
- Release tag: `v1.0.0`

## Purpose

This release establishes the first formally versioned, recoverable production baseline for the Gold Group corporate website. It is the reference point for future support, defect classification, content additions, and product-page expansion.

## Delivered scope

- One language-selection entry route.
- Eleven Arabic RTL routes and eleven equivalent English LTR routes.
- Corporate home, about, contact, product catalog, heat-pump guide, underfloor-heating guide, and quality-document request pages.
- Dedicated bilingual profiles for R290 SK16, R290 SK22, SK22, and SK30.
- Responsive navigation, expandable Solutions and Products menus, catalog search and filters, and mobile/keyboard interaction.
- Static HTML output for every public route, localized SEO metadata, structured data, sitemap, robots directives, canonical URLs, and reciprocal language alternates.
- Responsive optimized imagery in AVIF/WebP with approved source PNG files retained.
- Downloadable 24-page product catalog.

## Release verification

The release candidate must pass all of the following before the tag is created:

- clean dependency installation;
- React Router type generation;
- production build and presence of all 23 pre-rendered HTML routes;
- dependency and secret scans;
- HTML semantics validation on representative Arabic and English routes;
- direct-route and refresh checks;
- mobile and laptop visual inspection in Arabic and English;
- console and network inspection on representative flows;
- successful GitHub Pages workflow;
- live HTTP, metadata, sitemap, catalog, and redirect verification.

The exact release commit, workflow run, checksums, and live-test evidence are recorded in the private client delivery record and technical appendix kept outside this public repository.

## Known operational items

- Cloudflare currently presents the valid public edge certificate and encrypts traffic to GitHub Pages in `Full` mode. `Full (strict)` remains deferred until the GitHub Pages origin presents a domain-matching certificate under direct SNI validation.
- HSTS and an enforcing Content Security Policy are outside this release and require explicit approval plus staged testing.
- The catalog PDF is accepted and published by GitHub but remains a future optimization candidate because of its large file size.

## Change control after v1.0.0

Corrections that bring the delivered release back to its approved behavior are release defects. New pages, products, integrations, substantial copy creation, redesigns, analytics, forms with backends, or new operational capabilities are separate enhancements and require their own approved scope.
