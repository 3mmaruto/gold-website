# SEO and i18n Architecture

## Decision

Keep one shared component implementation, but generate separate static HTML for Arabic and English URLs. Do not create two manually duplicated page codebases.

The legacy hash router has been replaced by React Router framework mode with static pre-rendering and no runtime server.

## Route map

```text
/                  x-default language landing or a static default entry
/ar/               Arabic home
/ar/about/         Arabic about
/ar/products/      Arabic products
/ar/products/r290-sk16/ Arabic R290 SK16 product profile
/ar/products/r290-sk22/ Arabic R290 SK22 product profile
/ar/products/sk22/ Arabic SK22 product profile
/ar/products/sk30/ Arabic SK30 product profile
/ar/contact/       Arabic contact
/ar/heat-pumps/    Arabic air-to-water heat-pump guide
/ar/underfloor-heating/ Arabic hydronic underfloor-heating guide
/ar/manufacturer-documents/ Arabic quality-document request page
/en/               English home
/en/about/         English about
/en/products/      English products
/en/products/r290-sk16/ English R290 SK16 product profile
/en/products/r290-sk22/ English R290 SK22 product profile
/en/products/sk22/ English SK22 product profile
/en/products/sk30/ English SK30 product profile
/en/contact/       English contact
/en/heat-pumps/    English air-to-water heat-pump guide
/en/underfloor-heating/ English hydronic underfloor-heating guide
/en/manufacturer-documents/ English quality-document request page
```

The language switch maps equivalent routes, for example `/ar/products/` to `/en/products/`.

## Rendering requirements

- Pre-render all 23 paths at build time.
- Serve meaningful localized HTML before hydration.
- Use `ssr: false` with explicit static pre-render paths if following React Router framework mode.
- Build output must be deployable to GitHub Pages with the existing custom domain.
- Test direct navigation and refresh on every nested route.

## Per-page metadata

Every locale page needs:

- unique localized `<title>`;
- unique localized meta description;
- absolute canonical URL;
- reciprocal `hreflang="ar"` and `hreflang="en"` links;
- `hreflang="x-default"` pointing to `/`;
- localized Open Graph title, description, URL, locale, and image;
- `html lang` and `dir` values;
- crawlable text links between language versions.

## Structured data

Add JSON-LD for:

- `Organization` on the site;
- `WebSite` on home;
- `BreadcrumbList` on internal pages;
- product-category content only when the visible page supports it.
- conservative page-level data only when it matches visible content; private quality records are not represented as public `CreativeWork` items.

Do not add review ratings, prices, availability, or certifications unless the page visibly contains verified source data. Private or source-specific records must not be attached to the Gold Group `Organization` schema or represented as public product certifications.

## Sitemap and robots

- Generate `sitemap.xml` containing every Arabic and English URL and their alternates.
- Generate a simple `robots.txt` that allows crawling and references the sitemap.
- Keep the existing custom domain `https://gold-group-hvac.com` as the production origin.

## Search result expectation

Arabic and English pages can both be indexed and can both appear in search results because they have distinct URLs and localized content. Search engines choose the order and whether both appear together; the site cannot guarantee that the two results will always be adjacent.

## Encoding and direction

- UTF-8 everywhere.
- Never repair Arabic text at runtime.
- Store source content as valid UTF-8 JSON.
- Apply `dir` at the document root, not only on isolated sections.
- Use logical CSS properties such as `margin-inline`, `padding-inline`, and `inset-inline`.
