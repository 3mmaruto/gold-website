import { FiArrowUpRight } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import JsonLd from "./JsonLd";
import ResponsivePicture from "./ResponsivePicture";
import SeoLinks from "./SeoLinks";
import { getContent, getUi } from "../lib/content";
import { productBreadcrumbsJsonLd } from "../lib/seo";
import "../styles/catalog.css";

export default function CatalogProductProfile({ locale, product }) {
  const content = getContent(locale);
  const ui = getUi(locale);
  const { state } = useLocation();
  const search = typeof state?.catalogSearch === "string" && state.catalogSearch.startsWith("?")
    ? state.catalogSearch : "";
  const catalogPath = `/${locale}/products/${search}`;

  return (
    <section className="catalog-profile">
      <SeoLinks locale={locale} productSlug={product.slug} />
      <JsonLd data={productBreadcrumbsJsonLd(locale, { slug: product.slug, shortTitle: product.name })} />
      <div className="container">
        <nav className="breadcrumbs" aria-label={locale === "ar" ? "مسار الصفحة" : "Breadcrumb"}>
          <Link to={`/${locale}/`}>{content.navigation.home}</Link>
          <span aria-hidden="true">/</span>
          <Link to={catalogPath}>{content.navigation.products}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>
        <header className="catalog-profile-header">
          <p className="eyebrow">GOLD · {product.categoryLabel}</p>
          <h1>{product.name}</h1>
          <Link className="button button--outline" to={catalogPath}>{ui.backToProducts}</Link>
        </header>
        <div className="catalog-profile-gallery">
          {product.images.map((image, index) => (
            <figure key={image.base}>
              <ResponsivePicture source={image} alt={image.alt} priority={index === 0}
                className="catalog-profile-picture" imgClassName="catalog-profile-image"
                sizes={product.images.length > 1 ? "(max-width: 768px) 100vw, 600px" : "(max-width: 1280px) 100vw, 1240px"} />
              {image.label ? <figcaption>{image.label}</figcaption> : null}
            </figure>
          ))}
        </div>
        {product.modelLinks.length ? (
          <section className="catalog-profile-models">
            <h2>{ui.modelPages}</h2>
            <nav className="catalog-model-links" aria-label={ui.modelPages}>
              {product.modelLinks.map((model) => (
                <Link key={model.model} to={`/${locale}/${model.path}`}>
                  <span><small>{model.label}</small><strong><bdi>{model.model}</bdi></strong></span>
                  <bdi>{model.capacity}</bdi><FiArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </section>
        ) : null}
      </div>
    </section>
  );
}
