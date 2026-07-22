import { useId, useState } from "react";
import { FiArrowUpRight, FiCheck, FiPlus } from "react-icons/fi";
import { Link } from "react-router";
import ResponsivePicture from "./ResponsivePicture";

export default function CatalogProductCard({ product, index, locale, ui }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];

  return (
    <article
      id={product.id}
      className={`catalog-product-card ${expanded ? "is-expanded" : ""}`}
      data-category={product.category}
    >
      <div className="catalog-product-media">
        <ResponsivePicture
          source={primaryImage}
          alt={primaryImage.alt}
          className="catalog-product-picture"
          imgClassName="catalog-product-image"
          sizes="(max-width: 620px) 100vw, (max-width: 1050px) 50vw, 38vw"
        />
        <div className="catalog-product-media-topline">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{product.categoryLabel}</strong>
        </div>
        {secondaryImage ? (
          <div className="catalog-product-variant">
            <ResponsivePicture
              source={secondaryImage}
              alt={secondaryImage.alt}
              className="catalog-product-variant-picture"
              imgClassName="catalog-product-variant-image"
              sizes="180px"
            />
            <span>{secondaryImage.label}</span>
          </div>
        ) : null}
      </div>

      <div className="catalog-product-body">
        <p className="catalog-product-kicker">GOLD · {product.categoryLabel}</p>
        <h2>{product.name}</h2>
        <p className="catalog-product-summary">{product.summary}</p>

        <div className="catalog-product-specs" aria-label={ui.essentialSpecs}>
          {product.specs.map((spec) => (
            <div key={`${spec.label}-${spec.value}`}>
              <span>{spec.label}</span>
              <strong dir={/^[\s\dA-Za-z.·%°-]+$/.test(spec.value) ? "ltr" : undefined}>{spec.value}</strong>
            </div>
          ))}
        </div>

        <div className="catalog-product-reveal" id={detailsId}>
          <strong>{ui.productHighlights}</strong>
          <ul>
            {product.highlights.map((highlight) => (
              <li key={highlight}><FiCheck aria-hidden="true" /> {highlight}</li>
            ))}
          </ul>
        </div>

        <div className="catalog-product-actions">
          <button
            type="button"
            className="catalog-detail-toggle"
            aria-expanded={expanded}
            aria-controls={detailsId}
            onClick={() => setExpanded((value) => !value)}
          >
            <span>{expanded ? ui.hideDetails : ui.revealDetails}</span>
            <FiPlus aria-hidden="true" />
          </button>
          <Link className="catalog-selection-link" to={`/${locale}/contact/?product=${product.slug}`}>
            <span>{ui.selectProduct}</span>
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
