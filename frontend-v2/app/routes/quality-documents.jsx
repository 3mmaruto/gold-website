import { FiCheckCircle, FiFileText, FiMail } from "react-icons/fi";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import SeoLinks from "../components/SeoLinks";
import Section from "../components/Section";
import { getContent } from "../lib/content";
import { breadcrumbsJsonLd, buildMeta } from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "qualityDocuments");
}

const featureIcons = [FiFileText, FiCheckCircle, FiMail];

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

      <CtaPanel
        title={page.cta.title}
        body={page.cta.body}
        button={page.cta.button}
        href={`mailto:${content.contact.email}?subject=${emailSubject}`}
      />
    </>
  );
}
