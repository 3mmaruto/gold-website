# Gold Group Corporate Website v1.0.1

- Release date: 2026-08-11
- Production URL: https://gold-group-hvac.com/
- Deployment source: `main`
- Release tag: `v1.0.1`

## Purpose

This maintenance release strengthens direct customer contact, keeps site-wide navigation compact as the product catalog grows, and adds public evidence of Gold Group's professional presence without exposing private supplier information.

## Customer-facing improvements

- The Arabic and English contact forms now request only the visitor's name, phone, location, and project area.
- Visitors can choose email or WhatsApp. WhatsApp opens a prepared project-enquiry message, while the footer provides a separate direct WhatsApp contact action without a prepared message.
- Product links in the footer are grouped inside an accessible disclosure, reducing footer height on laptops and phones while keeping every link available to visitors and search engines.
- The quality and documentation page now includes Gold Group's BUILDEX participation certificates for 2025 and 2026, presented with responsive imagery and bilingual context.
- Quality-page wording describes relevant technical documentation, field evaluation, and Gold Group's contribution to product improvement without publishing supplier identity, factory details, private document numbers, or source files.

## Release verification

The release candidate must pass all of the following before the tag is created:

- clean dependency installation and production dependency audit;
- React Router type generation and production build;
- presence and successful local serving of all 23 pre-rendered routes;
- Arabic RTL and English LTR review at mobile and laptop widths;
- keyboard operation of the footer product disclosure;
- direct footer WhatsApp URL and prepared contact-form WhatsApp URL checks;
- image-format verification for the new BUILDEX media;
- console, network, metadata, canonical, `hreflang`, sitemap, and robots checks;
- successful GitHub Pages deployment and live production verification.

## Operational boundaries

- The website remains a static corporate site. Enquiry details are handed to the visitor's email or WhatsApp application and are not stored by the website.
- Cloudflare configuration is unchanged by this release.
- HSTS, an enforcing Content Security Policy, backend form processing, analytics, and new product or operational-system capabilities remain separate approved work.
- The downloadable catalog remains a future optimization candidate because of its large file size.
