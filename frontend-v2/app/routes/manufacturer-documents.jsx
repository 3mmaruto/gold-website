import { FiBookOpen, FiFileText, FiGlobe } from "react-icons/fi";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import ManufacturerDocumentCard from "../components/ManufacturerDocumentCard";
import PageHero from "../components/PageHero";
import SeoLinks from "../components/SeoLinks";
import Section from "../components/Section";
import { getContent } from "../lib/content";
import { getManufacturerDocuments } from "../lib/manufacturer-documents";
import {
  breadcrumbsJsonLd,
  buildMeta,
  manufacturerDocumentsJsonLd,
} from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "manufacturerDocuments");
}

const provenanceIcons = [FiFileText, FiGlobe, FiBookOpen];

export default function ManufacturerDocumentsPage({ params }) {
  const locale = params.locale;
  const content = getContent(locale);
  const page = content.manufacturerDocuments;
  const documents = getManufacturerDocuments(locale);

  return (
    <>
      <SeoLinks locale={locale} page="manufacturerDocuments" />
      <JsonLd data={[
        breadcrumbsJsonLd(
          locale,
          "manufacturerDocuments",
          content.navigation.manufacturerDocuments,
        ),
        ...manufacturerDocumentsJsonLd(locale, documents, page),
      ]} />

      <PageHero
        locale={locale}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        pageLabel={content.navigation.manufacturerDocuments}
      >
        <div className="page-hero-stat" data-reveal>
          <strong>04</strong>
          <span>{page.heroStat}</span>
        </div>
      </PageHero>

      <section className="manufacturer-provenance" aria-label={page.provenanceLabel}>
        <div className="container manufacturer-provenance-grid">
          {page.provenance.map((item, index) => {
            const Icon = provenanceIcons[index];
            return (
              <article key={item.title} data-reveal>
                <Icon aria-hidden="true" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Section
        className="manufacturer-library-section"
        eyebrow={page.libraryEyebrow}
        title={page.libraryTitle}
        body={page.libraryIntro}
      >
        <div className="manufacturer-document-grid">
          {documents.map((document) => (
            <ManufacturerDocumentCard
              key={document.id}
              document={document}
              labels={page.labels}
            />
          ))}
        </div>
      </Section>

      <section className="manufacturer-scope-band">
        <div className="container manufacturer-scope-grid">
          <p className="eyebrow">{page.scope.eyebrow}</p>
          <h2>{page.scope.title}</h2>
          <div>
            {page.scope.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <CtaPanel
        title={page.cta.title}
        body={page.cta.body}
        button={page.cta.button}
        to={`/${locale}/contact/`}
      />
    </>
  );
}
