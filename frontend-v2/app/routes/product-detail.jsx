import {
  FiCheckCircle,
  FiCpu,
  FiDroplet,
  FiMaximize2,
  FiWifi,
} from "react-icons/fi";
import { Link, Navigate } from "react-router";
import Button from "../components/Button";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import ResponsivePicture from "../components/ResponsivePicture";
import SeoLinks from "../components/SeoLinks";
import { getSkProduct, isSkProductSlug } from "../data/skProducts";
import { getContent } from "../lib/content";
import {
  buildProductMeta,
  productBreadcrumbsJsonLd,
  productJsonLd,
} from "../lib/seo";

export function meta({ params }) {
  return buildProductMeta(params.locale, params.productSlug);
}

function ProofStrip({ items, label }) {
  return (
    <div className="product-detail-proof" role="group" aria-label={label}>
      {items.map((item, index) => (
        <div key={item.label}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong dir="ltr">{item.value}</strong>
          <small>{item.label}</small>
        </div>
      ))}
    </div>
  );
}

function TechnicalProfile({ product }) {
  return (
    <section className="section product-technical-section">
      <div className="container">
        <header className="section-heading" data-reveal>
          <p className="eyebrow">{product.technicalEyebrow}</p>
          <h2>{product.technicalHeading}</h2>
        </header>

        <div className="product-electrical-panel" data-reveal>
          <div className="product-electrical-heading">
            <FiCpu aria-hidden="true" />
            <h3>{product.electricalHeading}</h3>
          </div>
          <div className="product-electrical-options">
            {product.electrical.map((option) => (
              <div key={option.supply}>
                <small>{option.label}</small>
                <strong dir="ltr">{option.supply}</strong>
                <span dir="ltr">{option.current}</span>
              </div>
            ))}
          </div>
        </div>

        <dl className="product-spec-grid">
          {product.specs.map((spec) => (
            <div key={spec.label} data-reveal>
              <dt>{spec.label}</dt>
              <dd>
                <span dir="ltr">{spec.value}</span>
                {spec.note ? <small dir="auto">{spec.note}</small> : null}
              </dd>
            </div>
          ))}
        </dl>

      </div>
    </section>
  );
}

