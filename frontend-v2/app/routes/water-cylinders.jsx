import { FiDroplet, FiLayers, FiShield, FiThermometer, FiZap } from "react-icons/fi";
import { Link } from "react-router";
import Button from "../components/Button";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import ResponsivePicture from "../components/ResponsivePicture";
import SeoLinks from "../components/SeoLinks";
import { getWaterCylinder, waterCylinderSlug } from "../data/waterCylinders";
import { productBreadcrumbsJsonLd, productionOrigin, productUrl } from "../lib/seo";
import "../styles/water-cylinders.css";

export function meta({ params }) {
  const locale = params.locale === "en" ? "en" : "ar";
  const product = getWaterCylinder(locale);
  const image = `${productionOrigin}${product.assets.photo.fallback}`;
  return [
    { title: product.seoTitle },
    { name: "description", content: product.seoDescription },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:type", content: "product" },
    { property: "og:site_name", content: "GOLD | Gold Group" },
    { property: "og:title", content: product.seoTitle },
    { property: "og:description", content: product.seoDescription },
    { property: "og:url", content: productUrl(locale, waterCylinderSlug) },
    { property: "og:locale", content: locale === "ar" ? "ar_SY" : "en_US" },
    { property: "og:locale:alternate", content: locale === "ar" ? "en_US" : "ar_SY" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: String(product.assets.photo.width) },
    { property: "og:image:height", content: String(product.assets.photo.height) },
    { property: "og:image:alt", content: product.imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: product.seoTitle },
    { name: "twitter:description", content: product.seoDescription },
    { name: "twitter:image", content: image },
  ];
}

const featureIcons = { shield: FiShield, layers: FiLayers, heat: FiThermometer, power: FiZap };

