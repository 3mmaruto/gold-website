import { FiCheckCircle, FiCompass, FiLayers, FiTool } from "react-icons/fi";
import Button from "../components/Button";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import SeoLinks from "../components/SeoLinks";
import Section from "../components/Section";
import { getContent } from "../lib/content";
import { breadcrumbsJsonLd, buildMeta } from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "about");
}

const valueIcons = [FiLayers, FiCompass, FiCheckCircle, FiTool];

export default function AboutPage({ params }) {
  const locale = params.locale;
  const content = getContent(locale);

  return (
    <>
      <SeoLinks locale={locale} page="about" />
      <JsonLd data={breadcrumbsJsonLd(locale, "about", content.navigation.about)} />
      <PageHero
        locale={locale}
        eyebrow={content.about.eyebrow}
        title={content.about.title}
        intro={content.about.intro}
        pageLabel={content.navigation.about}
      >
        <div className="page-hero-stat" data-reveal>
          <strong>2008</strong>
          <span>{locale === "ar" ? "بداية الخبرة في السوق السوري" : "Experience in the Syrian market"}</span>
        </div>
      </PageHero>

      <Section className="story-section">
        <div className="story-grid">
          <div className="story-marker" data-reveal>
            <span>G</span>
            <div className="story-rings" aria-hidden="true" />
          </div>
          <div className="story-copy" data-reveal>
            <p className="eyebrow">{locale === "ar" ? "من الجهاز إلى المنظومة" : "From equipment to system"}</p>
            <h2>{locale === "ar" ? "نربط تفاصيل المشروع ضمن اتجاه تقني واحد." : "Connecting project details into one technical direction."}</h2>
            <p>{content.about.story}</p>
            <Button to={`/${locale}/contact/`} variant="dark">{content.about.cta}</Button>
          </div>
        </div>
      </Section>

      <Section
        className="values-section"
        eyebrow={locale === "ar" ? "طريقة عملنا" : "How we work"}
        title={locale === "ar" ? "قرارات واضحة حول نظام متكامل." : "Clear decisions around a complete system."}
      >
        <div className="values-grid">
          {content.about.values.map((value, index) => {
            const Icon = valueIcons[index];
            return (
              <article key={value.title} className="value-card" data-reveal>
                <Icon aria-hidden="true" />
                <span>0{index + 1}</span>
                <h2>{value.title}</h2>
                <p>{value.body}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <section className="approach-band">
        <div className="container approach-grid">
          {(locale === "ar"
            ? ["اختيار المنتج", "تخطيط النظام", "دعم التركيب", "تنسيق ما بعد البيع"]
            : ["Product selection", "System planning", "Installation support", "After-sales coordination"]
          ).map((item, index) => (
            <div key={item} data-reveal><span>0{index + 1}</span><strong>{item}</strong></div>
          ))}
        </div>
      </section>

      <CtaPanel
        title={locale === "ar" ? "لنبدأ من متطلبات المبنى." : "Start with the building requirements."}
        body={content.contact.intro}
        button={content.about.cta}
        to={`/${locale}/contact/`}
      />
    </>
  );
}