export default function ProductDetailPage({ params }) {
  const locale = params.locale;
  const slug = params.productSlug;

  if (!isSkProductSlug(slug)) {
    return <Navigate replace to={`/${locale}/products/`} />;
  }

  const content = getContent(locale);
  const product = getSkProduct(locale, slug);
  const related = getSkProduct(locale, product.related);

  return (
    <>
      <SeoLinks locale={locale} productSlug={slug} />
      <JsonLd data={[
        productBreadcrumbsJsonLd(locale, product),
        productJsonLd(locale, product),
      ]} />

      <section className="product-detail-hero">
        <div className="product-detail-grid-overlay" aria-hidden="true" />
        <div className="container">
          <nav className="product-breadcrumbs" aria-label={locale === "ar" ? "مسار الصفحة" : "Breadcrumb"}>
            <Link to={`/${locale}/`}>{product.breadcrumbs.home}</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/${locale}/products/`}>{product.breadcrumbs.products}</Link>
            <span aria-hidden="true">/</span>
            <strong aria-current="page" dir="ltr">{product.displayModel}</strong>
          </nav>

          <div className="product-detail-hero-layout">
            <div className="product-detail-hero-copy" data-reveal>
              <p className="eyebrow">{product.eyebrow}</p>
              <p className="product-model-mark" dir="ltr">{product.displayModel}</p>
              <h1>{product.title}</h1>
              <p className="product-detail-intro">{product.intro}</p>
              <div className="product-detail-actions">
                <Button to={`/${locale}/contact/?product=${slug}`}>{product.contact}</Button>
                <Button to={`/${locale}/products/`} variant="ghost">{product.back}</Button>
              </div>
            </div>

            <div className="product-detail-hero-media" data-reveal>
              <span className="product-detail-drawing-label" dir="ltr">GOLD PRODUCT · {product.displayModel}</span>
              <ResponsivePicture
                source={product.image}
                alt={product.imageAlt}
                className="product-detail-picture"
                imgClassName="product-detail-image"
                sizes="(max-width: 820px) 88vw, 45vw"
                priority
              />
              <span className="product-detail-drawing-index" dir="ltr" aria-hidden="true">{product.drawingIndex}</span>
            </div>
          </div>

          <ProofStrip items={product.proof} label={product.technicalHeading} />
        </div>
      </section>

      <TechnicalProfile product={product} />

      <section className="product-system-section">
        <div className="container product-system-layout">
          <div className="product-system-copy" data-reveal>
            <p className="eyebrow">{product.systemEyebrow}</p>
            <h2>{product.systemHeading}</h2>
            <p>{product.systemCopy}</p>
            <aside>
              <FiCheckCircle aria-hidden="true" />
              <div><strong>{product.safetyLabel}</strong><p>{product.safetyNote}</p></div>
            </aside>
          </div>
          <div className="product-system-media" data-reveal>
            <span className="technical-figure-label" dir="ltr">HYDRONIC SYSTEM · APPLICATION</span>
            <ResponsivePicture
              source={product.hydronicImage}
              alt={product.hydronicAlt}
              className="product-system-picture"
              imgClassName="product-system-image"
              sizes="(max-width: 820px) 94vw, 58vw"
            />
          </div>
        </div>
      </section>

      <section className="product-dimensions-section">
        <div className="container product-dimensions-layout">
          <div className="product-dimensions-media" data-reveal>
            <span className="technical-figure-label" dir="ltr">{product.dimensionsFigureLabel}</span>
            <ResponsivePicture
              source={product.dimensionsImage}
              alt={product.dimensionsAlt}
              className="product-dimensions-picture"
              imgClassName="product-dimensions-image"
              sizes="(max-width: 820px) 92vw, 46vw"
            />
          </div>
          <div className="product-dimensions-copy" data-reveal>
            <p className="eyebrow">{product.dimensionsEyebrow}</p>
            <FiMaximize2 aria-hidden="true" />
            <h2>{product.dimensionsHeading}</h2>
            <strong dir="ltr">{product.dimensions}</strong>
            <p>{product.dimensionsCopy}</p>
          </div>
        </div>
      </section>

      <section className="product-control-section">
        <div className="container product-control-layout">
          <div className="product-control-copy" data-reveal>
            <p className="eyebrow">{product.controlEyebrow}</p>
            <FiWifi aria-hidden="true" />
            <h2>{product.controlHeading}</h2>
            <p>{product.controlCopy}</p>
            <ul>
              {product.controlFeatures.map((feature) => (
                <li key={feature}><FiCheckCircle aria-hidden="true" /> {feature}</li>
              ))}
            </ul>
          </div>
          <aside className="product-support-card" data-reveal>
            <span><FiDroplet aria-hidden="true" /></span>
            <p className="eyebrow">GOLD GROUP</p>
            <h3>{product.controlSupportTitle}</h3>
            <p>{product.controlSupportBody}</p>
            <Button to={`/${locale}/contact/?product=${slug}`} variant="light">{product.supportCta}</Button>
          </aside>
        </div>
      </section>

      <section className="product-related-section">
        <div className="container product-related-card" data-reveal>
          <div>
            <p className="eyebrow">{product.relatedEyebrow}</p>
            <h2>{related.title}</h2>
            <p>{related.intro}</p>
          </div>
          <Link to={`/${locale}/products/${related.slug}/`} className="product-related-link" prefetch="intent">
            <span dir="ltr">{related.displayModel} · {related.proof[0].value}</span>
            <strong>{product.relatedCta} ↗</strong>
          </Link>
        </div>
      </section>

      <CtaPanel
        title={content.home.cta.title}
        body={content.home.cta.body}
        button={content.home.cta.button}
        to={`/${locale}/contact/?product=${slug}`}
      />
    </>
  );
}