function SpecificationTable({ technical, rows, caption }) {
  return (
    <table className="cylinder-spec-table">
      <caption className="cylinder-sr-only">{caption}</caption>
      <colgroup><col className="cylinder-spec-label" /><col /><col /></colgroup>
      <thead>
        <tr>
          <th scope="col">{technical.specification}</th>
          {technical.modelNames.map((name) => <th scope="col" key={name}>{name}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}{row.note && <small>{row.note}</small>}</th>
            {row.values.map((value, index) => <td key={index}><bdi dir="ltr">{value}</bdi></td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function WaterCylindersPage({ params }) {
  const locale = params.locale;
  const product = getWaterCylinder(locale);
  const { construction, technical, connections } = product;
  const contactUrl = `/${locale}/contact/?product=${waterCylinderSlug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `GOLD · ${product.title}`,
    brand: { "@type": "Brand", name: "GOLD" },
    category: product.category,
    description: product.intro,
    image: `${productionOrigin}${product.assets.photo.fallback}`,
    url: productUrl(locale, waterCylinderSlug),
  };

  return (
    <div className="water-cylinder-page">
      <SeoLinks locale={locale} productSlug={waterCylinderSlug} />
      <JsonLd data={[productBreadcrumbsJsonLd(locale, product), structuredData]} />

      <section className="cylinder-hero">
        <div className="container">
          <nav className="cylinder-breadcrumbs" aria-label={product.breadcrumbs.label}>
            <Link to={`/${locale}/`}>{product.breadcrumbs.home}</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/${locale}/products/`}>{product.breadcrumbs.products}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.shortTitle}</span>
          </nav>
          <div className="cylinder-hero-layout">
            <div className="cylinder-hero-copy">
              <p className="eyebrow">{product.eyebrow}</p>
              <h1>{product.title}</h1>
              <p className="cylinder-hero-intro">{product.intro}</p>
              <div className="cylinder-hero-actions">
                <Button to={contactUrl}>{product.contact}</Button>
                <a className="cylinder-text-link" href="#cylinder-specifications">{product.technicalLink}<span aria-hidden="true">↓</span></a>
              </div>
              <div className="cylinder-hero-signature" aria-hidden="true"><FiDroplet /><span>GOLD <span>HOT WATER</span></span></div>
            </div>
            <figure className="cylinder-hero-media">
              <ResponsivePicture source={product.assets.photo} alt={product.imageAlt} priority sizes="(max-width: 760px) 82vw, 38vw" />
              <figcaption>{product.imageCaption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <nav className="cylinder-section-nav" aria-label={product.onThisPage}>
        <div className="container">
          {product.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.label}</a>)}
        </div>
      </nav>

      <section className="cylinder-section cylinder-construction" id="cylinder-construction" aria-labelledby="cylinder-construction-heading">
        <div className="container cylinder-construction-layout">
          <div className="cylinder-construction-intro">
            <p className="eyebrow">{construction.eyebrow}</p>
            <h2 id="cylinder-construction-heading">{construction.title}</h2>
            <p>{construction.intro}</p>
            <ResponsivePicture source={product.assets.family} alt={construction.familyAlt} className="cylinder-family-picture" sizes="(max-width: 900px) 90vw, 35vw" />
          </div>
          <div className="cylinder-feature-list">
            {construction.items.map((item) => {
              const Icon = featureIcons[item.icon];
              return <article key={item.title}><span className="cylinder-feature-icon"><Icon aria-hidden="true" /></span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>;
            })}
          </div>
        </div>
      </section>

      <section className="cylinder-section cylinder-technical" id="cylinder-specifications" aria-labelledby="cylinder-technical-heading">
        <div className="container">
          <header className="cylinder-section-heading">
            <p className="eyebrow">{technical.eyebrow}</p>
            <h2 id="cylinder-technical-heading">{technical.title}</h2>
            <p>{technical.intro}</p>
          </header>
          <div className="cylinder-technical-layout">
            <div className="cylinder-tables">
              <SpecificationTable technical={technical} rows={technical.rows} caption={technical.caption} />
              <details className="cylinder-material-details">
                <summary>{technical.more}<span aria-hidden="true">+</span></summary>
                <SpecificationTable technical={technical} rows={technical.extraRows} caption={technical.more} />
              </details>
            </div>
            <aside className="cylinder-protection-note">
              <FiThermometer aria-hidden="true" />
              <h3>{technical.protectionTitle}</h3>
              <p>{technical.protectionBody}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="cylinder-section cylinder-connections" id="cylinder-connections" aria-labelledby="cylinder-connections-heading">
        <div className="container">
          <header className="cylinder-section-heading">
            <p className="eyebrow">{connections.eyebrow}</p>
            <h2 id="cylinder-connections-heading">{connections.title}</h2>
            <p>{connections.intro}</p>
          </header>
          <div className="cylinder-connections-layout">
            <figure className="cylinder-cutaway">
              <ResponsivePicture source={product.assets.cutaway} alt={connections.imageAlt} sizes="(max-width: 960px) 95vw, 62vw" />
              <figcaption><span>{connections.figureNote}</span><a href={product.assets.cutaway.fallback} target="_blank" rel="noreferrer">{connections.openDrawing}<span aria-hidden="true"> ↗</span></a></figcaption>
            </figure>
            <div className="cylinder-port-legend">
              <h3>{connections.legendTitle}</h3>
              {connections.groups.map((group) => <div className="cylinder-port-group" key={group.size}><bdi dir="ltr">{group.size}</bdi><div><h4>{group.title}</h4><ul>{group.ports.map((port) => <li key={port}>{port}</li>)}</ul></div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="cylinder-section cylinder-capacities" id="cylinder-capacities" aria-labelledby="cylinder-capacities-heading">
        <div className="container">
          <p className="eyebrow">{product.capacitiesEyebrow}</p>
          <h2 id="cylinder-capacities-heading">{product.capacitiesTitle}</h2>
          <ul className="cylinder-capacity-list">{product.capacities.map((capacity) => <li key={capacity}><strong><bdi dir="ltr">{capacity}</bdi></strong><span>{product.litre}</span></li>)}</ul>
          <p className="cylinder-capacity-note">{product.capacityNote}</p>
        </div>
      </section>

      <CtaPanel title={product.ctaTitle} body={product.ctaBody} button={product.contact} to={contactUrl} />
    </div>
  );
}
