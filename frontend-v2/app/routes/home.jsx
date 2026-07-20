import { useRef } from "react";
import {
  FiActivity,
  FiBox,
  FiCpu,
  FiDroplet,
  FiLayers,
  FiMonitor,
  FiRefreshCw,
  FiThermometer,
  FiWifi,
  FiWind,
} from "react-icons/fi";
import Button from "../components/Button";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import ResponsivePicture from "../components/ResponsivePicture";
import SeoLinks from "../components/SeoLinks";
import Section from "../components/Section";
import { getContent } from "../lib/content";
import { buildMeta, websiteJsonLd } from "../lib/seo";

export function meta({ params }) {
  return buildMeta(params.locale, "home");
}

const benefitIcons = [FiThermometer, FiActivity, FiRefreshCw, FiDroplet];
const controllerAsset = {
  base: "/media/technology/gold-lcd-controller-v1",
  fallback: "/media/technology/gold-lcd-controller-v1.png",
  width: 1448,
  height: 1086,
  widths: [480, 768, 1200],
};

export default function HomePage({ params }) {
  const locale = params.locale;
  const content = getContent(locale);
  const hero = content.home.hero;
  const visualRef = useRef(null);

  function handlePointerMove(event) {
    const element = visualRef.current;
    if (!element || event.pointerType === "touch") return;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    element.style.setProperty("--depth-x", `${x * 8}px`);
    element.style.setProperty("--depth-y", `${y * 5}px`);
  }

  return (
    <>
      <SeoLinks locale={locale} page="home" />
      <JsonLd data={websiteJsonLd(locale)} />
      <section className="home-hero" onPointerMove={handlePointerMove} ref={visualRef}>
        <ResponsivePicture
          asset="hero"
          alt={hero.imageAlt}
          className="home-hero-media"
          imgClassName="home-hero-image"
          sizes="100vw"
          priority
        />
        <div className="home-hero-overlay" />
        <div className="home-hero-grid" aria-hidden="true" />
        <div className="container home-hero-inner">
          <div className="home-hero-copy" dir={content.dir} data-reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.title}</h1>
            <p>{hero.body}</p>
            <div className="hero-actions">
              <Button href="#system">{hero.primaryCta}</Button>
              <Button to={`/${locale}/contact/`} variant="ghost">{hero.secondaryCta}</Button>
            </div>
          </div>
          <div className="hero-badge" data-reveal>
            <span>80</span>
            <div><strong>°C</strong><small>R290</small></div>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label={content.home.technical.eyebrow}>
        <div className="container proof-grid">
          {content.home.proof.map((item, index) => (
            <div key={item.label} className="proof-item" data-reveal>
              <span className="proof-number">0{index + 1}</span>
              <strong dir="ltr">{item.value}</strong>
              <p>{item.label}</p>
              <small>{item.note}</small>
            </div>
          ))}
        </div>
      </section>

      <Section
        id="system"
        className="system-section"
        eyebrow={content.home.systemIntro.eyebrow}
        title={content.home.systemIntro.title}
        body={content.home.systemIntro.body}
      >
        <div className="system-layout">
          <div className="system-diagram" aria-hidden="true" data-reveal>
            <div className="thermal-orbit thermal-orbit--outer" />
            <div className="thermal-orbit thermal-orbit--inner" />
            <div className="system-core">
              <FiRefreshCw />
              <span>R290</span>
            </div>
            <span className="thermal-node thermal-node--air"><FiWind /></span>
            <span className="thermal-node thermal-node--heat"><FiThermometer /></span>
            <span className="thermal-node thermal-node--water"><FiDroplet /></span>
          </div>
          <ol className="system-steps">
            {content.home.systemIntro.steps.map((step, index) => (
              <li key={step} data-reveal>
                <span>0{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="benefits-section" title={content.home.benefits.title}>
        <div className="benefit-grid">
          {content.home.benefits.items.map((item, index) => {
            const Icon = benefitIcons[index];
            return (
              <article className="benefit-card" key={item.title} data-reveal>
                <div className="benefit-icon"><Icon aria-hidden="true" /></div>
                <span>0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section
        className="solutions-preview-section"
        eyebrow={content.home.solutions.eyebrow}
        title={content.home.solutions.title}
        body={content.home.solutions.body}
      >
        <div className="solutions-preview-grid">
          <article className="solutions-preview-card solutions-preview-card--heat-pump" data-reveal>
            <span>01</span>
            <FiWind aria-hidden="true" />
            <h3>{content.solutions.heatPumps.eyebrow}</h3>
            <p>{content.solutions.heatPumps.overview.body}</p>
            <Button to={`/${locale}/heat-pumps/`} variant="dark">
              {content.home.solutions.heatPumpsCta}
            </Button>
          </article>
          <article className="solutions-preview-card solutions-preview-card--floor" data-reveal>
            <span>02</span>
            <FiLayers aria-hidden="true" />
            <h3>{content.solutions.underfloorHeating.eyebrow}</h3>
            <p>{content.solutions.underfloorHeating.overview.body}</p>
            <Button to={`/${locale}/underfloor-heating/`} variant="dark">
              {content.home.solutions.underfloorHeatingCta}
            </Button>
          </article>
        </div>
      </Section>

      <section className="smart-control-section">
        <div className="container smart-control-grid">
          <div className="smart-control-copy" data-reveal>
            <p className="eyebrow">{content.home.smartControl.eyebrow}</p>
            <h2>{content.home.smartControl.title}</h2>
            <p>{content.home.smartControl.body}</p>
            <div className="smart-control-signals" aria-label={content.home.smartControl.eyebrow}>
              <span><FiMonitor aria-hidden="true" /> LCD</span>
              <span><FiWifi aria-hidden="true" /> Wi-Fi</span>
            </div>
          </div>
          <div className="smart-control-visual" data-reveal>
            <ResponsivePicture
              source={controllerAsset}
              alt={content.home.smartControl.imageAlt}
              className="smart-control-picture"
              imgClassName="smart-control-image"
              sizes="(max-width: 820px) 100vw, 58vw"
            />
            <span className="smart-control-index" aria-hidden="true">01 / 02</span>
          </div>
        </div>
      </section>

      <section className="technical-section">
        <div className="container technical-grid">
          <div className="technical-copy" data-reveal>
            <p className="eyebrow">{content.home.technical.eyebrow}</p>
            <h2>{content.home.technical.title}</h2>
            <p>{content.home.technical.body}</p>
            <Button href="/catalog/catalog.pdf" variant="light" download>
              {content.home.technical.cta}
            </Button>
          </div>
          <div className="technical-specs" data-reveal>
            {content.home.technical.items.map((item, index) => (
              <div key={item}>
                <span>{[<FiCpu />, <FiLayers />, <FiActivity />, <FiThermometer />, <FiRefreshCw />, <FiBox />][index]}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section
        className="products-teaser"
        eyebrow={content.home.productsTeaser.eyebrow}
        title={content.home.productsTeaser.title}
        body={content.home.productsTeaser.body}
      >
        <div className="products-feature" data-reveal>
          <ResponsivePicture
            asset="products"
            alt={content.products.imageAlt}
            className="products-feature-media"
            imgClassName="products-feature-image"
            sizes="(max-width: 900px) 100vw, 70vw"
          />
          <div className="products-feature-panel">
            <span>01 · 04</span>
            <h3>{content.products.categories.map((item) => item.name).join(" · ")}</h3>
            <Button to={`/${locale}/products/`} variant="dark">{content.home.productsTeaser.cta}</Button>
          </div>
        </div>
      </Section>

      <section className="about-band">
        <div className="container about-band-grid">
          <div className="about-year" data-reveal><span>20</span><span>08</span></div>
          <div data-reveal>
            <p className="eyebrow">{content.home.aboutTeaser.eyebrow}</p>
            <h2>{content.home.aboutTeaser.title}</h2>
            <p>{content.home.aboutTeaser.body}</p>
            <Button to={`/${locale}/about/`} variant="light">{content.home.aboutTeaser.cta}</Button>
          </div>
        </div>
      </section>

      <CtaPanel
        title={content.home.cta.title}
        body={content.home.cta.body}
        button={content.home.cta.button}
        to={`/${locale}/contact/`}
      />
    </>
  );
}
