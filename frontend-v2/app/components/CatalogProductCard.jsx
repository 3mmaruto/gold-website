import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import ResponsivePicture from "./ResponsivePicture";

export default function CatalogProductCard({ product, index, locale, ui }) {
  const primaryImage = product.images[0];
  const { search } = useLocation();

  return (
    <article id={product.id} className="catalog-product-card" data-category={product.category}>
      <div className="catalog-product-media">
        <ResponsivePicture
          source={primaryImage}
          alt={primaryImage.alt}
          className="catalog-product-picture"
          imgClassName="catalog-product-image"
          sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 1050px) 48vw, 400px"
        />
        <span className="catalog-product-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="catalog-product-body">
        <p className="catalog-product-kicker">{product.categoryLabel}</p>
        <h3>{product.name}</h3>
        <p className="catalog-product-summary">{product.summary}</p>
        <dl className="catalog-product-specs" aria-label={ui.essentialSpecs}>
          {product.specs.map((spec) => (
            <div key={`${spec.label}-${spec.value}`}>
              <dt>{spec.label}</dt>
              <dd><bdi>{spec.value}</bdi></dd>
            </div>
          ))}
        </dl>
        <div className="catalog-product-highlights">
          <ul aria-label={ui.productHighlights}>
            {product.highlights.map((highlight) => (
              <li key={highlight}><FiCheck aria-hidden="true" /><span>{highlight}</span></li>
            ))}
          </ul>
        </div>
        <div className="catalog-product-actions">
          <Link
            className="catalog-product-page-link"
            to={`/${locale}/${product.detailsPath}`}
            state={{ catalogSearch: search }}
            aria-label={`${ui.moreDetails} — ${product.name}`}
            prefetch="intent"
          >
            <span>{ui.moreDetails}</span><FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
