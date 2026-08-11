# Changelog

All notable production releases of the Gold Group corporate website are documented here.

## [1.0.1] - 2026-08-11

### Added

- Direct WhatsApp project enquiries from the bilingual contact form, with the visitor's name, phone, location, and project area prepared in the message.
- A direct WhatsApp contact action in the site-wide footer.
- Bilingual BUILDEX 2025 and 2026 participation records on the quality and documentation page, with responsive AVIF/WebP media.

### Changed

- Simplified the contact form to the four details needed for an initial enquiry: name, phone, location, and area.
- Retained email as an alternative enquiry channel while removing unnecessary implementation wording from the public form.
- Grouped product links inside an accessible, keyboard-compatible footer disclosure so future product additions do not make the footer excessively tall.
- Refined the quality-page copy around documented technical areas, field experience, product evaluation, and Gold Group's professional exhibition presence without publishing private supplier identity.

### Security and privacy

- WhatsApp and email actions open the visitor's chosen application; the static website does not store or submit enquiry data to an external form backend.
- No supplier names, factory identifiers, patent identifiers, or private source documents are published by this release.

## [1.0.0] - 2026-08-09

### Added

- First formally versioned production baseline.
- Arabic RTL and English LTR experiences across 23 pre-rendered routes.
- Corporate pages, product catalog, solution guides, quality-document request page, and four model-specific product profiles.
- Localized metadata, canonical URLs, reciprocal `hreflang`, Open Graph data, JSON-LD, sitemap, and robots directives.
- Responsive AVIF/WebP media while retaining approved source assets.
- Accessible desktop and mobile navigation, catalog search and category filters, direct query-state URLs, and keyboard-compatible product details.
- GitHub Pages deployment workflow and Cloudflare edge configuration for the production domain.

### Changed

- Updated GitHub Actions runtime dependencies to maintained Node 24-compatible action versions.
- Resolved remaining HTML semantic validation errors in catalog, homepage, and product-detail components.
- Updated project documentation to reflect the current 23-route production architecture.
- Cleared all known npm dependency advisories without force-upgrading the application stack.

### Security

- Production dependency audit reports zero known vulnerabilities at release time.
- HTTP redirects to HTTPS at the public edge; TLS 1.2 is the minimum accepted client protocol and TLS 1.3 is enabled.
- Cloudflare-to-origin traffic remains encrypted in `Full` mode pending a domain-matching GitHub Pages origin certificate before `Full (strict)` can be enabled safely.

### Known operational items

- The downloadable catalog is intentionally retained even though its size exceeds GitHub's recommended 50 MB file guidance.
- GitHub Pages origin-certificate readiness must be rechecked before changing Cloudflare from `Full` to `Full (strict)`.
- HSTS and a strict Content Security Policy are not enabled in this release and require a separately tested rollout.
