import {
  FiActivity,
  FiBox,
  FiDroplet,
  FiGrid,
  FiHome,
  FiLayers,
  FiSliders,
  FiThermometer,
  FiWind,
} from "react-icons/fi";
import { Navigate } from "react-router";
import Button from "../components/Button";
import CtaPanel from "../components/CtaPanel";
import JsonLd from "../components/JsonLd";
import PageHero from "../components/PageHero";
import ResponsivePicture from "../components/ResponsivePicture";
import SeoLinks from "../components/SeoLinks";
import Section from "../components/Section";
import { getContent } from "../lib/content";
import { breadcrumbsJsonLd, buildMeta } from "../lib/seo";

const solutionMap = {
  "heat-pumps": "heatPumps",
  "underfloor-heating": "underfloorHeating",
};

const applicationIcons = [FiHome, FiDroplet, FiSliders];
const factorIcons = [FiActivity, FiWind, FiThermometer, FiLayers, FiGrid, FiSliders];
const planningAsset = {
  base: "/media/solutions/gold-underfloor-planning-v1",
  fallback: "/media/solutions/gold-underfloor-planning-v1.png",
  width: 1448,
  height: 1086,
  widths: [480, 768, 1200],
};

function PlanningProcess({ content }) {
  if (!content) return null;

  return (
    <section className="planning-process-section">
      <div className="container planning-process-grid">
        <div className="planning-process-media" data-reveal>
          <ResponsivePicture
            source={planningAsset}
            alt={content.imageAlt}
            className="planning-process-picture"
            imgClassName="planning-process-image"
            sizes="(max-width: 820px) 100vw, 54vw"
          />
        </div>
        <div className="planning-process-copy" data-reveal>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.intro}</p>
          <ol className="planning-process-steps">
            {content.steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{step.title}</h3><p>{step.body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function EnergyManagement({ content }) {
  if (!content) return null;

  return (
    <section className="energy-management-section">
      <div className="container energy-management-grid">
        <div className="energy-management-copy" data-reveal>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.body}</p>
          <strong>{content.closing}</strong>
        </div>
        <div className="energy-management-visual" data-reveal>
          <svg viewBox="0 0 640 260" role="img" aria-label={content.eyebrow}>
            <path className="energy-line-grid" d="M56 46H584M56 130H584M56 214H584" />
            <path className="energy-line-track" d="M56 58H228V118H402V192H584" />
            <path className="energy-line-flow" d="M56 58H228V118H402V192H584" />
            <circle cx="56" cy="58" r="8" />
            <circle cx="228" cy="118" r="8" />
            <circle cx="402" cy="192" r="8" />
            <circle cx="584" cy="192" r="8" />
          </svg>
          <ol className="energy-management-steps">
            {content.steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function meta({ params }) {
  const page = solutionMap[params.solution];
  return page ? buildMeta(params.locale, page) : [];
}

export default function SolutionPage({ params }) {
  const locale = params.locale;
  const page = solutionMap[params.solution];

  if (!page) return <Navigate replace to={`/${locale}/`} />;

  const content = getContent(locale);
  const solution = content.solutions[page];
  const isHeatPump = page === "heatPumps";

  return (
    <>
      <SeoLinks locale={locale} page={page} />
      <JsonLd data={breadcrumbsJsonLd(locale, page, solution.eyebrow)} />
      <PageHero
        locale={locale}
        eyebrow={solution.eyebrow}
        title={solution.title}
        intro={solution.intro}
        pageLabel={solution.eyebrow}
      >
        <div className="solution-hero-mark" data-reveal aria-hidden="true">
          {isHeatPump ? <FiWind /> : <FiGrid />}
          <span>{isHeatPump ? "AIR · WATER" : "WATER · FLOOR"}</span>
        </div>
      </PageHero>

      <section className="solution-overview-section">
        <div className="container solution-overview-grid">
          <div className="solution-overview-copy" data-reveal>
            <p className="eyebrow">GOLD · SYSTEM GUIDE</p>
            <h2>{solution.overview.title}</h2>
            <p>{solution.overview.body}</p>
          </div>
          {isHeatPump ? (
            <div className="solution-overview-media" data-reveal>
              <ResponsivePicture
                source={{
                  base: "/media/products/generated/gold-heat-pump-r290-80c-series-v1",
                  fallback: "/media/products/generated/gold-heat-pump-r290-80c-series-v1.png",
                  width: 1448,
                  height: 1086,
                  widths: [480, 768, 1200],
                }}
                alt={locale === "ar" ? "مضخة غولد الحرارية هواء إلى ماء" : "GOLD air-to-water heat pump"}
                className="solution-overview-picture"
                imgClassName="solution-overview-image"
                sizes="(max-width: 820px) 100vw, 52vw"
                priority
              />
            </div>
          ) : (
            <div className="floor-system-diagram" data-reveal aria-hidden="true">
              <div className="floor-room"><FiHome /></div>
              <div className="floor-heat-lines"><span /><span /><span /><span /></div>
              <div className="floor-pipe"><FiDroplet /><span /></div>
              <div className="floor-source"><FiThermometer /><small>GOLD</small></div>
            </div>
          )}
        </div>
      </section>

      <PlanningProcess content={solution.planningProcess} />

      <Section className="solution-applications" title={solution.applicationsTitle}>
        <div className="solution-application-grid">
          {solution.applications.map((item, index) => {
            const Icon = applicationIcons[index];
            return (
              <article key={item.title} data-reveal>
                <span className="solution-card-number">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <EnergyManagement content={solution.energyManagement} />

      <section className="solution-series-section">
        <div className="container solution-series-grid">
          <div className="solution-series-intro" data-reveal>
            <p className="eyebrow">{solution.eyebrow}</p>
            <h2>{solution.seriesTitle}</h2>
            <p>{solution.seriesBody}</p>
          </div>
          <div className="solution-series-list">
            {solution.series.map((item, index) => (
              <article key={item.title} data-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Section
        className="solution-factors-section"
        eyebrow={solution.eyebrow}
        title={solution.factorsTitle}
        body={solution.factorsIntro}
      >
        <div className="solution-factor-grid">
          {solution.factors.map((item, index) => {
            const Icon = factorIcons[index];
            return (
              <article key={item.title} data-reveal>
                <Icon aria-hidden="true" />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <section className="solution-next-section">
        <div className="container solution-next-panel" data-reveal>
          <div><p className="eyebrow">GOLD GROUP</p><h2>{solution.closingTitle}</h2><p>{solution.closingBody}</p></div>
          <div className="solution-next-actions">
            <Button to={`/${locale}/products/`} variant="light">{solution.primaryCta}</Button>
            <Button to={`/${locale}/contact/`} variant="ghost">{solution.secondaryCta}</Button>
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
