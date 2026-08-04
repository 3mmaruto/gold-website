import { FiSearch, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Button from "../components/Button";
import CatalogProductCard from "../components/CatalogProductCard";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import ResponsivePicture from "../components/ResponsivePicture";
import SeoLinks from "../components/SeoLinks";
import Section from "../components/Section";
import { queryCatalog } from "../lib/catalog";
import { getContent, getUi } from "../lib/content";
import {
  breadcrumbsJsonLd,
  buildMeta,
  categoryListJsonLd,
} from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "products");
}

export default function ProductsPage({ params }) {
  const locale = params.locale;
  const content = getContent(locale);
  const ui = getUi(locale);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Static pre-rendering does not receive a request query string. Keep the
  // first browser render identical to the generated HTML, then apply URL state
  // after hydration so direct links with filters do not trigger React #418.
  const query = hasHydrated ? (searchParams.get("q") ?? "") : "";
  const category = hasHydrated ? (searchParams.get("category") ?? "all") : "all";
  const page = hasHydrated ? (searchParams.get("page") ?? "1") : "1";
  const catalog = queryCatalog({ locale, query, category, page });

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "page" && value === "1")) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (!("page" in updates)) next.delete("page");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  function clearCatalogState() {
    setSearchParams({}, { replace: true, preventScrollReset: true });
  }

  const filterOptions = [
    { id: "all", label: ui.allProducts },
    ...catalog.categories,
  ];

  return (
    <>
      <SeoLinks locale={locale} page="products" />
      <JsonLd data={[
        breadcrumbsJsonLd(locale, "products", content.navigation.products),
        categoryListJsonLd(locale),
      ]} />
      <PageHero
        locale={locale}
        eyebrow={content.products.eyebrow}
        title={content.products.title}
        intro={content.products.intro}
        pageLabel={content.navigation.products}
      />

      <section className="product-banner-section">
        <div className="container">
          <div className="product-banner" data-reveal>
            <ResponsivePicture
              asset="products"
              alt={content.products.imageAlt}
              className="product-banner-media"
              imgClassName="product-banner-image"
              sizes="(max-width: 900px) 100vw, 1180px"
              priority
            />
            <div className="product-banner-label">
              <span>GOLD</span>
              <strong>{locale === "ar" ? "مكوّنات المنظومة" : "System components"}</strong>
            </div>
          </div>
        </div>
      </section>

      <Section
        className="catalog-section"
        eyebrow={ui.catalogEyebrow}
        title={ui.catalogTitle}
      >
        <div className="catalog-toolbar" data-reveal>
          <label className="catalog-search">
            <span>{ui.searchProducts}</span>
            <div>
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={query}
                placeholder={ui.searchPlaceholder}
                onChange={(event) => updateParams({ q: event.target.value })}
                aria-controls="catalog-results"
              />
              {query ? (
                <button
                  type="button"
                  aria-label={ui.clearFilters}
                  onClick={() => updateParams({ q: "" })}
                >
                  <FiX aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </label>

          <fieldset className="catalog-filter-chips">
            <legend>{ui.filterProducts}</legend>
            <div>
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={catalog.category === option.id ? "is-active" : ""}
                  aria-pressed={catalog.category === option.id}
                  onClick={() => updateParams({ category: option.id })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="catalog-filter-select">
            <span>{ui.filterProducts}</span>
            <select
              value={catalog.category}
              onChange={(event) => updateParams({ category: event.target.value })}
              aria-controls="catalog-results"
            >
              {filterOptions.map((option) => (
                <option value={option.id} key={option.id}>{option.label}</option>
              ))}
            </select>
          </label>

          <div className="catalog-result-summary" aria-live="polite">
            <strong>{catalog.totalResults}</strong>
            <span>{ui.resultsLabel}</span>
          </div>
        </div>

        {catalog.visibleProducts.length ? (
          <div className="catalog-grid" id="catalog-results">
            {catalog.visibleProducts.map((product, index) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                index={(catalog.currentPage - 1) * catalog.pageSize + index}
                locale={locale}
                ui={ui}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty" id="catalog-results">
            <FiSearch aria-hidden="true" />
            <h2>{ui.emptyTitle}</h2>
            <p>{ui.emptyBody}</p>
            <button type="button" onClick={clearCatalogState}>{ui.clearFilters}</button>
          </div>
        )}

        {catalog.showPagination ? (
          <nav className="catalog-pagination" aria-label={ui.pageLabel}>
            {Array.from({ length: catalog.totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  type="button"
                  key={pageNumber}
                  aria-current={catalog.currentPage === pageNumber ? "page" : undefined}
                  onClick={() => updateParams({ page: String(pageNumber) })}
                >
                  {pageNumber}
                </button>
              );
            })}
          </nav>
        ) : null}

        <div className="catalog-row" data-reveal>
          <div>
            <p className="eyebrow">{ui.catalogNote}</p>
            <h2>{locale === "ar" ? "راجع تفاصيل المنتجات المتاحة." : "Review the available product details."}</h2>
          </div>
          <Button href="/catalog/catalog.pdf" variant="dark" download>{content.products.catalogCta}</Button>
        </div>
      </Section>

      <section className="product-solution-links">
        <div className="container product-solution-grid">
          <div data-reveal>
            <p className="eyebrow">{content.home.solutions.eyebrow}</p>
            <h2>{content.home.solutions.title}</h2>
          </div>
          <div className="product-solution-actions" data-reveal>
            <Button to={`/${locale}/heat-pumps/`} variant="dark">
              {content.home.solutions.heatPumpsCta}
            </Button>
            <Button to={`/${locale}/underfloor-heating/`} variant="ghost">
              {content.home.solutions.underfloorHeatingCta}
            </Button>
          </div>
        </div>
      </section>

      <CtaPanel
        title={locale === "ar" ? "المقاس الصحيح يبدأ من بيانات المشروع." : "The right size starts with project data."}
        body={content.contact.intro}
        button={content.products.contactCta}
        to={`/${locale}/contact/`}
        secondary={content.products.catalogCta}
        secondaryHref="/catalog/catalog.pdf"
      />
    </>
  );
}
