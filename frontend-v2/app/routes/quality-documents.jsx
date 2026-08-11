import { FiActivity, FiLayers, FiTool } from "react-icons/fi";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import ResponsivePicture from "../components/ResponsivePicture";
import SeoLinks from "../components/SeoLinks";
import Section from "../components/Section";
import { getContent } from "../lib/content";
import { breadcrumbsJsonLd, buildMeta } from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "qualityDocuments");
}

const featureIcons = [FiActivity, FiTool, FiLayers];

const buildexAssets = [
  {
    base: "/media/company-events/gold-group-buildex-2025-participation-certificate",
    fallback:
      "/media/company-events/gold-group-buildex-2025-participation-certificate.jpeg",
    width: 1280,
    height: 884,
    widths: [480, 768, 1200],
  },
  {
    base: "/media/company-events/gold-group-buildex-2026-participation-certificate",
    fallback:
      "/media/company-events/gold-group-buildex-2026-participation-certificate.jpeg",
    width: 1280,
    height: 884,
    widths: [480, 768, 1200],
  },
];

export default function QualityDocumentsPage({ params }) {
  const locale = params.locale;
  const content = getContent(locale);
  const page = content.qualityDocuments;
  const emailSubject = encodeURIComponent(
    locale === "ar" ? "طلب وثائق الجودة" : "Quality document request",
  );

  return (
    <>
      <SeoLinks locale={locale} page="qualityDocuments" />
      <JsonLd
        data={breadcrumbsJsonLd(
          locale,
          "qualityDocuments",
          content.navigation.qualityDocuments,
        )}
      />

      <PageHero
        locale={locale}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        pageLabel={content.navigation.qualityDocuments}
      />

      <Section
        className="solution-applications quality-documents-section"
        eyebrow={page.sectionEyebrow}
        title={page.sectionTitle}
        body={page.sectionBody}
      >
        <div className="solution-application-grid">
          {page.features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <article key={feature.title} data-reveal>
                <Icon aria-hidden="true" />
                <span className="solution-card-number">0{index + 1}</span>
                <h2>{feature.title}</h2>
                <p>{feature.body}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section
        id="buildex-participation"
        className="quality-events-section"
        eyebrow={page.exhibitions.eyebrow}
        title={page.exhibitions.title}
        body={page.exhibitions.body}
      >
        <div className="quality-event-grid">
          {page.exhibitions.items.map((item, index) => (
            <figure className="quality-event-card" key={item.meta} data-reveal>
              <a
                className="quality-event-media"
                href={buildexAssets[index].fallback}
                target="_blank"
                rel="noreferrer"
                aria-label={item.openLabel}
              >
                <ResponsivePicture
                  source={buildexAssets[index]}
                  alt={item.imageAlt}
                  className="quality-event-picture"
                  imgClassName="quality-event-image"
                  sizes="(max-width: 820px) calc(100vw - 2rem), 50vw"
                />
              </a>
              <figcaption>
                <span>{item.meta}</span>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <CtaPanel
        title={page.cta.title}
        body={page.cta.body}
        button={page.cta.button}
        href={`mailto:${content.contact.email}?subject=${emailSubject}`}
      />
    </>
  );
}
